import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
    title: "Admin Console — Lifeweft",
    description: "Administrative oversight, user directory, system reports and health.",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirectedFrom=/admin");
    }

    // Verify admin role server-side
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, email:id")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/dashboard?error=unauthorized_admin_access");
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#07090E] text-slate-100 font-sans">
            {/* Responsive Admin Nav (Desktop Sidebar + Mobile Drawer) */}
            <AdminNav
                userName={profile?.full_name || ""}
                userEmail={user.email || ""}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
