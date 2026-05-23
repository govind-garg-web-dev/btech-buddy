import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only guard protected admin routes — not the login page itself
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const response = NextResponse.next({ request });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(
                        cookiesToSet: {
                            name: string;
                            value: string;
                            options?: Record<string, unknown>;
                        }[]
                    ) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(
                                name,
                                value,
                                options as Parameters<
                                    typeof response.cookies.set
                                >[2]
                            );
                        });
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.redirect(
                new URL("/admin/login", request.url)
            );
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
