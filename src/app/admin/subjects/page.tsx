"use client";

import { createClient } from "@/lib/supabase/client";
import { branchList, semesterList, bcaSemesterList } from "@/config";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

type Subject = {
    id: string;
    name: string;
    course: string;
    semester: string;
    branch: string | null;
    theory_paper_code: string | null;
    lab_paper_code: string | null;
    theory_credits: number;
    lab_credits: number;
    course_category: string | null;
    theory_units: { unit: number; topics: string[] }[];
    lab_units: unknown[];
    created_at: string;
};

const subjectSchema = z.object({
    name: z.string().min(2, "Name is required"),
    course: z.enum(["BTECH", "BCA"]),
    semester: z.string().min(1, "Semester is required"),
    branch: z.string().optional(),
    theory_paper_code: z.string().optional(),
    lab_paper_code: z.string().optional(),
    theory_credits: z.coerce.number().min(0).max(10),
    lab_credits: z.coerce.number().min(0).max(10),
    course_category: z.string().optional(),
    theory_units_raw: z.string().optional(),
});

type SubjectForm = z.infer<typeof subjectSchema>;

export default function AdminSubjects() {
    const supabase = createClient();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Subject | null>(null);
    const [saving, setSaving] = useState(false);
    const [filterCourse, setFilterCourse] = useState<string>("all");
    const [filterSemester, setFilterSemester] = useState<string>("all");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<SubjectForm>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            course: "BTECH",
            theory_credits: 4,
            lab_credits: 0,
        },
    });

    const selectedCourse = watch("course");

    const fetchSubjects = async () => {
        setLoading(true);
        let query = supabase.from("subjects").select("*").order("name");
        if (filterCourse !== "all") query = query.eq("course", filterCourse);
        if (filterSemester !== "all")
            query = query.eq("semester", filterSemester);
        const { data } = await query;
        setSubjects((data as Subject[]) ?? []);
        setLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterCourse, filterSemester]);

    const openAdd = () => {
        setEditing(null);
        reset({
            course: "BTECH",
            theory_credits: 4,
            lab_credits: 0,
            semester: "",
        });
        setOpen(true);
    };

    const openEdit = (sub: Subject) => {
        setEditing(sub);
        reset({
            name: sub.name,
            course: sub.course as "BTECH" | "BCA",
            semester: sub.semester,
            branch: sub.branch ?? undefined,
            theory_paper_code: sub.theory_paper_code ?? undefined,
            lab_paper_code: sub.lab_paper_code ?? undefined,
            theory_credits: sub.theory_credits,
            lab_credits: sub.lab_credits,
            course_category: sub.course_category ?? undefined,
            theory_units_raw: sub.theory_units
                ? JSON.stringify(sub.theory_units, null, 2)
                : "",
        });
        setOpen(true);
    };

    const onSubmit = async (values: SubjectForm) => {
        setSaving(true);
        let theory_units = [];
        try {
            if (values.theory_units_raw) {
                theory_units = JSON.parse(values.theory_units_raw);
            }
        } catch {
            toast.error("Theory units JSON is invalid. Please fix it.");
            setSaving(false);
            return;
        }

        const payload = {
            name: values.name,
            course: values.course,
            semester: values.semester,
            branch: values.branch || null,
            theory_paper_code: values.theory_paper_code || null,
            lab_paper_code: values.lab_paper_code || null,
            theory_credits: values.theory_credits,
            lab_credits: values.lab_credits,
            course_category: values.course_category || null,
            theory_units,
        };

        if (editing) {
            const { error } = await supabase
                .from("subjects")
                .update(payload)
                .eq("id", editing.id);
            if (error) {
                toast.error("Failed to update subject: " + error.message);
            } else {
                toast.success("Subject updated!");
                setOpen(false);
                fetchSubjects();
            }
        } else {
            const { error } = await supabase.from("subjects").insert(payload);
            if (error) {
                toast.error("Failed to add subject: " + error.message);
            } else {
                toast.success("Subject added!");
                setOpen(false);
                fetchSubjects();
            }
        }
        setSaving(false);
    };

    const deleteSubject = async (id: string) => {
        if (!confirm("Delete this subject and ALL its materials?")) return;
        const { error } = await supabase
            .from("subjects")
            .delete()
            .eq("id", id);
        if (error) {
            toast.error("Failed to delete: " + error.message);
        } else {
            toast.success("Subject deleted.");
            fetchSubjects();
        }
    };

    const allSemesters = Array.from(new Set([...semesterList, ...bcaSemesterList].map(s => s.label)));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Subjects</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={openAdd} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Subject
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="BTECH">B.Tech</SelectItem>
                        <SelectItem value="BCA">BCA</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filterSemester}
                    onValueChange={setFilterSemester}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {allSemesters.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s} Semester
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Theory Code</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : subjects.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No subjects found. Add your first subject!
                                </TableCell>
                            </TableRow>
                        ) : (
                            subjects.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">
                                        {sub.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {sub.course}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{sub.semester}</TableCell>
                                    <TableCell>
                                        {sub.branch ?? (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {sub.theory_paper_code ?? (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {sub.theory_credits}
                                        {sub.lab_credits
                                            ? `+${sub.lab_credits}`
                                            : ""}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => openEdit(sub)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    deleteSubject(sub.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Subject" : "Add Subject"}
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label>Subject Name *</Label>
                                <Input
                                    {...register("name")}
                                    placeholder="e.g. Data Structures"
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Course *</Label>
                                <Select
                                    value={selectedCourse}
                                    onValueChange={(v) =>
                                        setValue(
                                            "course",
                                            v as "BTECH" | "BCA"
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BTECH">
                                            B.Tech
                                        </SelectItem>
                                        <SelectItem value="BCA">BCA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Semester *</Label>
                                <Select
                                    value={watch("semester")}
                                    onValueChange={(v) =>
                                        setValue("semester", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(selectedCourse === "BCA"
                                            ? bcaSemesterList
                                            : semesterList
                                        ).map((s) => (
                                            <SelectItem
                                                key={s.label}
                                                value={s.label}
                                            >
                                                {s.label} Semester
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCourse === "BTECH" && (
                                <div className="flex flex-col gap-1.5">
                                    <Label>Branch</Label>
                                    <Select
                                        value={watch("branch")}
                                        onValueChange={(v) =>
                                            setValue("branch", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branchList.map((b) => (
                                                <SelectItem
                                                    key={b.value}
                                                    value={b.value}
                                                >
                                                    {b.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <Label>Theory Paper Code</Label>
                                <Input
                                    {...register("theory_paper_code")}
                                    placeholder="e.g. ETCS-301"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Lab Paper Code</Label>
                                <Input
                                    {...register("lab_paper_code")}
                                    placeholder="e.g. ETCS-351"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Theory Credits</Label>
                                <Input
                                    type="number"
                                    {...register("theory_credits")}
                                    min={0}
                                    max={10}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Lab Credits</Label>
                                <Input
                                    type="number"
                                    {...register("lab_credits")}
                                    min={0}
                                    max={10}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Course Category</Label>
                                <Input
                                    {...register("course_category")}
                                    placeholder="e.g. Program Core"
                                />
                            </div>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <Label>
                                    Theory Units{" "}
                                    <span className="text-muted-foreground text-xs">
                                        (JSON format)
                                    </span>
                                </Label>
                                <textarea
                                    {...register("theory_units_raw")}
                                    rows={8}
                                    placeholder={`[\n  { "unit": 1, "topics": ["Topic 1", "Topic 2"] },\n  { "unit": 2, "topics": ["Topic 3"] }\n]`}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editing ? "Save Changes" : "Add Subject"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
