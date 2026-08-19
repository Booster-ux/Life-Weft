import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { deviceId, userAgent, clientTime } = body;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Parse user-agent securely without invasive fingerprinting
        const ua = userAgent || req.headers.get("user-agent") || "Unknown Browser / Device";
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Remote Session";
        const timestamp = clientTime || new Date().toISOString();

        // In a production email service (e.g. Resend / SendGrid / Supabase Hook), 
        // a security email "New sign-in to your Lifeweft account" is dispatched here.
        // For audit logs, log to server console & return success.
        console.log(`[SECURITY AUDIT] New device login for user ${user.email} (${user.id}):`, {
            deviceId,
            userAgent: ua,
            timestamp,
        });

        return NextResponse.json({
            success: true,
            alertLogged: true,
            userEmail: user.email,
            device: ua,
            timestamp,
        });
    } catch (err: unknown) {
        console.error("New device alert handler error:", err);
        return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}
