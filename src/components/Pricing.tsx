import LayoutWrapper from "@/layouts/LayoutWrapper";
import { Gift, Heart, MessageSquarePlus, Star } from "lucide-react";

const supportCards = [
    {
        href: "https://github.com/govind-garg-web-dev/btech-buddy",
        external: true,
        icon: Star,
        title: "Star on GitHub",
        description:
            "Help others discover BtechBuddy by starring our open-source repo.",
    },
    {
        href: "https://www.instagram.com/",
        external: true,
        icon: Heart,
        title: "Follow on Instagram",
        description:
            "Stay updated with new material uploads and announcements.",
    },
    {
        href: "mailto:govindgarg.ne@gmail.com",
        external: false,
        icon: MessageSquarePlus,
        title: "Send Feedback",
        description:
            "Found a bug or have a suggestion? We genuinely read every message.",
    },
    {
        href: "mailto:govindgarg.ne@gmail.com",
        external: false,
        icon: Gift,
        title: "Contribute Materials",
        description:
            "Share your notes, PYQs, or lab files to help fellow students.",
    },
];

const Pricing = () => {
    return (
        <div className="w-full border-b">
            <LayoutWrapper className="py-20">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
                            Support
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            BtechBuddy is free. Always.
                        </h2>
                        <p className="max-w-2xl text-muted-foreground">
                            No subscription, no paywall. If it helps you,
                            consider showing some love — it keeps us going.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {supportCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <a
                                    key={card.title}
                                    href={card.href}
                                    target={
                                        card.external ? "_blank" : undefined
                                    }
                                    rel={
                                        card.external
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/40"
                                >
                                    <Icon className="h-5 w-5 text-highlight" />
                                    <div className="flex flex-col gap-1">
                                        <p className="font-semibold">
                                            {card.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {card.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default Pricing;
