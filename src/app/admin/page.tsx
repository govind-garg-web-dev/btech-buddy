import { createAdminClient } from "@/lib/supabase/admin";
import { BookOpen, FileText } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
    const supabase = createAdminClient();

    const [{ count: subjectCount }, { count: materialCount }] =
        await Promise.all([
            supabase
                .from("subjects")
                .select("*", { count: "exact", head: true }),
            supabase
                .from("materials")
                .select("*", { count: "exact", head: true }),
        ]);

    const stats = [
        {
            label: "Total Subjects",
            value: subjectCount ?? 0,
            icon: BookOpen,
            href: "/admin/subjects",
            description: "Manage all subjects",
        },
        {
            label: "Total Materials",
            value: materialCount ?? 0,
            icon: FileText,
            href: "/admin/materials",
            description: "Notes, PYQs, Books, Lab files",
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to the BtechBuddy admin panel.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                    <Card key={stat.label} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                            <Link href={stat.href} className="mt-3 inline-block">
                                <Button size="sm" variant="outline">
                                    Manage →
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                    <CardDescription>
                        How to add content to BtechBuddy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>
                            Go to{" "}
                            <Link
                                href="/admin/subjects"
                                className="text-primary underline"
                            >
                                Subjects
                            </Link>{" "}
                            and add a subject (name, semester, branch, paper
                            code, credits, syllabus units).
                        </li>
                        <li>
                            Go to{" "}
                            <Link
                                href="/admin/materials"
                                className="text-primary underline"
                            >
                                Materials
                            </Link>{" "}
                            and upload a PDF (notes, PYQ, book, or lab file)
                            linked to that subject.
                        </li>
                        <li>
                            Students can immediately access the material on the
                            main site.
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
