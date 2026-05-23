import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const CourseList = () => {
    return (
        <LayoutWrapper className="overflow-hidden py-20">
            <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                <div className="flex items-center justify-between gap-5 lg:flex-col lg:items-start">
                    <div className="prose prose-neutral dark:prose-invert">
                        <h2>Unleash Your Academic Odyssey</h2>
                        <p>Charting a course for every IPU program.</p>
                    </div>
                </div>
                <div className="grid h-48 w-full grid-cols-2 gap-2 lg:h-auto lg:w-1/2">
                    <Link
                        href="/courses/btech"
                        className={cn(
                            buttonVariants({
                                variant: "secondary",
                                className: "h-full w-full shadow-2xl",
                            })
                        )}
                    >
                        B.Tech
                    </Link>
                    <Link
                        href="/courses/bca"
                        className={cn(
                            buttonVariants({
                                variant: "secondary",
                                className:
                                    "row-start-2 h-full w-full shadow-2xl",
                            })
                        )}
                    >
                        BCA
                    </Link>
                    <div
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                className:
                                    "hover:text-foreground, pointer-events-none col-start-2 row-span-2 h-full w-full shadow-2xl hover:bg-background",
                            })
                        )}
                    >
                        Coming Soon...
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default CourseList;
