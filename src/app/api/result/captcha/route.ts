import { NextResponse } from "next/server";

const GGSIPU_BASE = "https://examweb.ggsipu.ac.in";

export async function GET() {
    try {
        // Establish a session by hitting the login page first
        const loginRes = await fetch(`${GGSIPU_BASE}/web/login.jsp`, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            redirect: "follow",
        });

        // Extract JSESSIONID
        const rawCookie = loginRes.headers.get("set-cookie") ?? "";
        const sessionId = rawCookie.match(/JSESSIONID=([^;]+)/)?.[1];

        if (!sessionId) {
            return NextResponse.json(
                { error: "Could not establish session with IPU portal" },
                { status: 502 }
            );
        }

        // Fetch the captcha image for this session
        const captchaRes = await fetch(`${GGSIPU_BASE}/web/CaptchaServlet`, {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                Referer: `${GGSIPU_BASE}/web/login.jsp`,
            },
        });

        if (!captchaRes.ok) {
            return NextResponse.json(
                { error: "Could not fetch captcha image" },
                { status: 502 }
            );
        }

        const buffer = await captchaRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const contentType =
            captchaRes.headers.get("content-type") ?? "image/jpeg";

        return NextResponse.json({
            captcha: `data:${contentType};base64,${base64}`,
            sessionId,
        });
    } catch (err) {
        console.error("[captcha] error:", err);
        return NextResponse.json(
            { error: "Failed to reach IPU portal. Try again." },
            { status: 500 }
        );
    }
}
