import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import { BookOpen, FlaskConical, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const statCards = [
    { icon: GraduationCap, value: "8", label: "Semesters" },
    { icon: Layers, value: "4+", label: "Branches" },
    { icon: BookOpen, value: "2", label: "Courses" },
];

const materialTags = ["Syllabus", "Notes", "PYQs", "Lab Files"];

const Hero = () => {
    return (
        <div className="w-full border-b">
            <LayoutWrapper className="py-16 md:py-24">
                <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex max-w-xl flex-col gap-7">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-highlight" />
                            Free for all GGSIPU students
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-[3.25rem]">
                                Your complete IPU{" "}
                                <span className="text-highlight">
                                    study companion.
                                </span>
                            </h1>
                            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                                Syllabus, handwritten notes, PYQs, and practical
                                files — organized by semester and branch, all in
                                one place.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/courses/btech"
                                className={cn(
                                    buttonVariants({
                                        variant: "default",
                                        className: "h-11 px-6",
                                    })
                                )}
                            >
                                Browse B.Tech
                            </Link>
                            <Link
                                href="/courses/bca"
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        className: "h-11 px-6",
                                    })
                                )}
                            >
                                Browse BCA
                            </Link>
                        </div>
                    </div>

                    <div className="w-full shrink-0 lg:max-w-sm">
                        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="border-b px-5 py-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    What&apos;s inside
                                </p>
                            </div>
                            <div className="grid grid-cols-3 divide-x border-b">
                                {statCards.map(({ icon: Icon, value, label }) => (
                                    <div
                                        key={label}
                                        className="flex flex-col gap-2 p-4"
                                    >
                                        <Icon className="h-4 w-4 text-highlight" />
                                        <p className="text-2xl font-bold">
                                            {value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 p-5">
                                <div className="flex items-center gap-2">
                                    <FlaskConical className="h-4 w-4 text-highlight" />
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Material types
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {materialTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md border bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default Hero;
