import _ from "lodash";
import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function constructMetadata(): Metadata {
    return {
        metadataBase: new URL("https://btechbuddy.live"),
        manifest: "../manifest.json",

        title: {
            default: "BtechBuddy",
            template: "BtechBuddy | %s",
        },
        description:
            "Your complete academic companion for B.Tech at GGSIPU. Access syllabi, notes, PYQs, and study materials effortlessly.",
        applicationName: "BtechBuddy",
        keywords: [
            "BtechBuddy",
            "btech buddy",
            "Syllabus",
            "IPU Syllabus",
            "IPU",
            "BTech",
            "BCA",
            "Notes",
            "PYQs",
            "GGSIPU",
            "Practicals IPU",
        ],
        openGraph: {
            title: "BtechBuddy",
            description:
                "Your complete academic companion for B.Tech at GGSIPU. Access syllabi, notes, PYQs, and study materials effortlessly.",
            url: "https://btechbuddy.live",
            siteName: "BtechBuddy",
            locale: "en_US",
            type: "website",
        },
        twitter: {
            title: "BtechBuddy",
            description:
                "Your complete academic companion for B.Tech at GGSIPU. Access syllabi, notes, PYQs, and study materials effortlessly.",
            card: "summary_large_image",
            site: "https://btechbuddy.live",
        },
    };
}

export function getRemainingTime(futureTimestamp: number): string {
    const now = Date.now();
    const diffMs = futureTimestamp - now;
    const diffSeconds = Math.floor(diffMs / 1000);

    const intervals = [
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    const result = _.chain(intervals)
        .reduce((acc, interval) => {
            const count = Math.floor(diffSeconds / interval.seconds);
            if (count > 0) {
                acc.push(`${count} ${interval.label}${count !== 1 ? "s" : ""}`);
            }
            return acc;
        }, [] as string[])
        .thru((parts) => {
            if (parts.length === 0) return "less than a minute";
            return _.take(parts, 2).join(" ");
        })
        .value();

    return result;
}
