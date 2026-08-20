import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type EmailOtpType } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

const DEFAULT_SUPABASE_URL = "https://euhiewnpspwdmbqdjhaq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1aGlld25wc3B3ZG1icWRqaGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzk3NzIsImV4cCI6MjEwMjY1NTc3Mn0.NuOGqu9jUiJfjGAJZRZ28k0rgt_Zm_Fq1mwrTBCSeRY";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
    const next = requestUrl.searchParams.get("next") || "/dashboard";

    // Compute base URL for redirect
    let base = requestUrl.origin;
    if (base.includes("localhost:3000") && process.env.NEXT_PUBLIC_SITE_URL) {
        base = getSiteUrl();
    }

    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component context
                    }
                },
            },
        }
    );

    // 1. Handle OAuth PKCE exchange
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const redirectUrl = new URL(next, base).toString();
            return NextResponse.redirect(redirectUrl);
        }
    }

    // 2. Handle token_hash password recovery / email link
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            const redirectUrl = new URL(next, base).toString();
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Redirect to login on exchange error
    const fallbackUrl = new URL("/login?error=Authentication%20failed.%20Please%20try%20signing%20in%20again.", base).toString();
    return NextResponse.redirect(fallbackUrl);
}
