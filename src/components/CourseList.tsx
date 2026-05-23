import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Cpu } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface CourseCardProps {
    href: string;
    name: string;
    full: string;
    description: string;
    tags: string[];
    icon: "cpu" | "code";
}

const courseList: CourseCardProps[] = [
    {
        href: "/courses/btech",
        icon: "cpu",
        name: "B.Tech",
        full: "Bachelor of Technology",
        description:
            "Engineering disciplines across CSE, IT, ECE, Mechanical and more. 8 semesters of structured curriculum with branch-specific materials.",
        tags: ["CSE", "IT", "ECE", "ME", "Civil", "8 Semesters"],
    },
    {
        href: "/courses/bca",
        icon: "code",
        name: "BCA",
        full: "Bachelor of Computer Applications",
        description:
            "A focused computer science program covering programming, databases, networks, and software development across 6 semesters.",
        tags: ["Programming", "DBMS", "Networks", "6 Semesters"],
    },
];

const CourseList = () => {
    return (
        <div className="w-full border-b">
            <LayoutWrapper className="py-20">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
                            Courses
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Choose your program
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {courseList.map((course) => (
                            <div
                                key={course.href}
                                className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/30"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    {course.icon === "cpu" ? (
                                        <Cpu className="h-6 w-6" />
                                    ) : (
                                        <Code className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xl font-bold">
                                        {course.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {course.full}
                                    </p>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {course.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {course.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={course.href}
                                    className={cn(
                                        buttonVariants({
                                            variant: "default",
                                            className: "mt-auto gap-2",
                                        })
                                    )}
                                >
                                    Explore {course.name}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default CourseList;
