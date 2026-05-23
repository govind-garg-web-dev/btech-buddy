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
    const [semester, subject] = params.slug;

    if (semester && subject) {
        const subjectDetail = await getSubjectDetails({
            course: Courses.BCA,
            semester,
            subject,
        });

        if (subjectDetail) {
            return {
                title: `${semester} | ${subjectDetail.name}`,
                description: `Browse ${subjectDetail.name} syllabus, notes, and resources for ${semester} semester on BtechBuddy.`,
            };
        }
    }

    if (semester) {
        return {
            title: `${semester}`,
            description: `Subjects for BCA ${semester} semester on BtechBuddy.`,
        };
    }

    return {
        title: "Subjects",
        description: "Browse subjects for BCA courses at GGSIPU on BtechBuddy.",
    };
}

export default async function Page(props: {
    params: Promise<{ slug: string[] }>;
}) {
    const params = await props.params;
    const [semester, subject] = params.slug;

    if (semester) {
        const subjects = await getSubjects({
            course: Courses.BCA,
            semester,
        });

        const subjectNames = subjects.map((s) => s.name);

        if (subject) {
            const subjectDetail = await getSubjectDetails({
                course: Courses.BCA,
                semester,
                subject,
            });

            if (!subjectDetail) {
                return (
                    <>
                        <SubjectList course={Courses.BCA} list={subjectNames} />
                        <div className="col-span-3 flex items-center justify-center p-10 text-muted-foreground lg:col-span-2">
                            Subject not found.
                        </div>
                    </>
                );
            }

            return (
                <>
                    <SubjectList course={Courses.BCA} list={subjectNames} />
                    <SubjectView
                        course={Courses.BCA}
                        subjectDetail={subjectDetail}
                    />
                    <SubjectViewModal subjectDetail={subjectDetail} />
                </>
            );
        }

        return (
            <>
                <SubjectList course={Courses.BCA} list={subjectNames} />
            </>
        );
    }

    return <></>;
}
