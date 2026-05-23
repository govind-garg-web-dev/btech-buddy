import { getSubjectDetails, getSubjects } from "@/lib/supabase/queries";
import SubjectViewModal from "@/components/modals/subject-view-modal";
import SubjectList from "@/components/SubjectList";
import SubjectView from "@/components/SubjectView";
import { Courses } from "@/config";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const params = await props.params;
    const [semester, branch, subject] = params.slug;

    if (semester && branch && subject) {
        const subjectDetail = await getSubjectDetails({
            course: Courses.BTECH,
            semester,
            branch,
            subject,
        });

        if (subjectDetail) {
            return {
                title: `${semester} | ${branch.toUpperCase()} | ${subjectDetail.name}`,
                description: `Browse ${subjectDetail.name} syllabus, notes, and resources for ${semester} semester ${branch.toUpperCase()} branch on BtechBuddy.`,
            };
        }
    }

    if (semester && branch) {
        return {
            title: `${semester} | ${branch.toUpperCase()}`,
            description: `Subjects for B.Tech ${semester} semester and ${branch.toUpperCase()} branch on BtechBuddy.`,
        };
    }

    if (semester) {
        return {
            title: `${semester}`,
            description: `Browse subjects of B.Tech for ${semester} semester on BtechBuddy.`,
        };
    }

    return {
        title: "Subjects",
        description:
            "Browse subjects for BTech courses at GGSIPU on BtechBuddy.",
    };
}

export default async function Page(props: {
    params: Promise<{ slug: string[] }>;
}) {
    const params = await props.params;
    const [semester, branch, subject] = params.slug;

    if (semester && branch) {
        const subjects = await getSubjects({
            course: Courses.BTECH,
            semester,
            branch,
        });

        const subjectNames = subjects.map((s) => s.name);

        if (subject) {
            const subjectDetail = await getSubjectDetails({
                course: Courses.BTECH,
                semester,
                branch,
                subject,
            });

            if (!subjectDetail) {
                return (
                    <>
                        <SubjectList
                            course={Courses.BTECH}
                            list={subjectNames}
                        />
                        <div className="col-span-3 flex items-center justify-center p-10 text-muted-foreground lg:col-span-2">
                            Subject not found.
                        </div>
                    </>
                );
            }

            return (
                <>
                    <SubjectList course={Courses.BTECH} list={subjectNames} />
                    <SubjectView
                        course={Courses.BTECH}
                        subjectDetail={subjectDetail}
                    />
                    <SubjectViewModal subjectDetail={subjectDetail} />
                </>
            );
        }

        return (
            <>
                <SubjectList course={Courses.BTECH} list={subjectNames} />
            </>
        );
    }

    return <></>;
}
