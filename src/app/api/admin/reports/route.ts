import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Verify caller is an admin
async function verifyAdminCaller() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isAuthorized: false, user: null, supabase };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        return { isAuthorized: false, user, supabase };
    }

    return { isAuthorized: true, user, supabase };
}

// GET /api/admin/reports — fetch all system reports
export async function GET() {
    const { isAuthorized, supabase } = await verifyAdminCaller();
    if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { data: reports, error } = await supabase
            .from("system_reports")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            // If table does not yet exist on Supabase, return empty array gracefully
            return NextResponse.json({ reports: [] });
        }

        return NextResponse.json({ reports: reports || [] });
    } catch {
        return NextResponse.json({ reports: [] });
    }
}

// PATCH /api/admin/reports — update report status or admin notes
export async function PATCH(request: Request) {
    const { isAuthorized, supabase } = await verifyAdminCaller();
    if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { reportId, status, adminNotes } = body;

        if (!reportId) {
            return NextResponse.json({ error: "Report ID required" }, { status: 400 });
        }

        const updateData: {
            updated_at: string;
            status?: "open" | "in_progress" | "resolved" | "closed";
            admin_notes?: string | null;
        } = {
            updated_at: new Date().toISOString(),
            ...(status ? { status } : {}),
            ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}),
        };

        const { data, error } = await supabase
            .from("system_reports")
            .update(updateData)
            .eq("id", reportId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, report: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update report" }, { status: 500 });
    }
}
