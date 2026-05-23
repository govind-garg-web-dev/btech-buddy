import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const Hero = () => {
    return (
        <div className="radial-top w-full">
            <LayoutWrapper className="flex flex-col items-center justify-center gap-10 p-10">
                <div className="flex flex-col items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-black shadow-lg">
                        BB
                    </div>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="prose prose-sm prose-neutral dark:prose-invert md:prose-base">
                        <h1 className="text-center">
                            <span className="text-highlight">BtechBuddy</span>{" "}
                            is Your academic GPS. Navigate studies effortlessly.
                        </h1>
                    </div>
                    <div className="prose prose-sm prose-neutral dark:prose-invert">
                        <p className="text-center">
                            Your complete companion for B.Tech at GGSIPU.
                            Access syllabi, handwritten notes, PYQs, and
                            practical files — all in one place.
                        </p>
                    </div>
                </div>
                <Link
                    href="/courses"
                    className={cn(
                        buttonVariants({
                            variant: "default",
                            className: "z-10",
                        })
                    )}
                >
                    Browse Courses
                </Link>
            </LayoutWrapper>
        </div>
    );
};

export default Hero;
