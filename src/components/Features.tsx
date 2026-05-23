import LayoutWrapper from "@/layouts/LayoutWrapper";
import {
    BookCheck,
    CalendarCheck,
    FileText,
    FlaskConical,
    Repeat,
    TabletSmartphone,
} from "lucide-react";
import { FC, ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-accent/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            {icon}
        </div>
        <div className="flex flex-col gap-1.5">
            <p className="font-semibold">{title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
);

const featureList: FeatureCardProps[] = [
    {
        icon: <CalendarCheck className="h-5 w-5" />,
        title: "Always Up-to-Date",
        description:
            "Syllabus and materials stay current with GGSIPU's latest curriculum changes.",
    },
    {
        icon: <BookCheck className="h-5 w-5" />,
        title: "Full Curriculum Coverage",
        description:
            "Every subject, every unit — from 1st semester to final year, for all branches.",
    },
    {
        icon: <FileText className="h-5 w-5" />,
        title: "Notes & PYQs",
        description:
            "Handwritten notes and previous year question papers organized by subject.",
    },
    {
        icon: <FlaskConical className="h-5 w-5" />,
        title: "Lab Files",
        description:
            "Practical experiment files and lab manuals for every practical subject.",
    },
    {
        icon: <TabletSmartphone className="h-5 w-5" />,
        title: "Works on Any Device",
        description:
            "Fully responsive — use it on your phone, tablet, or laptop with ease.",
    },
    {
        icon: <Repeat className="h-5 w-5" />,
        title: "Constantly Growing",
        description:
            "New materials added regularly. Your feedback directly shapes what comes next.",
    },
];

const Features = () => {
    return (
        <div className="w-full border-b">
            <LayoutWrapper className="py-20">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
                            Features
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Everything you need to ace your semester
                        </h2>
                        <p className="max-w-2xl text-muted-foreground">
                            Built specifically for GGSIPU students — all
                            materials organized and ready when you need them.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {featureList.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default Features;
