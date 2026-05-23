import ClientSearchCard from "@/components/ClientSearchCard";
import { bcaSemesterList } from "@/config";
import LayoutWrapper from "@/layouts/LayoutWrapper";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "BCA",
        template: "BtechBuddy | BCA | %s",
    },
    description:
        "Browse subjects for BCA courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
    openGraph: {
        title: "BtechBuddy | BCA",
        description:
            "Browse subjects for BCA courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
        url: "https://btechbuddy.live/courses/bca",
        siteName: "BtechBuddy",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "BtechBuddy | BCA",
        description:
            "Browse subjects for BCA courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
        card: "summary_large_image",
        site: "https://btechbuddy.live/courses/bca",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="grid grid-cols-3 gap-10">
                <ClientSearchCard
                    title="BCA"
                    description="The degree that turns caffeine into code"
                    semesterList={bcaSemesterList}
                    hasBranches={false}
                />
                {children}
            </div>
        </LayoutWrapper>
    );
}
