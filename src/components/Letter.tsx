import LayoutWrapper from "@/layouts/LayoutWrapper";
import { BookOpen, FolderOpen, MapPin } from "lucide-react";
import { FC, ReactNode } from "react";

interface StepProps {
    number: string;
    icon: ReactNode;
    title: string;
    description: string;
    isLast: boolean;
}

const Step: FC<StepProps> = ({ number, icon, title, description, isLast }) => (
    <div className="relative flex flex-col gap-4">
        {!isLast && (
            <div className="absolute left-5 top-10 hidden h-px w-[calc(100%+1.25rem)] bg-border md:block" />
        )}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold">
            {number}
        </div>
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <span className="text-highlight">{icon}</span>
                <p className="font-semibold">{title}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
);

const steps = [
    {
        number: "01",
        icon: <MapPin className="h-4 w-4" />,
        title: "Pick your program",
        description: "Choose between B.Tech and BCA to get started.",
    },
    {
        number: "02",
        icon: <FolderOpen className="h-4 w-4" />,
        title: "Select semester & branch",
        description:
            "Navigate to your exact semester and engineering branch.",
    },
    {
        number: "03",
        icon: <BookOpen className="h-4 w-4" />,
        title: "Access your materials",
        description:
            "View syllabus, download notes, PYQs, and lab files instantly.",
    },
];

const Letter = () => {
    return (
        <div className="w-full">
            <LayoutWrapper className="py-20">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
                            How it works
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Three steps to your study materials
                        </h2>
                        <p className="max-w-xl text-muted-foreground">
                            No sign-up, no friction. Go from landing to your
                            notes in under 30 seconds.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        {steps.map((step, i) => (
                            <Step
                                key={step.number}
                                {...step}
                                isLast={i === steps.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default Letter;
