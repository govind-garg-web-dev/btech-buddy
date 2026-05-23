"use client";

import { useLocalStorage } from "@mantine/hooks";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Loader2, Star, Instagram, Bug } from "lucide-react";

type Subject = {
    id: string;
    name: string;
    course: string;
    semester: string;
    branch: string | null;
    theory_paper_code: string | null;
    lab_paper_code: string | null;
};

const SearchModal = () => {
    const { isOpen, onOpen, onClose } = useSearch();
    const supabase = createClient();

    const [query, setQuery] = useState<string>("");
    const [debouncedQuery, setDebouncedQuery] = useState<string>("");
    const [data, setData] = useState<Subject[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [subjectHistory, setSubjectHistory] = useLocalStorage<string[]>({
        key: "subject-history",
        defaultValue: [],
    });

    const router = useRouter();

    const handleHistory = (path: string) => {
        setSubjectHistory((prev) => {
            let history: string[] = [];
            if (prev.includes(path)) prev.splice(prev.indexOf(path), 1);
            history = [path, ...prev];
            if (history.length > 7) history.pop();
            return history;
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdate = useCallback(
        _.debounce((value: string) => setDebouncedQuery(value), 400),
        []
    );

    useEffect(() => {
        if (query.length > 0) {
            debouncedUpdate(query);
        } else {
            setDebouncedQuery("");
            setData(null);
        }
        return () => debouncedUpdate.cancel();
    }, [query, debouncedUpdate]);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setData(null);
            return;
        }

        setIsLoading(true);
        supabase
            .from("subjects")
            .select("id, name, course, semester, branch, theory_paper_code, lab_paper_code")
            .ilike("name", `%${debouncedQuery}%`)
            .limit(15)
            .then(({ data }) => {
                setData((data as Subject[]) ?? []);
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (
                (!isOpen && e.key === "k" && (e.metaKey || e.ctrlKey)) ||
                e.key === "/"
            ) {
                if (
                    (e.target instanceof HTMLElement &&
                        e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return;
                }
                e.preventDefault();
                onOpen();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isOpen, onOpen]);

    const runCommand = useCallback(
        (command: () => unknown) => {
            onClose();
            command();
        },
        [onClose]
    );

    const navigateToSubject = (subject: Subject) => {
        const slug = subject.name.toLowerCase().split(" ").join("-");
        let path: string;

        if (subject.course === "BTECH" && subject.branch) {
            path = `/courses/btech/${subject.semester}/${subject.branch.toLowerCase()}/${slug}`;
        } else {
            path = `/courses/bca/${subject.semester}/${slug}`;
        }

        runCommand(() => {
            handleHistory(path);
            router.push(path);
        });
    };

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    setQuery("");
                }
            }}
            className="[&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2"
            dialogClassName="border-none outline-none"
        >
            <CommandInput
                placeholder="Search subjects..."
                containerClassName="border-none"
                value={query}
                onValueChange={setQuery}
                isLoading={isLoading}
            />
            <CommandList>
                <CommandEmpty className="mx-auto flex min-h-[9rem] w-full items-center justify-center text-sm">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : query.length > 0 ? (
                        "No subjects found."
                    ) : (
                        "Start typing to search subjects..."
                    )}
                </CommandEmpty>

                {data && data.length > 0 && (
                    <CommandGroup heading="Subjects">
                        {data.map((subject) => (
                            <CommandItem
                                key={subject.id}
                                value={`${subject.name} ${subject.theory_paper_code} ${subject.semester} ${subject.branch}`}
                                className="group cursor-pointer text-xs font-semibold"
                                onSelect={() => navigateToSubject(subject)}
                            >
                                <div className="flex w-full flex-col gap-2.5">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-ellipsis text-xs text-muted-foreground group-aria-selected:text-foreground">
                                            {subject.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {subject.theory_paper_code && (
                                                <Badge
                                                    variant="outline"
                                                    className="whitespace-nowrap rounded-md border-secondary bg-background text-xs font-normal text-muted-foreground group-aria-selected:text-foreground"
                                                >
                                                    {subject.theory_paper_code}
                                                </Badge>
                                            )}
                                            {subject.lab_paper_code && (
                                                <Badge
                                                    variant="outline"
                                                    className="whitespace-nowrap rounded-md border-secondary bg-background text-xs font-normal text-muted-foreground group-aria-selected:text-foreground"
                                                >
                                                    {subject.lab_paper_code}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="rounded-md border-secondary bg-background font-normal text-muted-foreground duration-0 group-aria-selected:bg-primary group-aria-selected:text-primary-foreground"
                                        >
                                            {subject.course}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="rounded-md border-secondary bg-background font-normal text-muted-foreground duration-0 group-aria-selected:bg-primary group-aria-selected:text-primary-foreground"
                                        >
                                            {subject.semester}
                                        </Badge>
                                        {subject.branch && (
                                            <Badge
                                                variant="outline"
                                                className="rounded-md border-secondary bg-background text-xs font-normal text-muted-foreground"
                                            >
                                                {subject.branch}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {subjectHistory.length > 0 && (
                    <>
                        {data && <CommandSeparator />}
                        <CommandGroup heading="Recent">
                            {subjectHistory.map((path) => (
                                <CommandItem
                                    key={path}
                                    className="group cursor-pointer text-xs font-normal"
                                    value={path}
                                    onSelect={() => {
                                        runCommand(() => {
                                            handleHistory(path);
                                            router.push(path);
                                        });
                                    }}
                                >
                                    <p className="truncate text-ellipsis text-xs text-muted-foreground group-aria-selected:font-semibold group-aria-selected:text-foreground">
                                        {_.startCase(
                                            path.split("/").pop()
                                        )
                                            ?.split("-")
                                            .join(" ")}
                                    </p>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                <CommandSeparator />
                <CommandGroup heading="Quick Links">
                    <CommandItem
                        value="github star"
                        className="group cursor-pointer text-xs font-normal"
                        onSelect={() =>
                            runCommand(() =>
                                window.open(
                                    "https://github.com/govind-garg-web-dev/btech-buddy",
                                    "_blank"
                                )
                            )
                        }
                    >
                        <div className="flex w-full items-center gap-2">
                            <Star className="h-4 w-4 stroke-muted group-aria-selected:stroke-primary" />
                            <p className="text-muted-foreground group-aria-selected:font-semibold group-aria-selected:text-foreground">
                                Star us on GitHub
                            </p>
                        </div>
                    </CommandItem>
                    <CommandItem
                        value="instagram follow"
                        className="group cursor-pointer text-xs font-normal"
                        onSelect={() =>
                            runCommand(() =>
                                window.open(
                                    "https://www.instagram.com/",
                                    "_blank"
                                )
                            )
                        }
                    >
                        <div className="flex w-full items-center gap-2">
                            <Instagram className="h-4 w-4 stroke-muted group-aria-selected:stroke-primary" />
                            <p className="text-muted-foreground group-aria-selected:font-semibold group-aria-selected:text-foreground">
                                Follow on Instagram
                            </p>
                        </div>
                    </CommandItem>
                    <CommandItem
                        value="report bug issue"
                        className="group cursor-pointer text-xs font-normal"
                        onSelect={() =>
                            runCommand(() =>
                                window.open(
                                    "https://github.com/govind-garg-web-dev/btech-buddy/issues",
                                    "_blank"
                                )
                            )
                        }
                    >
                        <div className="flex w-full items-center gap-2">
                            <Bug className="h-4 w-4 stroke-muted group-aria-selected:stroke-primary" />
                            <p className="text-muted-foreground group-aria-selected:font-semibold group-aria-selected:text-foreground">
                                Report an issue
                            </p>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default SearchModal;
