import LayoutWrapper from "@/layouts/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Changelog",
    description:
        "See what's new on BtechBuddy — updates, improvements, and new features.",
};

const releases = [
    {
        version: "v1.0.0",
        date: "2026-05-23",
        notes: "Initial launch of BtechBuddy. Access syllabus, notes, PYQs for B.Tech and BCA at GGSIPU.",
    },
];

export default function Changelog() {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="flex flex-col items-center gap-y-2">
                <div className="prose prose-sm prose-neutral dark:prose-invert md:prose-base">
                    <h1 className="text-center">
                        Changelog{" "}
                        <span className="text-highlight">Chronicles</span>
                    </h1>
                </div>
                <div className="prose prose-sm prose-neutral dark:prose-invert">
                    <p className="text-center">
                        What&apos;s new on BtechBuddy.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 py-20 md:grid-cols-3">
                {releases.map((r) => (
                    <div
                        key={r.version}
                        className="block select-none space-y-1 rounded-md border bg-card p-4 leading-none shadow-sm"
                    >
                        <div className="text-sm font-semibold">{r.version}</div>
                        <p className="text-xs text-muted-foreground">
                            {r.date}
                        </p>
                        <p className="text-sm text-muted-foreground pt-2">
                            {r.notes}
                        </p>
                    </div>
                ))}
            </div>
        </LayoutWrapper>
    );
}
