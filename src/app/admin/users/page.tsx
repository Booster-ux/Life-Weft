"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Calendar,
    Globe,
    Check,
    AlertCircle,
    UserCheck,
    UserX,
    RefreshCw,
} from "lucide-react";

interface ProfileItem {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    timezone: string;
    role: "user" | "admin";
    created_at: string;
    updated_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<ProfileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch {
            setStatusMessage({ text: "Failed to load user directory", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleToggle = async (userId: string, currentRole: "user" | "admin") => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        const confirmMsg = currentRole === "admin"
            ? "Demote this user to regular user status?"
            : "Promote this user to administrator? They will have full administrative console access.";

        if (!window.confirm(confirmMsg)) return;

        setActionLoadingId(userId);
        setStatusMessage(null);

        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: userId, newRole }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Action failed");
            }

            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
            setStatusMessage({ text: `Successfully updated user role to ${newRole}`, type: "success" });
        } catch (err: any) {
            setStatusMessage({ text: err.message || "Failed to update role", type: "error" });
        } finally {
            setActionLoadingId(null);
            setTimeout(() => setStatusMessage(null), 3500);
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesQuery =
            (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.timezone.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || u.role === roleFilter;

        return matchesQuery && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <Users className="text-emerald-400" />
                        User Directory & Access Control
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage user roles, inspect timezone configurations, and enforce database authorization.
                    </p>
                </div>

                <button
                    onClick={fetchUsers}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-fit"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Notification alert */}
            {statusMessage && (
                <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                        statusMessage.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                    }`}
                >
                    {statusMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                    {statusMessage.text}
                </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, user ID, or timezone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0D121F] text-slate-100 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="bg-[#0D121F] text-slate-300 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins Only</option>
                        <option value="user">Regular Users</option>
                    </select>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-[#0D121F] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#090D16] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                            <tr>
                                <th className="px-4 py-3">User / Name</th>
                                <th className="px-4 py-3">User ID</th>
                                <th className="px-4 py-3">Timezone</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Joined Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-brand-blue" />
                                            <span>Loading user directory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        No users matching query.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-white">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-[11px] font-bold text-brand-blue flex-shrink-0">
                                                    {(u.full_name || "U")[0].toUpperCase()}
                                                </div>
                                                <span className="truncate">{u.full_name || "Anonymous User"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                                            {u.id.substring(0, 18)}...
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">
                                            <span className="flex items-center gap-1">
                                                <Globe size={12} className="text-slate-400" />
                                                {u.timezone || "UTC"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-flex items-center gap-1 ${
                                                    u.role === "admin"
                                                        ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40"
                                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                                }`}
                                            >
                                                {u.role === "admin" ? <ShieldCheck size={11} /> : <Users size={11} />}
                                                {u.role || "user"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleRoleToggle(u.id, u.role || "user")}
                                                disabled={actionLoadingId === u.id}
                                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                                                    u.role === "admin"
                                                        ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                                                        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                }`}
                                            >
                                                {actionLoadingId === u.id
                                                    ? "Updating..."
                                                    : u.role === "admin"
                                                    ? "Demote to User"
                                                    : "Promote to Admin"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
