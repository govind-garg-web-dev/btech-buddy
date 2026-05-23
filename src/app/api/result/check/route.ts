import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const GGSIPU_BASE = "https://examweb.ggsipu.ac.in";

function supabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

type Subject = {
    code: string;
    name: string;
    internal: string;
    external: string;
    total: string;
    maxMarks: string;
    grade: string;
    status: string;
};

type SemesterResult = {
    semester: string;
    sgpa: string;
    totalCredits: string;
    subjects: Subject[];
};

type ResultData = {
    name: string;
    enrollment: string;
    programme: string;
    semesters: SemesterResult[];
};

async function followRedirects(
    url: string,
    options: RequestInit,
    cookies: Map<string, string>,
    maxRedirects = 6
): Promise<{ res: Response; cookies: Map<string, string> }> {
    let currentUrl = url;
    let redirects = 0;

    while (redirects < maxRedirects) {
        const cookieHeader = Array.from(cookies.entries())
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");

        const res = await fetch(currentUrl, {
            ...options,
            headers: {
                ...(options.headers as Record<string, string>),
                Cookie: cookieHeader,
            },
            redirect: "manual",
        });

        // Merge Set-Cookie into jar
        const setCookieHeader = res.headers.get("set-cookie");
        if (setCookieHeader) {
            const cookieParts = setCookieHeader.split(/,(?=[^ ])/);
            for (const part of cookieParts) {
                const nameVal = part.split(";")[0].trim();
                const eqIdx = nameVal.indexOf("=");
                if (eqIdx > 0) {
                    const name = nameVal.slice(0, eqIdx).trim();
                    const value = nameVal.slice(eqIdx + 1).trim();
                    cookies.set(name, value);
                }
            }
        }

        console.log(
            `[redirect #${redirects}] ${options.method ?? "GET"} ${currentUrl} → ${res.status} Location: ${res.headers.get("location") ?? "(none)"}`
        );

        if ([301, 302, 303, 307].includes(res.status)) {
            const location = res.headers.get("location");
            if (!location) return { res, cookies };
            currentUrl = location.startsWith("http")
                ? location
                : `${GGSIPU_BASE}${location}`;
            options = { ...options, method: "GET", body: undefined };
            redirects++;
        } else {
            return { res, cookies };
        }
    }

    throw new Error("Too many redirects");
}

function parseResultHtml(html: string): ResultData {
    const $ = cheerio.load(html);

    const name =
        $("td:contains('Name'), td:contains('Student')")
            .next()
            .first()
            .text()
            .trim() ||
        $("b:contains('Name')")
            .parent()
            .text()
            .replace(/Name\s*[:–]/i, "")
            .trim() ||
        "";

    const enrollment =
        $("td:contains('Enrollment'), td:contains('Enroll')")
            .next()
            .first()
            .text()
            .trim() || "";

    const programme =
        $(
            "td:contains('Programme'), td:contains('Program'), td:contains('Course')"
        )
            .next()
            .first()
            .text()
            .trim() || "";

    const semesters: SemesterResult[] = [];

    $("table").each((_, table) => {
        const headers: string[] = [];
        $(table)
            .find("tr")
            .first()
            .find("th, td")
            .each((_, el) => {
                headers.push($(el).text().trim().toLowerCase());
            });

        const hasResultCols =
            headers.some(
                (h) =>
                    h.includes("paper") ||
                    h.includes("subject") ||
                    h.includes("code")
            ) &&
            headers.some(
                (h) =>
                    h.includes("total") ||
                    h.includes("marks") ||
                    h.includes("ia") ||
                    h.includes("internal")
            );

        if (!hasResultCols) return;

        const subjects: Subject[] = [];

        $(table)
            .find("tr")
            .slice(1)
            .each((_, row) => {
                const cells: string[] = [];
                $(row)
                    .find("td")
                    .each((_, cell) => {
                        cells.push($(cell).text().trim());
                    });

                if (cells.length < 5) return;
                if (!/\d{4,}/.test(cells[0])) return;

                subjects.push({
                    code: cells[0] ?? "",
                    name: cells[1] ?? "",
                    internal: cells[2] ?? "",
                    external: cells[3] ?? "",
                    total: cells[4] ?? "",
                    maxMarks: cells[5] ?? "",
                    grade: cells[6] ?? "",
                    status: cells[7] ?? "",
                });
            });

        if (subjects.length === 0) return;

        const tableHtml = $.html(table);
        const sgpaMatch = tableHtml.match(/SGPA[\s:–-]*([\d.]+)/i);
        const creditsMatch = tableHtml.match(
            /(?:Total\s*)?Credits?[\s:–-]*([\d.]+)/i
        );

        const semLabel =
            $(table).prev("h2, h3, h4, p, b").text().trim() ||
            $(table)
                .closest("div, section")
                .find("h2, h3, h4")
                .first()
                .text()
                .trim() ||
            "";
        const semMatch = semLabel.match(
            /(\d+(?:st|nd|rd|th)?(?:\s*Sem(?:ester)?)?)/i
        );

        semesters.push({
            semester:
                semMatch?.[1] ?? `Semester ${semesters.length + 1}`,
            sgpa: sgpaMatch?.[1] ?? "",
            totalCredits: creditsMatch?.[1] ?? "",
            subjects,
        });
    });

    return { name, enrollment, programme, semesters };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            enrollment,
            password,
            captchaText,
            // New: requestId from Supabase-backed session
            requestId,
            // Legacy fallback: sessionId passed directly
            sessionId: sessionIdDirect,
            formAction: formActionDirect,
            inputFields: inputFieldsDirect,
        } = body as {
            enrollment: string;
            password: string;
            captchaText: string;
            requestId?: string;
            sessionId?: string;
            formAction?: string | null;
            inputFields?: Record<string, string>;
        };

        if (!enrollment || !password || !captchaText) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        let sessionId: string;
        let formAction: string | null = null;
        let inputFields: Record<string, string> = {};

        if (requestId) {
            // Retrieve session from Supabase
            const supabase = supabaseAdmin();
            const { data, error } = await supabase
                .from("result_sessions")
                .select("jsessionid, form_action, input_fields")
                .eq("id", requestId)
                .single();

            if (error || !data) {
                return NextResponse.json(
                    {
                        error:
                            "Session expired. Please refresh the captcha and try again.",
                    },
                    { status: 401 }
                );
            }

            // Delete immediately (one-time use)
            await supabase
                .from("result_sessions")
                .delete()
                .eq("id", requestId);

            sessionId = data.jsessionid;
            formAction = data.form_action;
            inputFields = (data.input_fields as Record<string, string>) ?? {};

            console.log("[check] sessionId from Supabase:", sessionId.slice(0, 8));
        } else if (sessionIdDirect) {
            // Fallback path (DB unavailable at captcha time)
            sessionId = sessionIdDirect;
            formAction = formActionDirect ?? null;
            inputFields = inputFieldsDirect ?? {};
            console.log("[check] sessionId from client (fallback):", sessionId.slice(0, 8));
        } else {
            return NextResponse.json(
                { error: "No session found. Refresh captcha and try again." },
                { status: 400 }
            );
        }

        const cookies = new Map<string, string>([["JSESSIONID", sessionId]]);

        const commonHeaders = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: `${GGSIPU_BASE}/web/login.jsp`,
            Origin: GGSIPU_BASE,
        };

        // Resolve login URL from stored form action
        let loginUrl = `${GGSIPU_BASE}/web/Login`;
        if (formAction) {
            loginUrl = formAction.startsWith("http")
                ? formAction
                : `${GGSIPU_BASE}${formAction.startsWith("/") ? "" : "/web/"}${formAction}`;
        }

        const formParams: Record<string, string> = {
            ...inputFields,
            username: enrollment.trim(),
            passwd: password,
            captcha: captchaText.trim(),
        };

        console.log("[check] loginUrl:", loginUrl);
        console.log("[check] formParams keys:", Object.keys(formParams));

        const formBody = new URLSearchParams(formParams).toString();

        const { res: loginRes, cookies: updatedCookies } =
            await followRedirects(
                loginUrl,
                { method: "POST", headers: commonHeaders, body: formBody },
                cookies
            );

        const html = await loginRes.text();

        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        console.log(
            "[check] final page title:",
            titleMatch?.[1],
            "| status:",
            loginRes.status,
            "| url:",
            loginRes.url
        );

        if (
            loginRes.status === 401 ||
            html.toLowerCase().includes("invalid") ||
            html.toLowerCase().includes("incorrect captcha") ||
            html.toLowerCase().includes("wrong captcha")
        ) {
            return NextResponse.json(
                { error: "Login failed. Check your credentials or captcha." },
                { status: 401 }
            );
        }

        // If we got the "Message" / session-expired page, report it clearly
        if (titleMatch?.[1]?.trim() === "Message") {
            return NextResponse.json(
                {
                    error:
                        "GGSIPU portal returned a session error. This can happen if the captcha expired — please refresh and try again quickly.",
                },
                { status: 401 }
            );
        }

        const cookieHeader = Array.from(updatedCookies.entries())
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");

        const ua = commonHeaders["User-Agent"];
        const authedFetch = (url: string) =>
            fetch(url, { headers: { Cookie: cookieHeader, "User-Agent": ua } });

        let result = parseResultHtml(html);

        if (result.semesters.length === 0) {
            const homeRes = await authedFetch(
                `${GGSIPU_BASE}/web/student/studenthome.jsp`
            );
            if (homeRes.ok) {
                const homeHtml = await homeRes.text();
                result = parseResultHtml(homeHtml);

                if (result.semesters.length === 0) {
                    const $home = cheerio.load(homeHtml);
                    const resultLinks: string[] = [];

                    $home("a[href]").each((_, el) => {
                        const href = $home(el).attr("href") ?? "";
                        if (
                            href.toLowerCase().includes("result") ||
                            href.toLowerCase().includes("marks") ||
                            href.toLowerCase().includes("grade")
                        ) {
                            const abs = href.startsWith("http")
                                ? href
                                : `${GGSIPU_BASE}${href.startsWith("/") ? "" : "/web/student/"}${href}`;
                            resultLinks.push(abs);
                        }
                    });

                    for (const link of resultLinks.slice(0, 5)) {
                        try {
                            const linkRes = await authedFetch(link);
                            if (!linkRes.ok) continue;
                            const linkHtml = await linkRes.text();
                            const linkResult = parseResultHtml(linkHtml);
                            if (linkResult.semesters.length > 0) {
                                result = linkResult;
                                break;
                            }
                        } catch {
                            /* ignore */
                        }
                    }

                    if (result.semesters.length === 0) {
                        return NextResponse.json({
                            ...result,
                            _debug: homeHtml.slice(0, 8000),
                        });
                    }
                }
            }
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("[result/check] error:", err);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
