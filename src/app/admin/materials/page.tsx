"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Trash2, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type Subject = { id: string; name: string; course: string; semester: string; branch: string | null };
type Material = {
    id: string;
    subject_id: string;
    type: string;
    title: string;
    file_path: string;
    file_url: string;
    created_at: string;
    subjects?: { name: string };
};

const MATERIAL_TYPES = [
    { value: "notes", label: "Notes" },
    { value: "pyq", label: "Previous Year Questions (PYQ)" },
    { value: "books", label: "Books" },
    { value: "lab", label: "Lab / Practical Files" },
];

export default function AdminMaterials() {
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Upload form state
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Filter
    const [filterSubject, setFilterSubject] = useState("all");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        fetchSubjects();
        fetchMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterSubject, filterType]);

    const fetchSubjects = async () => {
        const { data } = await supabase
            .from("subjects")
            .select("id, name, course, semester, branch")
            .order("name");
        setSubjects((data as Subject[]) ?? []);
    };

    const fetchMaterials = async () => {
        setLoadingMaterials(true);
        let query = supabase
            .from("materials")
            .select("*, subjects(name)")
            .order("created_at", { ascending: false });
        if (filterSubject !== "all") query = query.eq("subject_id", filterSubject);
        if (filterType !== "all") query = query.eq("type", filterType);
        const { data } = await query;
        setMaterials((data as Material[]) ?? []);
        setLoadingMaterials(false);
    };

    const handleUpload = async () => {
        if (!selectedSubject || !selectedType || !title.trim() || !file) {
            toast.error("Please fill all fields and select a file.");
            return;
        }

        setUploading(true);
        setUploadProgress(10);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${title.replace(/\s+/g, "-").toLowerCase()}.${fileExt}`;
        const filePath = `${selectedType}/${selectedSubject}/${fileName}`;

        setUploadProgress(30);

        const { error: uploadError } = await supabase.storage
            .from("materials")
            .upload(filePath, file, { upsert: false });

        if (uploadError) {
            toast.error("Upload failed: " + uploadError.message);
            setUploading(false);
            setUploadProgress(0);
            return;
        }

        setUploadProgress(70);

        const { data: urlData } = supabase.storage
            .from("materials")
            .getPublicUrl(filePath);

        const fileUrl = urlData.publicUrl;

        const { error: dbError } = await supabase.from("materials").insert({
            subject_id: selectedSubject,
            type: selectedType,
            title: title.trim(),
            file_path: filePath,
            file_url: fileUrl,
        });

        setUploadProgress(100);

        if (dbError) {
            toast.error("Database error: " + dbError.message);
        } else {
            toast.success("Material uploaded successfully!");
            setTitle("");
            setFile(null);
            setSelectedSubject("");
            setSelectedType("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchMaterials();
        }

        setUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
    };

    const deleteMaterial = async (material: Material) => {
        if (!confirm(`Delete "${material.title}"?`)) return;

        const { error: storageError } = await supabase.storage
            .from("materials")
            .remove([material.file_path]);

        if (storageError) {
            toast.error("Failed to delete file: " + storageError.message);
            return;
        }

        const { error: dbError } = await supabase
            .from("materials")
            .delete()
            .eq("id", material.id);

        if (dbError) {
            toast.error("Failed to delete record: " + dbError.message);
        } else {
            toast.success("Material deleted.");
            fetchMaterials();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Materials</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload notes, PYQs, books, and lab files.
                </p>
            </div>

            {/* Upload Card */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload New Material
                    </CardTitle>
                    <CardDescription>
                        Select a subject, type, give it a title, and upload a
                        PDF.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label>Subject *</Label>
                            <Select
                                value={selectedSubject}
                                onValueChange={setSelectedSubject}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}{" "}
                                            <span className="text-muted-foreground">
                                                ({s.course} · {s.semester}
                                                {s.branch ? ` · ${s.branch}` : ""})
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Material Type *</Label>
                            <Select
                                value={selectedType}
                                onValueChange={setSelectedType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MATERIAL_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Title *</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Unit 1-3 Notes by Rahul"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>File (PDF) *</Label>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] ?? null)
                                }
                            />
                        </div>

                        <div className="sm:col-span-2 flex flex-col gap-2">
                            {uploadProgress > 0 && (
                                <Progress value={uploadProgress} className="h-2" />
                            )}
                            <Button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full sm:w-auto gap-2"
                            >
                                {uploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                                {uploading ? "Uploading..." : "Upload Material"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filter */}
            <div className="flex gap-3 flex-wrap items-center">
                <p className="text-sm font-medium text-muted-foreground">
                    Filter:
                </p>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {MATERIAL_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                                {t.label}
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
                            <TableHead>Title</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingMaterials ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8"
                                >
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : materials.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No materials uploaded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            materials.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">
                                        {m.title}
                                    </TableCell>
                                    <TableCell>
                                        {m.subjects?.name ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {m.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(
                                            m.created_at
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    window.open(
                                                        m.file_url,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    deleteMaterial(m)
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
        </div>
    );
}
