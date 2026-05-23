import { FeedbackFormTrigger } from "@/components/FeedbackForm";
import { buttonVariants } from "@/components/ui/button";
import LayoutWrapper from "@/layouts/LayoutWrapper";
import { cn } from "@/lib/utils";
import { Instagram, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Have questions, suggestions, or just want to say hello? Reach out to the BtechBuddy team. Your feedback helps us improve and serve GGSIPU students better.",
    openGraph: {
        title: "BtechBuddy | Contact Us",
        description:
            "Have questions, suggestions, or just want to say hello? Reach out to the BtechBuddy team.",
        url: "https://btechbuddy.live/contact-us",
        siteName: "BtechBuddy",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "BtechBuddy | Contact Us",
        description:
            "Have questions, suggestions, or just want to say hello? Reach out to the BtechBuddy team.",
        card: "summary_large_image",
        site: "https://btechbuddy.live/contact-us",
    },
};

const Page = () => {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="flex flex-col items-center gap-y-2">
                <div className="prose prose-sm prose-neutral dark:prose-invert md:prose-base">
                    <h1 className="text-center">
                        Let&apos;s Connect: Reach Out to{" "}
                        <span className="text-highlight">BtechBuddy</span>
                    </h1>
                </div>
                <div className="prose prose-sm prose-neutral dark:prose-invert">
                    <p className="text-center">
                        Have a question, suggestion, or just want to say hello?
                        Our Contact Us page is the portal to connect with the
                        BtechBuddy team.
                    </p>
                </div>
            </div>
            <div className="grid items-center gap-5 py-10 md:grid-cols-3 md:justify-center">
                <FeedbackFormTrigger />
                <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ className: "gap-2" }))}
                >
                    DM on Instagram <Instagram className="h-4 w-4" />
                </a>
                <a
                    href="mailto:govindgarg.ne@gmail.com"
                    target="_blank"
                    className={cn(buttonVariants({ className: "gap-2" }))}
                >
                    Mail us <Mail className="h-4 w-4" />
                </a>
            </div>
        </LayoutWrapper>
    );
};

export default Page;
