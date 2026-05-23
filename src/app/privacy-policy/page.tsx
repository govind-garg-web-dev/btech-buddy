import LayoutWrapper from "@/layouts/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Navigate BtechBuddy with confidence. Our Privacy Policy outlines how we safeguard your information. Explore the terms guiding the collection and use of personal and non-personal data on our platform.",
    openGraph: {
        title: "BtechBuddy | Privacy Policy",
        description:
            "Navigate BtechBuddy with confidence. Our Privacy Policy outlines how we safeguard your information.",
        url: "https://btechbuddy.live",
        siteName: "BtechBuddy",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "BtechBuddy | Privacy Policy",
        description:
            "Navigate BtechBuddy with confidence. Our Privacy Policy outlines how we safeguard your information.",
        card: "summary_large_image",
        site: "https://btechbuddy.live",
    },
};

const page = () => {
    return (
        <LayoutWrapper className="min-h-[calc(100vh-7rem)] py-20">
            <div className="flex flex-col items-center gap-y-2">
                <div className="prose prose-sm prose-neutral dark:prose-invert md:prose-base">
                    <h1 className="text-center">
                        Privacy <span className="text-highlight">Policy</span>
                    </h1>
                </div>
            </div>
            <div className="prose prose-neutral mx-auto py-10 dark:prose-invert">
                <h5>Last Updated: 23-05-2026</h5>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to BtechBuddy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your
                    privacy. This Privacy Policy explains how we collect, use, and safeguard your
                    information when you visit our website at btechbuddy.live.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul>
                    <li>
                        <strong>Usage Data:</strong> Information about how you use our website,
                        including pages visited, time spent on pages, and browser type.
                    </li>
                    <li>
                        <strong>Local Storage Data:</strong> We use your browser&apos;s local storage
                        to save your preferences such as completed topics and recent subjects.
                        This data never leaves your device.
                    </li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Provide and improve our services</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Ensure the security and proper functioning of our platform</li>
                </ul>

                <h2>4. Data Storage</h2>
                <p>
                    BtechBuddy does not require you to create an account. Your study progress
                    (completed topics, recent subjects) is stored locally in your browser and
                    is never transmitted to our servers.
                </p>

                <h2>5. Third-Party Services</h2>
                <p>
                    We use Supabase as our backend infrastructure. Please refer to Supabase&apos;s
                    Privacy Policy for information on how they handle data. We do not sell or
                    share your personal information with third parties for marketing purposes.
                </p>

                <h2>6. Cookies</h2>
                <p>
                    We may use cookies to maintain session state and improve your experience.
                    You can instruct your browser to refuse all cookies or indicate when a
                    cookie is being sent.
                </p>

                <h2>7. Children&apos;s Privacy</h2>
                <p>
                    Our service is not directed to children under 13. We do not knowingly
                    collect personal information from children under 13.
                </p>

                <h2>8. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of
                    any changes by posting the new policy on this page with an updated date.
                </p>

                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:govindgarg.ne@gmail.com">govindgarg.ne@gmail.com</a>.
                </p>
            </div>
        </LayoutWrapper>
    );
};

export default page;
