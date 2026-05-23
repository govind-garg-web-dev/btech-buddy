import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const GGSIPU_BASE = "https://examweb.ggsipu.ac.in";
const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function supabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function GET() {
    try {
        // Establish session via login page
        const loginRes = await fetch(`${GGSIPU_BASE}/web/login.jsp`, {
            headers: { "User-Agent": UA, Accept: "text/html,*/*" },
            redirect: "follow",
        });

        const rawCookie = loginRes.headers.get("set-cookie") ?? "";
        const sessionId = rawCookie.match(/JSESSIONID=([^;]+)/)?.[1];

        if (!sessionId) {
            return NextResponse.json(
                { error: "Could not establish session with IPU portal" },
                { status: 502 }
            );
        }

        // Parse real form action + field names
        const loginHtml = await loginRes.text();
        const $ = cheerio.load(loginHtml);
        const rawAction = $("form").first().attr("action") ?? "";
        const inputFields: Record<string, string> = {};
        $("form input[name]").each((_, el) => {
            const name = $(el).attr("name") ?? "";
            const value = $(el).attr("value") ?? "";
            if (name) inputFields[name] = value;
        });

        // Fetch captcha image, bound to this session
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

        // CaptchaServlet may rotate session — use latest
        const captchaCookie = captchaRes.headers.get("set-cookie") ?? "";
        const finalSessionId =
            captchaCookie.match(/JSESSIONID=([^;]+)/)?.[1] ?? sessionId;

        console.log("[captcha] sessionId (login):", sessionId.slice(0, 8));
        console.log("[captcha] sessionId (captcha):", finalSessionId.slice(0, 8), "same?", sessionId === finalSessionId);

        // Store session server-side — client only gets a requestId UUID
        const requestId = crypto.randomUUID();
        const supabase = supabaseAdmin();
        const { error: dbErr } = await supabase.from("result_sessions").insert({
            id: requestId,
            jsessionid: finalSessionId,
            form_action: rawAction || null,
            input_fields: inputFields,
        });

        if (dbErr) {
            console.error("[captcha] Supabase insert error:", dbErr.message);
            // Fallback: return sessionId directly if DB is unavailable
            return NextResponse.json({
                captcha: `data:${contentType};base64,${base64}`,
                sessionId: finalSessionId,
                formAction: rawAction || null,
                inputFields,
            });
        }

        console.log("[captcha] stored requestId:", requestId);

        return NextResponse.json({
            captcha: `data:${contentType};base64,${base64}`,
            requestId,
        });
    } catch (err) {
        console.error("[captcha] error:", err);
        return NextResponse.json(
            { error: "Failed to reach IPU portal. Try again." },
            { status: 500 }
        );
    }
}
