import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
// redirect is used in the AdminLogout server action below
import { BookOpen, FileText, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "BtechBuddy Admin",
    description: "Admin panel for BtechBuddy",
    robots: "noindex",
};

async function AdminLogout() {
    "use server";
    const { createClient: makeClient } = await import("@/lib/supabase/server");
    const supabase = await makeClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Not logged in — middleware handles redirect for protected routes.
    // For /admin/login itself, just render the page with no sidebar.
    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
                            BB
                        </div>
                        <div>
                            <p className="font-semibold text-sm">BtechBuddy</p>
                            <p className="text-xs text-muted-foreground">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/subjects"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <BookOpen className="h-4 w-4" />
                        Subjects
                    </Link>
                    <Link
                        href="/admin/materials"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <FileText className="h-4 w-4" />
                        Materials
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2 truncate">
                        {user.email}
                    </p>
                    <form action={AdminLogout}>
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                        >
                            <LogOut className="h-3 w-3" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
    );
}
