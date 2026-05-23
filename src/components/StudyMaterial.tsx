"use client";

import { Tab } from "@/config";
import { useEmbed } from "@/hooks/use-embed";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    Download,
    ExternalLink,
    RotateCw,
} from "lucide-react";
import AccessibleToolTip from "./ui/accessible-tooltip";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { TabsContent } from "./ui/tabs";

type Material = {
    id: string;
    subject_id: string;
    type: string;
    title: string;
    file_path: string;
    file_url: string;
    created_at: string;
};

const MATERIAL_TYPE_MAP: Partial<Record<Tab, string>> = {
    [Tab.NOTES]: "notes",
    [Tab.PYQ]: "pyq",
    [Tab.BOOKS]: "books",
    [Tab.FILES]: "lab",
};

interface StudyMaterialProps {
    tab: Tab;
    subjectId: string;
}

const StudyMaterial = ({ tab, subjectId }: StudyMaterialProps) => {
    const embed = useEmbed();
    const supabase = createClient();

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ["materials", subjectId, tab],
        queryFn: async () => {
            const type = MATERIAL_TYPE_MAP[tab];
            if (!type) return [];

            const { data, error } = await supabase
                .from("materials")
                .select("*")
                .eq("subject_id", subjectId)
                .eq("type", type)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data as Material[]) ?? [];
        },
        enabled: Object.keys(MATERIAL_TYPE_MAP).includes(tab),
    });

    return (
        <TabsContent value={tab}>
            <div className="mb-2 flex items-center justify-end gap-2">
                <AccessibleToolTip label="Refresh">
                    <Button
                        variant="secondary"
                        size="icon"
                        disabled={isFetching}
                        onClick={() => refetch()}
                    >
                        <RotateCw
                            className={cn(
                                "h-4 w-4",
                                isFetching ? "animate-spin" : ""
                            )}
                        />
                    </Button>
                </AccessibleToolTip>
            </div>

            {error ? <StudyMaterial.Error /> : null}
            {isLoading ? <StudyMaterial.Skeleton /> : null}

            {data && !error && (
                <div className="grid grid-cols-2 gap-4 rounded-md bg-accent p-1.5 md:grid-cols-3 xl:grid-cols-4">
                    {data.length === 0 ? (
                        <StudyMaterial.Empty />
                    ) : (
                        data.map((d) => (
                            <div
                                key={d.id}
                                className={cn(
                                    "relative flex flex-col justify-center rounded-md bg-background text-foreground hover:bg-background/90 cursor-pointer"
                                )}
                                onClick={() =>
                                    embed.onOpen({
                                        embedLink: d.file_url,
                                        name: d.title,
                                        embedId: d.id,
                                    })
                                }
                            >
                                {new Date(d.created_at).getTime() >
                                    Date.now() - 2 * 24 * 60 * 60 * 1000 && (
                                    <div className="absolute left-1 top-1 h-2 w-2 animate-pulse rounded-full bg-primary" />
                                )}
                                <span
                                    role="button"
                                    title={d.title}
                                    className="h-10 truncate rounded-t-md px-4 py-2 text-center text-sm font-semibold"
                                >
                                    {d.title}
                                </span>
                                <div className="flex w-full items-center justify-start gap-2 px-2 pb-2">
                                    <AccessibleToolTip label="Open in new tab">
                                        <div
                                            role="button"
                                            title={`Open ${d.title}`}
                                            className="flex items-center rounded-md border border-border bg-secondary/30 p-1.5 font-semibold text-foreground hover:bg-secondary/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                    d.file_url,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </div>
                                    </AccessibleToolTip>
                                    <AccessibleToolTip label={`Download ${d.title}`}>
                                        <div
                                            role="button"
                                            title={`Download ${d.title}`}
                                            className="flex items-center rounded-md border border-border bg-secondary/30 p-1.5 font-semibold text-foreground hover:bg-secondary/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const a =
                                                    document.createElement(
                                                        "a"
                                                    );
                                                a.href = d.file_url;
                                                a.download = d.title;
                                                a.click();
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </div>
                                    </AccessibleToolTip>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </TabsContent>
    );
};

StudyMaterial.Skeleton = function StudyMaterialSkeleton() {
    return (
        <div className="grid gap-5 rounded-md bg-accent p-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-10 w-full bg-background" />
            <Skeleton className="h-10 w-full bg-background" />
            <Skeleton className="h-10 w-full bg-background" />
            <Skeleton className="h-10 w-full bg-background" />
        </div>
    );
};

StudyMaterial.Error = function StudyMaterialError() {
    return (
        <Alert variant="secondary" className="border-0">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Failed to load materials</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again.
            </AlertDescription>
        </Alert>
    );
};

StudyMaterial.Empty = function StudyMaterialEmpty() {
    return (
        <Alert variant="secondary" className="border-0 col-span-full">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>No materials found!</AlertTitle>
            <AlertDescription>
                No materials have been uploaded for this subject yet. Check
                back soon!
            </AlertDescription>
        </Alert>
    );
};

export default StudyMaterial;
