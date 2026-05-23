import "server-only";
import { createClient } from "./server";
import { Courses } from "@/config";

export type Subject = {
    id: string;
    name: string;
    course: string;
    semester: string;
    branch: string | null;
    theory_paper_code: string | null;
    lab_paper_code: string | null;
    theory_credits: number;
    lab_credits: number;
    theory_units: { unit: number; topics: string[] }[];
    lab_units: {
        experiment: number;
        aim: { objective: string; steps: string[] };
    }[];
    course_category: string | null;
    created_at: string;
};

export type Material = {
    id: string;
    subject_id: string;
    type: "notes" | "pyq" | "books" | "lab";
    title: string;
    file_path: string;
    file_url: string;
    created_at: string;
};

export async function getSubjects({
    course,
    semester,
    branch,
}: {
    course: Courses;
    semester: string;
    branch?: string;
}): Promise<Subject[]> {
    const supabase = await createClient();

    let query = supabase
        .from("subjects")
        .select("*")
        .eq("course", course)
        .eq("semester", semester)
        .order("name");

    if (branch) {
        query = query.eq("branch", branch.toUpperCase());
    }

    const { data, error } = await query;
    if (error) return [];
    return (data as Subject[]) ?? [];
}

export async function getSubjectDetails({
    course,
    semester,
    branch,
    subject,
}: {
    course: Courses;
    semester: string;
    branch?: string;
    subject: string;
}): Promise<Subject | null> {
    const supabase = await createClient();

    const subjectName = decodeURIComponent(subject)
        .split("-")
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

    let query = supabase
        .from("subjects")
        .select("*")
        .eq("course", course)
        .eq("semester", semester)
        .ilike("name", subjectName);

    if (branch) {
        query = query.eq("branch", branch.toUpperCase());
    }

    const { data, error } = await query.limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as Subject;
}

export async function searchSubjects({
    query,
}: {
    query: string;
}): Promise<Subject[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(20);

    if (error) return [];
    return (data as Subject[]) ?? [];
}
