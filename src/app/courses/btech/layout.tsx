import ClientSearchCard from "@/components/ClientSearchCard";
import { branchList, semesterList } from "@/config";
import LayoutWrapper from "@/layouts/LayoutWrapper";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Btech",
        template: "BtechBuddy | Btech | %s",
    },
    description:
        "Browse subjects for BTech courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
    openGraph: {
        title: "BtechBuddy | Btech",
        description:
            "Browse subjects for BTech courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
        url: "https://btechbuddy.live/courses/btech",
        siteName: "BtechBuddy",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "BtechBuddy | Btech",
        description:
            "Browse subjects for BTech courses at GGSIPU on BtechBuddy – your complete hub for syllabi and study materials",
        card: "summary_large_image",
        site: "https://btechbuddy.live/courses/btech",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="grid grid-cols-3 gap-10">
                <ClientSearchCard
                    title="Btech"
                    description="Who needs sleep when you can engineer dreams?"
                    semesterList={semesterList}
                    branchList={branchList}
                />
                {children}
            </div>
        </LayoutWrapper>
    );
}
