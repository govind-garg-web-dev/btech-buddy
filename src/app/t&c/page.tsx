import LayoutWrapper from "@/layouts/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Understand the guidelines shaping your academic journey at BtechBuddy. Explore our Terms and Conditions covering user responsibilities, intellectual property, privacy policies, and more.",
    openGraph: {
        title: "BtechBuddy | Terms & Conditions",
        description:
            "Understand the guidelines shaping your academic journey at BtechBuddy.",
        url: "https://btechbuddy.live",
        siteName: "BtechBuddy",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "BtechBuddy | Terms & Conditions",
        description:
            "Understand the guidelines shaping your academic journey at BtechBuddy.",
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
                        Terms &amp;{" "}
                        <span className="text-highlight">Conditions</span>
                    </h1>
                </div>
            </div>
            <div className="prose prose-neutral mx-auto py-10 dark:prose-invert">
                <h5>Last Updated: 23-05-2026</h5>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using BtechBuddy (&quot;the Service&quot;), you accept and agree
                    to be bound by these Terms and Conditions. If you do not agree to these
                    terms, please do not use our service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                    BtechBuddy is a free, non-profit educational platform providing syllabus
                    information, study materials, and academic resources for B.Tech and BCA
                    students of Guru Gobind Singh Indraprastha University (GGSIPU). The
                    service is provided &quot;as is&quot; without any warranties.
                </p>

                <h2>3. User Responsibilities</h2>
                <p>By using BtechBuddy, you agree to:</p>
                <ul>
                    <li>Use the service only for lawful educational purposes</li>
                    <li>Not attempt to disrupt or compromise the platform&apos;s security</li>
                    <li>Not reproduce or redistribute our content without permission</li>
                    <li>Provide accurate information if you contact us</li>
                </ul>

                <h2>4. Intellectual Property</h2>
                <p>
                    The syllabus content is based on official GGSIPU curriculum. Study
                    materials uploaded by users may be subject to their respective copyrights.
                    BtechBuddy does not claim ownership of uploaded academic materials.
                </p>

                <h2>5. Disclaimer of Warranties</h2>
                <p>
                    BtechBuddy provides educational resources for informational purposes only.
                    We make no guarantees about the accuracy, completeness, or timeliness of
                    the syllabus or study materials. Always verify information with your
                    institution&apos;s official sources.
                </p>

                <h2>6. Limitation of Liability</h2>
                <p>
                    BtechBuddy and its creators shall not be liable for any indirect,
                    incidental, or consequential damages arising from your use of or inability
                    to use the service.
                </p>

                <h2>7. Privacy</h2>
                <p>
                    Your use of BtechBuddy is also governed by our{" "}
                    <a href="/privacy-policy">Privacy Policy</a>, which is incorporated into
                    these Terms and Conditions by reference.
                </p>

                <h2>8. Modifications to Terms</h2>
                <p>
                    We reserve the right to modify these Terms and Conditions at any time.
                    Changes will be effective immediately upon posting. Your continued use of
                    the service constitutes acceptance of the modified terms.
                </p>

                <h2>9. Governing Law</h2>
                <p>
                    These Terms and Conditions shall be governed by the laws of India. Any
                    disputes shall be subject to the exclusive jurisdiction of courts in India.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    If you have any questions about these Terms and Conditions, please contact
                    us at{" "}
                    <a href="mailto:govindgarg.ne@gmail.com">govindgarg.ne@gmail.com</a>.
                </p>
            </div>
        </LayoutWrapper>
    );
};

export default page;
