import LayoutWrapper from "@/layouts/LayoutWrapper";
import { Metadata } from "next";
import { Github, Instagram, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Meet the team behind BtechBuddy — building the best academic resource hub for GGSIPU students.",
};

const team = [
    {
        name: "Govind Garg",
        role: "Founder & Developer",
        github: "https://github.com/govind-garg-web-dev",
        instagram: "https://instagram.com/",
        website: "https://btechbuddy.live",
    },
];

export default function AboutUs() {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="flex flex-col items-center gap-y-2">
                <div className="prose prose-sm prose-neutral dark:prose-invert md:prose-base">
                    <h1 className="text-center">
                        Unveiling the Minds Behind{" "}
                        <span className="text-highlight">BtechBuddy</span>
                    </h1>
                </div>
                <div className="prose prose-sm prose-neutral dark:prose-invert">
                    <p className="text-center">
                        Built by students, for students. We know the struggle —
                        so we built the solution.
                    </p>
                </div>
            </div>

            <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                    <div
                        key={member.name}
                        className="w-full rounded-md bg-accent p-5 shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="prose prose-neutral dark:prose-invert">
                                <h2 className="mb-0">{member.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {member.role}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={member.website}
                                    className={cn(
                                        buttonVariants({
                                            variant: "outline",
                                            size: "icon",
                                        })
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Globe className="h-4 w-4" />
                                </a>
                                <a
                                    href={member.github}
                                    className={cn(
                                        buttonVariants({
                                            variant: "outline",
                                            size: "icon",
                                        })
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                                <a
                                    href={member.instagram}
                                    className={cn(
                                        buttonVariants({
                                            variant: "outline",
                                            size: "icon",
                                        })
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </LayoutWrapper>
    );
}
