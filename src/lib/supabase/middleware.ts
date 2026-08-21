import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";

const DEFAULT_SUPABASE_URL = "https://euhiewnpspwdmbqdjhaq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1aGlld25wc3B3ZG1icWRqaGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzk3NzIsImV4cCI6MjEwMjY1NTc3Mn0.NuOGqu9jUiJfjGAJZRZ28k0rgt_Zm_Fq1mwrTBCSeRY";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

    const supabase = createServerClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could compromise user authentication.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthRoute = pathname === "/login" || pathname === "/signup";

    // 1. Unauthenticated users attempting to access /dashboard or /admin
    if (!user && (isDashboardRoute || isAdminRoute)) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(url);
    }

    // 2. Authenticated user attempting to access /admin — strictly verify role === 'admin'
    if (user && isAdminRoute) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            url.searchParams.set("error", "unauthorized_admin_access");
            return NextResponse.redirect(url);
        }
    }

    // 3. Authenticated user visits login or signup -> redirect to dashboard
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
