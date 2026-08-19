"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface LifeArea {
    id: string;
    name: string;
    color: string;
    icon?: string;
    description?: string;
}

export interface Ledger {
    id: string;
    name: string;
    description: string;
    color: string;
    lifeAreaId?: string;
    isDefault?: boolean;
    icon?: string;
}

export interface LedgerEntry {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    time?: string; // e.g. "14:30"
    ledgerId: string;
    lifeAreaId?: string;
    tags: string[];
    attachment?: {
        name: string;
        url?: string;
        type?: string;
    };
    relatedTaskId?: string;
    relatedDeadlineId?: string;
    relatedDecisionId?: string;
    relatedGoalId?: string;
    createdAt: string;
}

export interface Goal {
    id: string;
    parentGoalId?: string;
    title: string;
    description?: string;
    goalType: "yearly" | "quarterly" | "monthly" | "weekly" | "daily" | "custom";
    period?: string;
    status: "active" | "completed" | "paused" | "archived";
    startDate?: string;
    targetDate?: string;
    progress: number;
    lifeAreaId?: string;
    measurableTarget?: string;
    notes?: string;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    time?: string; // e.g. "Morning", "Afternoon", "Evening"
    priority: "high" | "normal" | "low";
    category: "Work" | "Personal" | "Student" | "Finance" | "Health" | string;
    dueDate?: string; // "YYYY-MM-DD"
    deadlineId?: string;
    lifeAreaId?: string;
    goalId?: string;
    tags?: string[];
}

export interface Deadline {
    id: string;
    title: string;
    dueDate: string; // "YYYY-MM-DD"
    daysLeft: number;
    priority: "high" | "normal" | "low";
    relatedTaskId?: string;
    completed: boolean;
    lifeAreaId?: string;
    goalId?: string;
    time?: string;
    notes?: string;
}

export interface Decision {
    id: string;
    title: string;
    situation: string;
    options: {
        name: string;
        pros: string[];
        cons: string[];
        cost: string;
        time: string;
        risks: string;
    }[];
    chosenOption?: string;
    reason?: string;
    expectedOutcome?: string;
    actualOutcome?: string;
    status: "Under Consideration" | "Decided" | "Reviewed" | "Archived";
    recommendedStep?: string;
    lifeAreaId?: string;
    createdAt: string;
}

export interface KnowledgeItem {
    id: string;
    title: string;
    content: string;
    category: "Notes" | "Important Information" | "Ideas" | "References" | "Saved Items";
    lifeAreaId?: string;
    tags?: string[];
    url?: string;
    createdAt: string;
}

export interface PlannerSession {
    id: string;
    day: string; // "Monday", "Tuesday", etc.
    title: string;
    time: string; // e.g. "09:00 - 11:00"
    type: "work" | "study" | "personal" | "health";
    lifeAreaId?: string;
    goalId?: string;
}

export interface AskLifeweftAnswer {
    id: string;
    question: string;
    summary: string;
    relatedItems: {
        type: "task" | "deadline" | "ledger" | "decision" | "knowledge" | "planner" | "goal";
        id: string;
        title: string;
        detail?: string;
    }[];
    insights?: string[];
    timestamp: string;
}

interface AppContextType {
    // Auth State
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;

    // Life Areas
    lifeAreas: LifeArea[];
    activeLifeArea: string; // "all" or specific life area id
    setActiveLifeArea: (id: string) => void;
    addLifeArea: (area: Omit<LifeArea, "id">) => Promise<void>;
    deleteLifeArea: (id: string) => Promise<void>;

    // Ledgers & Entries
    ledgers: Ledger[];
    ledgerEntries: LedgerEntry[];
    addLedger: (ledger: Omit<Ledger, "id">) => Promise<void>;
    deleteLedger: (id: string) => Promise<void>;
    addLedgerEntry: (entry: Omit<LedgerEntry, "id" | "createdAt">) => Promise<void>;
    updateLedgerEntry: (entry: LedgerEntry) => Promise<void>;
    deleteLedgerEntry: (id: string) => Promise<void>;

    // Goals System
    goals: Goal[];
    addGoal: (goal: Omit<Goal, "id" | "createdAt">) => Promise<string>;
    updateGoal: (goal: Goal) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    toggleGoalStatus: (id: string) => Promise<void>;
    batchAddGoals: (goalsList: Omit<Goal, "id" | "createdAt">[]) => Promise<void>;

    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, "id">) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;

    // Deadlines
    deadlines: Deadline[];
    addDeadline: (deadline: Omit<Deadline, "id" | "daysLeft" | "completed">) => Promise<void>;
    toggleDeadline: (id: string) => Promise<void>;
    deleteDeadline: (id: string) => Promise<void>;
    updateDeadline: (deadline: Deadline) => Promise<void>;

    // Decisions
    decisions: Decision[];
    addDecision: (decision: Omit<Decision, "id" | "createdAt">) => Promise<void>;
    updateDecision: (decision: Decision) => Promise<void>;
    deleteDecision: (id: string) => Promise<void>;

    // Knowledge
    knowledge: KnowledgeItem[];
    addKnowledgeItem: (item: Omit<KnowledgeItem, "id" | "createdAt">) => Promise<void>;
    updateKnowledgeItem: (item: KnowledgeItem) => Promise<void>;
    deleteKnowledgeItem: (id: string) => Promise<void>;

    // Planner
    planner: PlannerSession[];
    addPlannerSession: (session: Omit<PlannerSession, "id">) => Promise<void>;
    updatePlannerSession: (session: PlannerSession) => Promise<void>;
    deletePlannerSession: (id: string) => Promise<void>;

    // User & Preferences
    userName: string;
    setUserName: (name: string) => void;
    updateProfile: (fullName: string, timezone?: string) => Promise<void>;

    // Ask Lifeweft Query Engine
    queryLifeweft: (question: string) => Promise<AskLifeweftAnswer>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial fallback data
const initialLifeAreas: LifeArea[] = [
    { id: "area-personal", name: "Personal", color: "#3B82F6" },
    { id: "area-work", name: "Work", color: "#2563EB" },
    { id: "area-business", name: "Business", color: "#D4A72C" },
    { id: "area-school", name: "School", color: "#10B981" },
];

const initialLedgers: Ledger[] = [
    { id: "ldg-personal", name: "Personal", description: "Daily life moments, milestones and reflections", color: "#3B82F6", isDefault: true },
    { id: "ldg-work", name: "Work", description: "Professional achievements, meetings and updates", color: "#2563EB", isDefault: false },
    { id: "ldg-business", name: "Business", description: "Startup milestones, client meetings and strategy", color: "#D4A72C", isDefault: false },
    { id: "ldg-school", name: "School", description: "Academic milestones, study breakthroughs and thesis", color: "#10B981", isDefault: false },
];

const initialGoals: Goal[] = [
    {
        id: "goal-saas-2026",
        title: "Scale Lifeweft to 1,000 Active Members",
        description: "Transform personal life management into a premier daily workspace.",
        goalType: "yearly",
        period: "2026",
        status: "active",
        startDate: "2026-01-01",
        targetDate: "2026-12-31",
        progress: 42,
        lifeAreaId: "area-business",
        measurableTarget: "1,000 active users",
        createdAt: "2026-01-01",
    },
    {
        id: "goal-saas-q1",
        parentGoalId: "goal-saas-2026",
        title: "Q1: Production Database & Supabase Full-Stack Architecture",
        description: "Establish reliable multi-tenant database schema, RLS, and security.",
        goalType: "quarterly",
        period: "Q1 2026",
        status: "completed",
        startDate: "2026-01-01",
        targetDate: "2026-03-31",
        progress: 100,
        lifeAreaId: "area-business",
        createdAt: "2026-01-01",
    },
    {
        id: "goal-saas-q3",
        parentGoalId: "goal-saas-2026",
        title: "Q3: Launch Goal Breakdown Engine & Roadmap Navigation",
        description: "Deliver top-tier decomposition workflows from yearly vision to daily momentum.",
        goalType: "quarterly",
        period: "Q3 2026",
        status: "active",
        startDate: "2026-07-01",
        targetDate: "2026-09-30",
        progress: 65,
        lifeAreaId: "area-business",
        createdAt: "2026-07-01",
    },
    {
        id: "goal-saas-m8",
        parentGoalId: "goal-saas-q3",
        title: "August: Complete Goal Hierarchy UI & Task Integrations",
        description: "Connect goals to tasks, deadlines, planner, and today command center.",
        goalType: "monthly",
        period: "August 2026",
        status: "active",
        startDate: "2026-08-01",
        targetDate: "2026-08-31",
        progress: 75,
        lifeAreaId: "area-business",
        createdAt: "2026-08-01",
    },
    {
        id: "goal-saas-w33",
        parentGoalId: "goal-saas-m8",
        title: "Week 33: Goals Management Page & Breakdown Modal",
        description: "Ship /dashboard/goals with filter tabs and hierarchy tree.",
        goalType: "weekly",
        period: "Week 33",
        status: "active",
        startDate: "2026-08-18",
        targetDate: "2026-08-24",
        progress: 80,
        lifeAreaId: "area-business",
        createdAt: "2026-08-18",
    },
    {
        id: "goal-saas-d1",
        parentGoalId: "goal-saas-w33",
        title: "Complete Goal Breakdown Wizard & Build Verification",
        description: "Ensure clean Next.js build and full database integration.",
        goalType: "daily",
        period: "Today",
        status: "active",
        startDate: "2026-08-19",
        targetDate: "2026-08-19",
        progress: 90,
        lifeAreaId: "area-business",
        createdAt: "2026-08-19",
    },
];

function calculateDaysLeft(dueDateStr: string): number {
    try {
        const target = new Date(dueDateStr);
        const today = new Date("2026-08-08");
        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
        return 0;
    }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const supabase = createClient();

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Profile
    const [userName, setUserNameState] = useState<string>("Julian");

    // Life Areas & Active Filter
    const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(initialLifeAreas);
    const [activeLifeArea, setActiveLifeArea] = useState<string>("all");

    // Domain collections
    const [ledgers, setLedgers] = useState<Ledger[]>(initialLedgers);
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
    const [planner, setPlanner] = useState<PlannerSession[]>([]);

    // Fetch all user-owned data from Supabase
    const fetchUserData = useCallback(async (userId: string) => {
        setIsLoading(true);
        try {
            // 1. Profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (profile?.full_name) {
                setUserNameState(profile.full_name);
            }

            // 2. Life Areas
            const { data: areasData } = await supabase
                .from("life_areas")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });

            if (areasData && areasData.length > 0) {
                setLifeAreas(
                    areasData.map((a) => ({
                        id: a.id,
                        name: a.name,
                        color: a.color || "#3B82F6",
                        icon: a.icon || undefined,
                        description: a.description || undefined,
                    }))
                );
            }

            // 3. Ledgers
            const { data: ledgersData } = await supabase
                .from("ledgers")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });

            if (ledgersData && ledgersData.length > 0) {
                setLedgers(
                    ledgersData.map((l) => ({
                        id: l.id,
                        name: l.name,
                        description: l.description || "",
                        color: l.color || "#3B82F6",
                        isDefault: l.is_default,
                        icon: l.icon || undefined,
                    }))
                );
            }

            // 4. Ledger Entries
            const { data: entriesData } = await supabase
                .from("ledger_entries")
                .select("*")
                .eq("user_id", userId)
                .order("entry_date", { ascending: false });

            if (entriesData) {
                setLedgerEntries(
                    entriesData.map((e) => ({
                        id: e.id,
                        title: e.title,
                        description: e.content || "",
                        date: e.entry_date ? e.entry_date.split("T")[0] : new Date().toISOString().split("T")[0],
                        time: e.entry_date && e.entry_date.includes("T") ? e.entry_date.split("T")[1].substring(0, 5) : undefined,
                        ledgerId: e.ledger_id,
                        lifeAreaId: e.life_area_id || undefined,
                        relatedGoalId: e.related_goal_id || undefined,
                        tags: (e.metadata as any)?.tags || [],
                        createdAt: e.created_at,
                    }))
                );
            }

            // 5. Goals
            const { data: goalsData } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });

            if (goalsData && goalsData.length > 0) {
                setGoals(
                    goalsData.map((g) => ({
                        id: g.id,
                        parentGoalId: g.parent_goal_id || undefined,
                        title: g.title,
                        description: g.description || undefined,
                        goalType: (g.goal_type as any) || "yearly",
                        period: g.period || undefined,
                        status: (g.status as any) || "active",
                        startDate: g.start_date || undefined,
                        targetDate: g.target_date || undefined,
                        progress: g.progress ?? 0,
                        lifeAreaId: g.life_area_id || undefined,
                        measurableTarget: g.measurable_target || undefined,
                        notes: g.notes || undefined,
                        createdAt: g.created_at ? g.created_at.split("T")[0] : "2026-08-19",
                    }))
                );
            }

            // 6. Tasks
            const { data: tasksData } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (tasksData) {
                setTasks(
                    tasksData.map((t) => ({
                        id: t.id,
                        title: t.title,
                        completed: t.status === "completed",
                        priority: (t.priority as "high" | "normal" | "low") || "normal",
                        category: "Personal",
                        dueDate: t.due_date ? t.due_date.split("T")[0] : undefined,
                        lifeAreaId: t.life_area_id || undefined,
                        goalId: t.goal_id || undefined,
                        time: t.time_window || undefined,
                    }))
                );
            }

            // 7. Deadlines
            const { data: deadlinesData } = await supabase
                .from("deadlines")
                .select("*")
                .eq("user_id", userId)
                .order("due_at", { ascending: true });

            if (deadlinesData) {
                setDeadlines(
                    deadlinesData.map((d) => {
                        const dueDateStr = d.due_at ? d.due_at.split("T")[0] : "2026-08-10";
                        return {
                            id: d.id,
                            title: d.title,
                            dueDate: dueDateStr,
                            daysLeft: calculateDaysLeft(dueDateStr),
                            priority: (d.priority as "high" | "normal" | "low") || "normal",
                            completed: d.status === "completed",
                            lifeAreaId: d.life_area_id || undefined,
                            goalId: d.goal_id || undefined,
                            notes: d.description || undefined,
                            relatedTaskId: d.related_task_id || undefined,
                        };
                    })
                );
            }

            // 8. Decisions
            const { data: decisionsData } = await supabase
                .from("decisions")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (decisionsData) {
                setDecisions(
                    decisionsData.map((d) => ({
                        id: d.id,
                        title: d.title,
                        situation: d.situation,
                        options: Array.isArray(d.options) ? (d.options as any) : [],
                        chosenOption: d.chosen_option || undefined,
                        reason: d.reason || undefined,
                        expectedOutcome: d.expected_outcome || undefined,
                        actualOutcome: d.actual_outcome || undefined,
                        status: (d.status as any) || "Under Consideration",
                        lifeAreaId: d.life_area_id || undefined,
                        createdAt: d.created_at ? d.created_at.split("T")[0] : "2026-08-08",
                    }))
                );
            }

            // 9. Knowledge Items
            const { data: knowledgeData } = await supabase
                .from("knowledge_items")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (knowledgeData) {
                setKnowledge(
                    knowledgeData.map((k) => ({
                        id: k.id,
                        title: k.title,
                        content: k.content,
                        category: (k.category as any) || "Notes",
                        source_url: k.source_url || undefined,
                        lifeAreaId: k.life_area_id || undefined,
                        tags: (k.metadata as any)?.tags || [],
                        url: k.source_url || undefined,
                        createdAt: k.created_at ? k.created_at.split("T")[0] : "2026-08-08",
                    }))
                );
            }

            // 10. Planner Items
            const { data: plannerData } = await supabase
                .from("planner_items")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });

            if (plannerData) {
                setPlanner(
                    plannerData.map((p) => ({
                        id: p.id,
                        day: p.day_of_week || "Monday",
                        title: p.title,
                        time: p.time_window || "09:00 - 11:00",
                        type: (p.item_type as any) || "work",
                        lifeAreaId: p.life_area_id || undefined,
                        goalId: p.goal_id || undefined,
                    }))
                );
            }
        } catch (err) {
            console.error("Error loading user data from Supabase:", err);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    // Auth State Synchronization
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    await fetchUserData(currentSession.user.id);
                } else {
                    setIsLoading(false);
                }
            } catch {
                setIsLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
                await fetchUserData(newSession.user.id);
            } else {
                setTasks([]);
                setDeadlines([]);
                setLedgerEntries([]);
                setGoals(initialGoals);
                setDecisions([]);
                setKnowledge([]);
                setPlanner([]);
                setIsLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, fetchUserData]);

    // Sign Out Action
    const signOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    // Profile Name Updater
    const setUserName = (name: string) => {
        setUserNameState(name);
        if (user) {
            supabase
                .from("profiles")
                .update({ full_name: name })
                .eq("id", user.id)
                .then();
        }
    };

    const updateProfile = async (fullName: string, timezone?: string) => {
        setUserNameState(fullName);
        if (user) {
            await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    timezone: timezone || "UTC",
                })
                .eq("id", user.id);
        }
    };

    // ==========================================
    // Life Areas CRUD
    // ==========================================
    const addLifeArea = async (area: Omit<LifeArea, "id">) => {
        const tempId = `area-${Date.now()}`;
        const newArea: LifeArea = { ...area, id: tempId };
        setLifeAreas((prev) => [...prev, newArea]);

        if (user) {
            const { data, error } = await supabase
                .from("life_areas")
                .insert({
                    user_id: user.id,
                    name: area.name,
                    color: area.color,
                    icon: area.icon,
                    description: area.description,
                })
                .select("id")
                .single();

            if (data && !error) {
                setLifeAreas((prev) => prev.map((a) => (a.id === tempId ? { ...a, id: data.id } : a)));
            }
        }
    };

    const deleteLifeArea = async (id: string) => {
        setLifeAreas((prev) => prev.filter((a) => a.id !== id));
        if (activeLifeArea === id) setActiveLifeArea("all");

        if (user) {
            await supabase.from("life_areas").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    // ==========================================
    // Ledgers & Entries CRUD
    // ==========================================
    const addLedger = async (ledger: Omit<Ledger, "id">) => {
        const tempId = `ldg-${Date.now()}`;
        const newLedger: Ledger = { ...ledger, id: tempId };
        setLedgers((prev) => [...prev, newLedger]);

        if (user) {
            const { data, error } = await supabase
                .from("ledgers")
                .insert({
                    user_id: user.id,
                    name: ledger.name,
                    description: ledger.description,
                    color: ledger.color,
                    is_default: ledger.isDefault || false,
                })
                .select("id")
                .single();

            if (data && !error) {
                setLedgers((prev) => prev.map((l) => (l.id === tempId ? { ...l, id: data.id } : l)));
            }
        }
    };

    const deleteLedger = async (id: string) => {
        setLedgers((prev) => prev.filter((l) => l.id !== id));
        setLedgerEntries((prev) => prev.filter((e) => e.ledgerId !== id));

        if (user) {
            await supabase.from("ledgers").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    const addLedgerEntry = async (entry: Omit<LedgerEntry, "id" | "createdAt">) => {
        const tempId = `ent-${Date.now()}`;
        const newEntry: LedgerEntry = {
            ...entry,
            id: tempId,
            createdAt: new Date().toISOString(),
        };
        setLedgerEntries((prev) => [newEntry, ...prev]);

        if (user) {
            const { data, error } = await supabase
                .from("ledger_entries")
                .insert({
                    user_id: user.id,
                    ledger_id: entry.ledgerId,
                    life_area_id: entry.lifeAreaId || null,
                    title: entry.title,
                    content: entry.description,
                    entry_date: entry.date ? `${entry.date}T${entry.time || "00:00"}:00Z` : new Date().toISOString(),
                    related_goal_id: entry.relatedGoalId || null,
                    metadata: { tags: entry.tags, attachment: entry.attachment },
                })
                .select("id")
                .single();

            if (data && !error) {
                setLedgerEntries((prev) => prev.map((e) => (e.id === tempId ? { ...e, id: data.id } : e)));
            }
        }
    };

    const updateLedgerEntry = async (entry: LedgerEntry) => {
        setLedgerEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));

        if (user) {
            await supabase
                .from("ledger_entries")
                .update({
                    ledger_id: entry.ledgerId,
                    life_area_id: entry.lifeAreaId || null,
                    title: entry.title,
                    content: entry.description,
                    entry_date: entry.date ? `${entry.date}T${entry.time || "00:00"}:00Z` : new Date().toISOString(),
                    related_goal_id: entry.relatedGoalId || null,
                    metadata: { tags: entry.tags, attachment: entry.attachment },
                })
                .eq("id", entry.id)
                .eq("user_id", user.id);
        }
    };

    const deleteLedgerEntry = async (id: string) => {
        setLedgerEntries((prev) => prev.filter((e) => e.id !== id));

        if (user) {
            await supabase.from("ledger_entries").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    // ==========================================
    // Goals CRUD & Dynamic Rollup
    // ==========================================
    const recalculateGoalProgress = (goalId: string, currentGoals: Goal[], currentTasks: Task[]): number => {
        const childGoals = currentGoals.filter((g) => g.parentGoalId === goalId);
        const linkedTasks = currentTasks.filter((t) => t.goalId === goalId);

        if (childGoals.length > 0) {
            const sumProgress = childGoals.reduce((sum, g) => sum + (g.status === "completed" ? 100 : g.progress), 0);
            return Math.round(sumProgress / childGoals.length);
        }

        if (linkedTasks.length > 0) {
            const completedCount = linkedTasks.filter((t) => t.completed).length;
            return Math.round((completedCount / linkedTasks.length) * 100);
        }

        const target = currentGoals.find((g) => g.id === goalId);
        return target ? target.progress : 0;
    };

    const addGoal = async (goalData: Omit<Goal, "id" | "createdAt">): Promise<string> => {
        const tempId = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newGoal: Goal = {
            ...goalData,
            id: tempId,
            progress: goalData.progress ?? 0,
            createdAt: new Date().toISOString().split("T")[0],
        };

        setGoals((prev) => [newGoal, ...prev]);

        if (user) {
            const { data, error } = await supabase
                .from("goals")
                .insert({
                    user_id: user.id,
                    parent_goal_id: goalData.parentGoalId || null,
                    title: goalData.title,
                    description: goalData.description || null,
                    goal_type: goalData.goalType,
                    period: goalData.period || null,
                    status: goalData.status,
                    start_date: goalData.startDate || null,
                    target_date: goalData.targetDate || null,
                    progress: goalData.progress ?? 0,
                    life_area_id: goalData.lifeAreaId || null,
                    measurable_target: goalData.measurableTarget || null,
                    notes: goalData.notes || null,
                })
                .select("id")
                .single();

            if (data && !error) {
                setGoals((prev) => prev.map((g) => (g.id === tempId ? { ...g, id: data.id } : g)));
                return data.id;
            }
        }

        return tempId;
    };

    const updateGoal = async (goal: Goal) => {
        setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));

        if (user) {
            await supabase
                .from("goals")
                .update({
                    parent_goal_id: goal.parentGoalId || null,
                    title: goal.title,
                    description: goal.description || null,
                    goal_type: goal.goalType,
                    period: goal.period || null,
                    status: goal.status,
                    start_date: goal.startDate || null,
                    target_date: goal.targetDate || null,
                    progress: goal.progress,
                    life_area_id: goal.lifeAreaId || null,
                    measurable_target: goal.measurableTarget || null,
                    notes: goal.notes || null,
                })
                .eq("id", goal.id)
                .eq("user_id", user.id);
        }
    };

    const deleteGoal = async (id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id && g.parentGoalId !== id));

        if (user) {
            await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    const toggleGoalStatus = async (id: string) => {
        const target = goals.find((g) => g.id === id);
        if (!target) return;

        const newStatus = target.status === "completed" ? "active" : "completed";
        const newProgress = newStatus === "completed" ? 100 : 0;

        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, status: newStatus, progress: newProgress } : g))
        );

        if (user) {
            await supabase
                .from("goals")
                .update({ status: newStatus, progress: newProgress })
                .eq("id", id)
                .eq("user_id", user.id);
        }
    };

    const batchAddGoals = async (goalsList: Omit<Goal, "id" | "createdAt">[]) => {
        // Map temporary IDs to generated items
        const idMapping: { [tempId: string]: string } = {};

        for (const item of goalsList) {
            const resolvedParentId = item.parentGoalId && idMapping[item.parentGoalId]
                ? idMapping[item.parentGoalId]
                : item.parentGoalId;

            const createdId = await addGoal({
                ...item,
                parentGoalId: resolvedParentId,
            });

            if (item.parentGoalId) {
                idMapping[item.parentGoalId] = createdId;
            }
        }
    };

    // ==========================================
    // Tasks CRUD
    // ==========================================
    const addTask = async (task: Omit<Task, "id">) => {
        const tempId = `task-${Date.now()}`;
        const newTask: Task = { ...task, id: tempId };
        setTasks((prev) => [newTask, ...prev]);

        if (user) {
            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    user_id: user.id,
                    title: task.title,
                    status: task.completed ? "completed" : "pending",
                    priority: task.priority,
                    due_date: task.dueDate ? `${task.dueDate}T00:00:00Z` : null,
                    life_area_id: task.lifeAreaId || null,
                    goal_id: task.goalId || null,
                    time_window: task.time || null,
                })
                .select("id")
                .single();

            if (data && !error) {
                setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t)));
            }
        }
    };

    const toggleTask = async (id: string) => {
        const taskToToggle = tasks.find((t) => t.id === id);
        if (!taskToToggle) return;

        const newCompleted = !taskToToggle.completed;
        const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t));
        setTasks(updatedTasks);

        if (user) {
            await supabase
                .from("tasks")
                .update({
                    status: newCompleted ? "completed" : "pending",
                    completed_at: newCompleted ? new Date().toISOString() : null,
                })
                .eq("id", id)
                .eq("user_id", user.id);
        }

        // Check if task is linked to a goal and update goal progress
        if (taskToToggle.goalId) {
            const newProg = recalculateGoalProgress(taskToToggle.goalId, goals, updatedTasks);
            const targetGoal = goals.find((g) => g.id === taskToToggle.goalId);
            if (targetGoal) {
                updateGoal({ ...targetGoal, progress: newProg });
            }
        }
    };

    const deleteTask = async (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));

        if (user) {
            await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    const updateTask = async (task: Task) => {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

        if (user) {
            await supabase
                .from("tasks")
                .update({
                    title: task.title,
                    status: task.completed ? "completed" : "pending",
                    priority: task.priority,
                    due_date: task.dueDate ? `${task.dueDate}T00:00:00Z` : null,
                    life_area_id: task.lifeAreaId || null,
                    goal_id: task.goalId || null,
                    time_window: task.time || null,
                })
                .eq("id", task.id)
                .eq("user_id", user.id);
        }
    };

    // ==========================================
    // Deadlines CRUD
    // ==========================================
    const addDeadline = async (deadline: Omit<Deadline, "id" | "daysLeft" | "completed">) => {
        const tempId = `dl-${Date.now()}`;
        const newDeadline: Deadline = {
            ...deadline,
            id: tempId,
            daysLeft: calculateDaysLeft(deadline.dueDate),
            completed: false,
        };
        setDeadlines((prev) => [...prev, newDeadline]);

        if (user) {
            const { data, error } = await supabase
                .from("deadlines")
                .insert({
                    user_id: user.id,
                    title: deadline.title,
                    due_at: `${deadline.dueDate}T${deadline.time || "18:00"}:00Z`,
                    priority: deadline.priority,
                    status: "pending",
                    life_area_id: deadline.lifeAreaId || null,
                    goal_id: deadline.goalId || null,
                    description: deadline.notes || null,
                    related_task_id: deadline.relatedTaskId || null,
                })
                .select("id")
                .single();

            if (data && !error) {
                setDeadlines((prev) => prev.map((d) => (d.id === tempId ? { ...d, id: data.id } : d)));
            }
        }
    };

    const toggleDeadline = async (id: string) => {
        const target = deadlines.find((d) => d.id === id);
        if (!target) return;

        const newCompleted = !target.completed;
        setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, completed: newCompleted } : d)));

        if (user) {
            await supabase
                .from("deadlines")
                .update({ status: newCompleted ? "completed" : "pending" })
                .eq("id", id)
                .eq("user_id", user.id);
        }
    };

    const deleteDeadline = async (id: string) => {
        setDeadlines((prev) => prev.filter((d) => d.id !== id));

        if (user) {
            await supabase.from("deadlines").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    const updateDeadline = async (deadline: Deadline) => {
        setDeadlines((prev) => prev.map((d) => (d.id === deadline.id ? deadline : d)));

        if (user) {
            await supabase
                .from("deadlines")
                .update({
                    title: deadline.title,
                    due_at: `${deadline.dueDate}T${deadline.time || "18:00"}:00Z`,
                    priority: deadline.priority,
                    status: deadline.completed ? "completed" : "pending",
                    life_area_id: deadline.lifeAreaId || null,
                    goal_id: deadline.goalId || null,
                    description: deadline.notes || null,
                    related_task_id: deadline.relatedTaskId || null,
                })
                .eq("id", deadline.id)
                .eq("user_id", user.id);
        }
    };

    // ==========================================
    // Decisions CRUD
    // ==========================================
    const addDecision = async (decision: Omit<Decision, "id" | "createdAt">) => {
        const tempId = `dec-${Date.now()}`;
        const newDecision: Decision = {
            ...decision,
            id: tempId,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setDecisions((prev) => [newDecision, ...prev]);

        if (user) {
            const { data, error } = await supabase
                .from("decisions")
                .insert({
                    user_id: user.id,
                    life_area_id: decision.lifeAreaId || null,
                    title: decision.title,
                    situation: decision.situation,
                    options: decision.options,
                    chosen_option: decision.chosenOption || null,
                    reason: decision.reason || null,
                    expected_outcome: decision.expectedOutcome || null,
                    actual_outcome: decision.actualOutcome || null,
                    status: decision.status,
                })
                .select("id")
                .single();

            if (data && !error) {
                setDecisions((prev) => prev.map((d) => (d.id === tempId ? { ...d, id: data.id } : d)));
            }
        }
    };

    const updateDecision = async (decision: Decision) => {
        setDecisions((prev) => prev.map((d) => (d.id === decision.id ? decision : d)));

        if (user) {
            await supabase
                .from("decisions")
                .update({
                    life_area_id: decision.lifeAreaId || null,
                    title: decision.title,
                    situation: decision.situation,
                    options: decision.options,
                    chosen_option: decision.chosenOption || null,
                    reason: decision.reason || null,
                    expected_outcome: decision.expectedOutcome || null,
                    actual_outcome: decision.actualOutcome || null,
                    status: decision.status,
                })
                .eq("id", decision.id)
                .eq("user_id", user.id);
        }
    };

    const deleteDecision = async (id: string) => {
        setDecisions((prev) => prev.filter((d) => d.id !== id));

        if (user) {
            await supabase.from("decisions").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    // ==========================================
    // Knowledge Items CRUD
    // ==========================================
    const addKnowledgeItem = async (item: Omit<KnowledgeItem, "id" | "createdAt">) => {
        const tempId = `kn-${Date.now()}`;
        const newItem: KnowledgeItem = {
            ...item,
            id: tempId,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setKnowledge((prev) => [newItem, ...prev]);

        if (user) {
            const { data, error } = await supabase
                .from("knowledge_items")
                .insert({
                    user_id: user.id,
                    life_area_id: item.lifeAreaId || null,
                    title: item.title,
                    content: item.content,
                    source_url: item.url || null,
                    category: item.category,
                    metadata: { tags: item.tags },
                })
                .select("id")
                .single();

            if (data && !error) {
                setKnowledge((prev) => prev.map((k) => (k.id === tempId ? { ...k, id: data.id } : k)));
            }
        }
    };

    const updateKnowledgeItem = async (item: KnowledgeItem) => {
        setKnowledge((prev) => prev.map((k) => (k.id === item.id ? item : k)));

        if (user) {
            await supabase
                .from("knowledge_items")
                .update({
                    life_area_id: item.lifeAreaId || null,
                    title: item.title,
                    content: item.content,
                    source_url: item.url || null,
                    category: item.category,
                    metadata: { tags: item.tags },
                })
                .eq("id", item.id)
                .eq("user_id", user.id);
        }
    };

    const deleteKnowledgeItem = async (id: string) => {
        setKnowledge((prev) => prev.filter((k) => k.id !== id));

        if (user) {
            await supabase.from("knowledge_items").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    // ==========================================
    // Planner Sessions CRUD
    // ==========================================
    const addPlannerSession = async (sessionData: Omit<PlannerSession, "id">) => {
        const tempId = `plan-${Date.now()}`;
        const newSession: PlannerSession = { ...sessionData, id: tempId };
        setPlanner((prev) => [...prev, newSession]);

        if (user) {
            const { data, error } = await supabase
                .from("planner_items")
                .insert({
                    user_id: user.id,
                    title: sessionData.title,
                    day_of_week: sessionData.day,
                    time_window: sessionData.time,
                    item_type: sessionData.type,
                    life_area_id: sessionData.lifeAreaId || null,
                    goal_id: sessionData.goalId || null,
                })
                .select("id")
                .single();

            if (data && !error) {
                setPlanner((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: data.id } : p)));
            }
        }
    };

    const updatePlannerSession = async (sessionData: PlannerSession) => {
        setPlanner((prev) => prev.map((p) => (p.id === sessionData.id ? sessionData : p)));

        if (user) {
            await supabase
                .from("planner_items")
                .update({
                    title: sessionData.title,
                    day_of_week: sessionData.day,
                    time_window: sessionData.time,
                    item_type: sessionData.type,
                    life_area_id: sessionData.lifeAreaId || null,
                    goal_id: sessionData.goalId || null,
                })
                .eq("id", sessionData.id)
                .eq("user_id", user.id);
        }
    };

    const deletePlannerSession = async (id: string) => {
        setPlanner((prev) => prev.filter((p) => p.id !== id));

        if (user) {
            await supabase.from("planner_items").delete().eq("id", id).eq("user_id", user.id);
        }
    };

    // ==========================================
    // Ask Lifeweft Query Retriever Engine
    // ==========================================
    const queryLifeweft = async (question: string): Promise<AskLifeweftAnswer> => {
        const q = question.toLowerCase();
        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const relatedItems: AskLifeweftAnswer["relatedItems"] = [];
        const insights: string[] = [];

        // Context search across goals
        const matchedGoals = goals.filter(
            (g) =>
                q.includes("goal") ||
                q.includes("yearly") ||
                q.includes("milestone") ||
                q.includes("achieve") ||
                q.includes("target") ||
                g.title.toLowerCase().includes(q)
        );
        matchedGoals.slice(0, 3).forEach((g) => {
            relatedItems.push({
                type: "goal",
                id: g.id,
                title: g.title,
                detail: `Level: ${g.goalType.toUpperCase()} • Progress: ${g.progress}% • Target: ${g.targetDate || g.period || "Ongoing"}`,
            });
        });

        // Context search across tasks
        const activeTasks = tasks.filter((t) => !t.completed);
        const matchedTasks = activeTasks.filter(
            (t) => q.includes("task") || q.includes("do") || q.includes("today") || t.title.toLowerCase().includes(q)
        );
        matchedTasks.slice(0, 3).forEach((t) => {
            relatedItems.push({
                type: "task",
                id: t.id,
                title: t.title,
                detail: `Priority: ${t.priority} ${t.time ? `• ${t.time}` : ""}`,
            });
        });

        // Context search across deadlines
        const pendingDeadlines = deadlines.filter((d) => !d.completed);
        const matchedDeadlines = pendingDeadlines.filter(
            (d) => q.includes("deadline") || q.includes("due") || q.includes("week") || d.title.toLowerCase().includes(q)
        );
        matchedDeadlines.slice(0, 3).forEach((d) => {
            relatedItems.push({
                type: "deadline",
                id: d.id,
                title: d.title,
                detail: `Due in ${d.daysLeft} days (${d.dueDate})`,
            });
        });

        // Context search across ledger
        const matchedLedger = ledgerEntries.filter(
            (l) => q.includes("ledger") || q.includes("happened") || q.includes("accomplish") || l.title.toLowerCase().includes(q)
        );
        matchedLedger.slice(0, 2).forEach((l) => {
            relatedItems.push({
                type: "ledger",
                id: l.id,
                title: l.title,
                detail: `${l.date} • ${l.description.substring(0, 60)}...`,
            });
        });

        // Context search across decisions
        const matchedDecisions = decisions.filter(
            (d) => q.includes("decid") || q.includes("decision") || q.includes("stack") || d.title.toLowerCase().includes(q)
        );
        matchedDecisions.slice(0, 2).forEach((d) => {
            relatedItems.push({
                type: "decision",
                id: d.id,
                title: d.title,
                detail: `Status: ${d.status} • Chosen: ${d.chosenOption || "Under Consideration"}`,
            });
        });

        // Generate response summary from retrieved workspace context
        let summary = "";
        if (q.includes("goal") || q.includes("yearly") || q.includes("milestone") || q.includes("track")) {
            const activeGoals = goals.filter((g) => g.status === "active");
            const yearlyCount = goals.filter((g) => g.goalType === "yearly").length;
            const avgProgress = goals.length > 0
                ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
                : 0;

            summary = `You have ${activeGoals.length} active goals across ${yearlyCount} master yearly initiatives, with an overall execution rate of ${avgProgress}%.`;

            const dailyActionGoals = goals.filter((g) => g.goalType === "daily" && g.status === "active");
            if (dailyActionGoals.length > 0) {
                insights.push(`You have ${dailyActionGoals.length} immediate daily action(s) contributing to your milestone roadmaps.`);
            }
        } else if (q.includes("today") || q.includes("priorit")) {
            const todayGoals = goals.filter((g) => g.goalType === "daily" && g.status === "active");
            summary = `You have ${activeTasks.length} tasks and ${todayGoals.length} daily milestone action(s) on your agenda today.`;
            if (activeTasks.filter((t) => t.priority === "high").length > 0) {
                insights.push("You have high-priority tasks requiring immediate focus.");
            }
        } else if (q.includes("deadline") || q.includes("week")) {
            summary = `Found ${pendingDeadlines.length} pending deadlines in your tracker.`;
            if (pendingDeadlines.some((d) => d.daysLeft <= 3)) {
                insights.push("One or more deadlines are due within 72 hours.");
            }
        } else if (q.includes("decid") || q.includes("decision")) {
            summary = `You have ${decisions.length} strategic decisions recorded in your Decision Journal.`;
        } else {
            summary = `Retrieved ${relatedItems.length} relevant items from your personal memory layer matching "${question}".`;
        }

        return {
            id: `ans-${Date.now()}`,
            question,
            summary,
            relatedItems,
            insights: insights.length > 0 ? insights : undefined,
            timestamp,
        };
    };

    return (
        <AppContext.Provider
            value={{
                user,
                session,
                isLoading,
                signOut,
                lifeAreas,
                activeLifeArea,
                setActiveLifeArea,
                addLifeArea,
                deleteLifeArea,
                ledgers,
                ledgerEntries,
                addLedger,
                deleteLedger,
                addLedgerEntry,
                updateLedgerEntry,
                deleteLedgerEntry,
                goals,
                addGoal,
                updateGoal,
                deleteGoal,
                toggleGoalStatus,
                batchAddGoals,
                tasks,
                addTask,
                toggleTask,
                deleteTask,
                updateTask,
                deadlines,
                addDeadline,
                toggleDeadline,
                deleteDeadline,
                updateDeadline,
                decisions,
                addDecision,
                updateDecision,
                deleteDecision,
                knowledge,
                addKnowledgeItem,
                updateKnowledgeItem,
                deleteKnowledgeItem,
                planner,
                addPlannerSession,
                updatePlannerSession,
                deletePlannerSession,
                userName,
                setUserName,
                updateProfile,
                queryLifeweft,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
