import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const GGSIPU_BASE = "https://examweb.ggsipu.ac.in";

const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function GET() {
    try {
        // Fetch login page — this establishes the session AND reveals the real form action
        const loginRes = await fetch(`${GGSIPU_BASE}/web/login.jsp`, {
            headers: {
                "User-Agent": UA,
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

        // Parse the real form action URL from the login page HTML
        const loginHtml = await loginRes.text();
        const $ = cheerio.load(loginHtml);
        const rawAction = $("form").first().attr("action") ?? "";
        const formAction = rawAction.startsWith("http")
            ? rawAction
            : `${GGSIPU_BASE}${rawAction.startsWith("/") ? "" : "/web/"}${rawAction}`;

        // Also collect all input field names so we know what to send
        const inputFields: Record<string, string> = {};
        $("form input[name]").each((_, el) => {
            const name = $(el).attr("name") ?? "";
            const value = $(el).attr("value") ?? "";
            if (name) inputFields[name] = value;
        });

        // Fetch the captcha image for this session
        const captchaRes = await fetch(`${GGSIPU_BASE}/web/CaptchaServlet`, {
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
                "User-Agent": UA,
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
        const contentType = captchaRes.headers.get("content-type") ?? "image/jpeg";

        // CaptchaServlet may rotate the session — always use the latest JSESSIONID
        const captchaCookie = captchaRes.headers.get("set-cookie") ?? "";
        const refreshedSessionId =
            captchaCookie.match(/JSESSIONID=([^;]+)/)?.[1] ?? sessionId;

        console.log("[captcha] login.jsp sessionId:", sessionId?.slice(0, 8));
        console.log("[captcha] CaptchaServlet sessionId:", refreshedSessionId?.slice(0, 8), "(same?", sessionId === refreshedSessionId, ")");
        console.log("[captcha] formAction:", formAction);
        console.log("[captcha] inputFields:", inputFields);

        return NextResponse.json({
            captcha: `data:${contentType};base64,${base64}`,
            sessionId: refreshedSessionId, // use the LATEST session (CaptchaServlet may have rotated it)
            formAction: rawAction || null,
            inputFields,
        });
    } catch (err) {
        console.error("[captcha] error:", err);
        return NextResponse.json(
            { error: "Failed to reach IPU portal. Try again." },
            { status: 500 }
        );
    }
}
