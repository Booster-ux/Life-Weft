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

// GET /api/admin/users — list all registered profiles
export async function GET() {
    const { isAuthorized, supabase } = await verifyAdminCaller();
    if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ users: profiles || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
    }
}

// PATCH /api/admin/users — promote or demote user role
export async function PATCH(request: Request) {
    const { isAuthorized, user, supabase } = await verifyAdminCaller();
    if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { targetUserId, newRole } = body;

        if (!targetUserId || !newRole || !["user", "admin"].includes(newRole)) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        // Prevent self-demotion if caller is demoting their own admin role
        if (targetUserId === user?.id && newRole !== "admin") {
            return NextResponse.json({ error: "Cannot revoke your own admin role" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("profiles")
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .eq("id", targetUserId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, profile: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update role" }, { status: 500 });
    }
}
