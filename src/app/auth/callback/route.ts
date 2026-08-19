import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { type EmailOtpType } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

const DEFAULT_SUPABASE_URL = "https://euhiewnpspwdmbqdjhaq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1aGlld25wc3B3ZG1icWRqaGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzk3NzIsImV4cCI6MjEwMjY1NTc3Mn0.NuOGqu9jUiJfjGAJZRZ28k0rgt_Zm_Fq1mwrTBCSeRY";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") || "/dashboard";

    // Determine correct base URL for redirects (avoiding unwanted localhost fallbacks)
    const headerList = await headers();
    const forwardedHost = headerList.get("x-forwarded-host");
    const forwardedProto = headerList.get("x-forwarded-proto") || "https";

    let redirectBase = getSiteUrl();
    if (forwardedHost) {
        redirectBase = `${forwardedProto}://${forwardedHost}`;
    } else if (origin && !origin.includes("localhost:3000")) {
        redirectBase = origin;
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
                        // Called from Server Component
                    }
                },
            },
        }
    );

    // 1. Handle OAuth or PKCE code exchange
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${redirectBase}${next}`);
        }
    }

    // 2. Handle token_hash email confirmation / recovery
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            return NextResponse.redirect(`${redirectBase}${next}`);
        }
    }

    // Return to login with error state if exchange fails
    return NextResponse.redirect(`${redirectBase}/login?error=Authentication%20failed.%20Please%20try%20signing%20in%20again.`);
}
