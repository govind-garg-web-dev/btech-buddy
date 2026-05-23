import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import { Gift, Heart, MessageSquarePlus, Star } from "lucide-react";
import { buttonVariants } from "./ui/button";

const Pricing = () => {
    return (
        <LayoutWrapper className="py-20">
            <div className="mx-auto flex max-w-md flex-col justify-center gap-8">
                <div className="prose prose-neutral self-center text-center dark:prose-invert">
                    <h2 className="mb-2 text-3xl font-bold">Pricing</h2>
                    <p className="text-muted-foreground">
                        No wallet required! BtechBuddy is completely free.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <a
                        href="https://github.com/govind-garg-web-dev/btech-buddy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                className:
                                    "h-12 w-full items-center justify-start gap-2",
                            })
                        )}
                    >
                        <Star className="h-5 w-5 fill-highlight text-highlight" />
                        Star us on GitHub
                    </a>
                    <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                className:
                                    "h-12 w-full items-center justify-start gap-2",
                            })
                        )}
                    >
                        <Heart className="h-5 w-5 fill-highlight text-highlight" />
                        Follow us on Instagram
                    </a>
                    <a
                        href="mailto:govindgarg.ne@gmail.com"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                className:
                                    "h-12 w-full items-center justify-start gap-2",
                            })
                        )}
                    >
                        <MessageSquarePlus className="h-5 w-5 fill-highlight text-highlight" />
                        Give us feedback
                    </a>
                    <div className="mt-2 flex flex-col items-center gap-4 rounded-lg border border-secondary p-6">
                        <Gift className="h-20 w-20 stroke-1 text-highlight" />
                        <p className="text-center text-sm text-muted-foreground">
                            Contribute notes & study materials to help your
                            fellow students!
                        </p>
                        <a
                            href="mailto:govindgarg.ne@gmail.com"
                            className={cn(
                                buttonVariants({
                                    className: "h-10 w-full items-center gap-2",
                                })
                            )}
                        >
                            Contribute Materials
                        </a>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Pricing;
