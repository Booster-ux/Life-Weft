"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LifeArea {
    id: string;
    name: string;
    color: string; // Tailwind-friendly or hex color
    icon?: string;
}

export interface Ledger {
    id: string;
    name: string;
    description: string;
    color: string;
    lifeAreaId?: string;
    isDefault?: boolean;
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
}

export interface AskLifeweftAnswer {
    id: string;
    question: string;
    summary: string;
    relatedItems: {
        type: "task" | "deadline" | "ledger" | "decision" | "knowledge" | "planner";
        id: string;
        title: string;
        detail?: string;
    }[];
    insights?: string[];
    timestamp: string;
}

interface AppContextType {
    // Life Areas
    lifeAreas: LifeArea[];
    activeLifeArea: string; // "all" or specific life area id
    setActiveLifeArea: (id: string) => void;
    addLifeArea: (area: Omit<LifeArea, "id">) => void;
    deleteLifeArea: (id: string) => void;

    // Ledgers & Entries
    ledgers: Ledger[];
    ledgerEntries: LedgerEntry[];
    addLedger: (ledger: Omit<Ledger, "id">) => void;
    deleteLedger: (id: string) => void;
    addLedgerEntry: (entry: Omit<LedgerEntry, "id" | "createdAt">) => void;
    updateLedgerEntry: (entry: LedgerEntry) => void;
    deleteLedgerEntry: (id: string) => void;

    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, "id">) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTask: (task: Task) => void;

    // Deadlines
    deadlines: Deadline[];
    addDeadline: (deadline: Omit<Deadline, "id" | "daysLeft" | "completed">) => void;
    toggleDeadline: (id: string) => void;
    deleteDeadline: (id: string) => void;
    updateDeadline: (deadline: Deadline) => void;

    // Decisions
    decisions: Decision[];
    addDecision: (decision: Omit<Decision, "id" | "createdAt">) => void;
    updateDecision: (decision: Decision) => void;
    deleteDecision: (id: string) => void;

    // Knowledge
    knowledge: KnowledgeItem[];
    addKnowledgeItem: (item: Omit<KnowledgeItem, "id" | "createdAt">) => void;
    updateKnowledgeItem: (item: KnowledgeItem) => void;
    deleteKnowledgeItem: (id: string) => void;

    // Planner
    planner: PlannerSession[];
    addPlannerSession: (session: Omit<PlannerSession, "id">) => void;
    updatePlannerSession: (session: PlannerSession) => void;
    deletePlannerSession: (id: string) => void;

    // User & Preferences
    userName: string;
    setUserName: (name: string) => void;

    // Ask Lifeweft Query Engine
    queryLifeweft: (question: string) => Promise<AskLifeweftAnswer>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default Life Areas
const initialLifeAreas: LifeArea[] = [
    { id: "area-personal", name: "Personal", color: "#3B82F6" },
    { id: "area-work", name: "Work", color: "#6366F1" },
    { id: "area-business", name: "Business", color: "#D4A72C" },
    { id: "area-school", name: "School", color: "#10B981" },
    { id: "area-family", name: "Family", color: "#EC4899" },
    { id: "area-projects", name: "Projects", color: "#8B5CF6" },
];

// Default Ledgers
const initialLedgers: Ledger[] = [
    { id: "ldg-personal", name: "Personal", description: "Daily life moments, milestones and reflections", color: "#3B82F6", lifeAreaId: "area-personal", isDefault: true },
    { id: "ldg-work", name: "Work", description: "Professional achievements, meetings and updates", color: "#6366F1", lifeAreaId: "area-work", isDefault: true },
    { id: "ldg-business", name: "Startup Journey", description: "Building, launching, revenue and customer notes", color: "#D4A72C", lifeAreaId: "area-business" },
    { id: "ldg-school", name: "Final Year", description: "Academic milestones, study breakthroughs and thesis", color: "#10B981", lifeAreaId: "area-school" },
];

// Initial Ledger Entries (Chronological record)
const initialLedgerEntries: LedgerEntry[] = [
    {
        id: "le-1",
        title: "Client discovery meeting with Apex Studio",
        description: "Had our first comprehensive kickoff meeting with the new client. They want the complete web brand and portal completed by September 10. Agreed on milestones and sent preliminary scoping document.",
        date: "2026-08-08",
        time: "10:30",
        ledgerId: "ldg-business",
        lifeAreaId: "area-business",
        tags: ["Client", "Meeting", "Milestone", "Apex"],
        relatedDeadlineId: "d2",
        attachment: { name: "Apex_Project_Scope_v1.pdf", type: "pdf" },
        createdAt: "2026-08-08T10:30:00.000Z",
    },
    {
        id: "le-2",
        title: "Selected Supabase for user authentication & data layer",
        description: "Evaluated Firebase vs Supabase for our new project architecture. Chose Supabase because of Postgres Row Level Security (RLS), clean TypeScript SDK, and seamless SQL migration tooling.",
        date: "2026-08-07",
        time: "15:45",
        ledgerId: "ldg-business",
        lifeAreaId: "area-business",
        tags: ["TechStack", "Architecture", "Database"],
        relatedDecisionId: "dec1",
        createdAt: "2026-08-07T15:45:00.000Z",
    },
    {
        id: "le-3",
        title: "Economics thesis outline approved by advisor",
        description: "Professor Miller reviewed my behavioral pricing model draft and gave the green light. Must submit full Chapter 1 and sample dataset by next week.",
        date: "2026-08-06",
        time: "11:15",
        ledgerId: "ldg-school",
        lifeAreaId: "area-school",
        tags: ["Thesis", "Economics", "University"],
        relatedTaskId: "5",
        createdAt: "2026-08-06T11:15:00.000Z",
    },
    {
        id: "le-4",
        title: "Signed annual wellness and fitness membership",
        description: "Committed to 4 strength training sessions weekly with personal coaching check-in every month. Target is maintaining high mental clarity and stamina.",
        date: "2026-08-05",
        time: "08:00",
        ledgerId: "ldg-personal",
        lifeAreaId: "area-personal",
        tags: ["Health", "Habits", "Fitness"],
        createdAt: "2026-08-05T08:00:00.000Z",
    },
];

const initialTasks: Task[] = [
    { id: "1", title: "Prep for Q3 Project Review presentation", completed: false, time: "Morning", priority: "high", category: "Work", dueDate: "2026-08-08", lifeAreaId: "area-work", tags: ["Presentation", "Q3"] },
    { id: "2", title: "Review design feedback on Lifeweft landing experience", completed: true, time: "Morning", priority: "high", category: "Work", dueDate: "2026-08-08", lifeAreaId: "area-work", tags: ["Design", "Review"] },
    { id: "3", title: "Read Chapter 4 of Economics textbook", completed: false, time: "Afternoon", priority: "normal", category: "Student", dueDate: "2026-08-08", lifeAreaId: "area-school", tags: ["Study"] },
    { id: "4", title: "Renew gym membership locker & schedule trainer", completed: false, time: "Afternoon", priority: "normal", category: "Health", dueDate: "2026-08-08", lifeAreaId: "area-personal", tags: ["Health"] },
    { id: "5", title: "Submit Statistics Homework Dataset", completed: false, time: "Evening", priority: "high", category: "Student", dueDate: "2026-08-10", deadlineId: "d1", lifeAreaId: "area-school", tags: ["Stats", "Homework"] },
    { id: "6", title: "Buy groceries: oats, organic berries, eggs, wild salmon", completed: false, time: "Evening", priority: "low", category: "Personal", dueDate: "2026-08-08", lifeAreaId: "area-personal", tags: ["Nutrition"] },
    { id: "7", title: "Plan upcoming summer flight itinerary", completed: true, time: "Evening", priority: "normal", category: "Personal", dueDate: "2026-08-07", lifeAreaId: "area-personal", tags: ["Travel"] },
];

const initialDeadlines: Deadline[] = [
    { id: "d1", title: "Statistics Term Assignment", dueDate: "2026-08-10", daysLeft: 2, priority: "high", relatedTaskId: "5", completed: false, lifeAreaId: "area-school", time: "23:59", notes: "Requires SPSS charts and data regression table." },
    { id: "d2", title: "Project Deliverable Alpha Launch (Apex)", dueDate: "2026-08-13", daysLeft: 5, priority: "high", completed: false, lifeAreaId: "area-business", time: "18:00", notes: "Final staging walkthrough with client stakeholder." },
    { id: "d3", title: "Tax Declaration Filing 2025", dueDate: "2026-08-23", daysLeft: 15, priority: "normal", completed: false, lifeAreaId: "area-personal", notes: "Submit electronic filing via government tax portal." },
    { id: "d4", title: "Draft Proposal for Brand Refresh", dueDate: "2026-08-06", daysLeft: -2, priority: "normal", completed: true, lifeAreaId: "area-work", notes: "Initial brand guidelines deck sent." },
];

const initialDecisions: Decision[] = [
    {
        id: "dec1",
        title: "Frontend & Database Stack Selection for Lifeweft",
        situation: "Choosing the optimal database architecture and auth system for high-privacy personal life data.",
        options: [
            {
                name: "Option A: Supabase (PostgreSQL + RLS)",
                pros: ["Row Level Security ensures absolute user privacy", "Relational querying for interconnected life data", "Clean TypeScript SDK"],
                cons: ["Slightly steeper SQL migration curve than NoSQL"],
                cost: "$0-$25/mo",
                time: "Immediate setup",
                risks: "Low"
            },
            {
                name: "Option B: Firebase Firestore (NoSQL)",
                pros: ["Fast initial prototype setup", "Generous free tier"],
                cons: ["Complex multi-entity relational queries across tasks/ledger", "Vendor lock-in"],
                cost: "Usage-based",
                time: "Fast",
                risks: "Query limitations as features expand"
            }
        ],
        chosenOption: "Option A: Supabase (PostgreSQL + RLS)",
        reason: "PostgreSQL Row Level Security matches Lifeweft's privacy-first ethos, and relational schema easily joins ledger entries with tasks, deadlines, and decisions.",
        expectedOutcome: "Robust data security with flexible multi-entity queries.",
        actualOutcome: "Fast querying and clean local-first synchronizing patterns.",
        status: "Decided",
        recommendedStep: "Configure Supabase client and structure relational schemas with foreign keys.",
        lifeAreaId: "area-business",
        createdAt: "2026-08-07"
    }
];

const initialKnowledge: KnowledgeItem[] = [
    {
        id: "k1",
        title: "Lifeweft Brand & Design System Principles",
        content: "Core Aesthetic:\n- Background: #080B12 (Deep Black)\n- Surface: #0F1523 (Sleek Dark Blue Surface)\n- Primary Accent: #2563EB (Electric Blue)\n- Highlight Accent: #D4A72C (Refined Gold - use with intentional restraint)\n- Mood: Calm, Intelligent, Modern, Organized, Human. Not a cluttered spreadsheet.",
        category: "Notes",
        lifeAreaId: "area-work",
        tags: ["DesignSystem", "Colors", "Branding"],
        createdAt: "2026-08-08"
    },
    {
        id: "k2",
        title: "Growth & Product Architecture Vision",
        content: "Lifeweft is the personal information layer that understands a person's life:\n1. Personal Ledger = What happened & memory timeline\n2. Tasks & Deadlines = What needs to be done\n3. Decisions = Why choices were made\n4. Ask Lifeweft = Intelligent conversation over personal context",
        category: "Ideas",
        lifeAreaId: "area-business",
        tags: ["Strategy", "Vision"],
        createdAt: "2026-08-06"
    },
    {
        id: "k3",
        title: "Shortcuts & Command Palette Reference",
        content: "Keyboard Shortcuts:\n- Ctrl+K / Cmd+K: Open Universal Global Search\n- Quick Capture (+): Instant capture modal\n- 1-9: Navigate primary life areas",
        category: "References",
        lifeAreaId: "area-personal",
        tags: ["Shortcuts", "Workflow"],
        createdAt: "2026-08-05"
    },
    {
        id: "k4",
        title: "Healthy Sleep & Focus Optimization Routine",
        content: "1. No screens 45 minutes before sleep.\n2. Keep room temperature at 18°C / 65°F.\n3. Morning sunlight exposure within 20 minutes of waking for circadian alignment.",
        category: "Saved Items",
        lifeAreaId: "area-personal",
        tags: ["Wellness", "Sleep"],
        createdAt: "2026-08-04"
    }
];

const initialPlanner: PlannerSession[] = [
    { id: "p1", day: "Monday", title: "Deep Work: Project Architecture", time: "09:00 - 11:30", type: "work", lifeAreaId: "area-work" },
    { id: "p2", day: "Monday", title: "Economics Lecture & Research", time: "14:00 - 16:00", type: "study", lifeAreaId: "area-school" },
    { id: "p3", day: "Tuesday", title: "Client Strategy & Review", time: "10:00 - 12:00", type: "work", lifeAreaId: "area-business" },
    { id: "p4", day: "Wednesday", title: "Statistics Lab & Analysis", time: "13:30 - 15:30", type: "study", lifeAreaId: "area-school" },
    { id: "p5", day: "Thursday", title: "Gym & Strength Conditioning", time: "17:00 - 18:30", type: "health", lifeAreaId: "area-personal" },
    { id: "p6", day: "Friday", title: "Weekly Retro & Memory Journaling", time: "15:00 - 16:00", type: "personal", lifeAreaId: "area-personal" },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(initialLifeAreas);
    const [activeLifeArea, setActiveLifeArea] = useState<string>("all");
    const [ledgers, setLedgers] = useState<Ledger[]>(initialLedgers);
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
    const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge);
    const [planner, setPlanner] = useState<PlannerSession[]>(initialPlanner);
    const [userName, setUserName] = useState<string>("Julian");

    // Hydrate state from localStorage on client mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLifeAreas = localStorage.getItem("lw_life_areas");
            const storedLedgers = localStorage.getItem("lw_ledgers");
            const storedLedgerEntries = localStorage.getItem("lw_ledger_entries");
            const storedTasks = localStorage.getItem("lw_tasks");
            const storedDeadlines = localStorage.getItem("lw_deadlines");
            const storedDecisions = localStorage.getItem("lw_decisions");
            const storedKnowledge = localStorage.getItem("lw_knowledge");
            const storedPlanner = localStorage.getItem("lw_planner");
            const storedUser = localStorage.getItem("lw_username");

            if (storedLifeAreas) setLifeAreas(JSON.parse(storedLifeAreas));
            if (storedLedgers) setLedgers(JSON.parse(storedLedgers));
            if (storedLedgerEntries) setLedgerEntries(JSON.parse(storedLedgerEntries));
            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedDeadlines) setDeadlines(JSON.parse(storedDeadlines));
            if (storedDecisions) setDecisions(JSON.parse(storedDecisions));
            if (storedKnowledge) setKnowledge(JSON.parse(storedKnowledge));
            if (storedPlanner) setPlanner(JSON.parse(storedPlanner));
            if (storedUser) setUserName(storedUser);
        }
    }, []);

    // Persist changes to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_life_areas", JSON.stringify(lifeAreas));
        }
    }, [lifeAreas]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_ledgers", JSON.stringify(ledgers));
        }
    }, [ledgers]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_ledger_entries", JSON.stringify(ledgerEntries));
        }
    }, [ledgerEntries]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_tasks", JSON.stringify(tasks));
        }
    }, [tasks]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_deadlines", JSON.stringify(deadlines));
        }
    }, [deadlines]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_decisions", JSON.stringify(decisions));
        }
    }, [decisions]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_knowledge", JSON.stringify(knowledge));
        }
    }, [knowledge]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_planner", JSON.stringify(planner));
        }
    }, [planner]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lw_username", userName);
        }
    }, [userName]);

    // Life Areas methods
    const addLifeArea = (areaData: Omit<LifeArea, "id">) => {
        const newArea: LifeArea = {
            ...areaData,
            id: "area-" + Math.random().toString(36).substr(2, 9),
        };
        setLifeAreas((prev) => [...prev, newArea]);
    };

    const deleteLifeArea = (id: string) => {
        setLifeAreas((prev) => prev.filter((a) => a.id !== id));
        if (activeLifeArea === id) {
            setActiveLifeArea("all");
        }
    };

    // Ledger methods
    const addLedger = (ledgerData: Omit<Ledger, "id">) => {
        const newLedger: Ledger = {
            ...ledgerData,
            id: "ldg-" + Math.random().toString(36).substr(2, 9),
        };
        setLedgers((prev) => [...prev, newLedger]);
    };

    const deleteLedger = (id: string) => {
        setLedgers((prev) => prev.filter((l) => l.id !== id));
        setLedgerEntries((prev) => prev.filter((e) => e.ledgerId !== id));
    };

    const addLedgerEntry = (entryData: Omit<LedgerEntry, "id" | "createdAt">) => {
        const newEntry: LedgerEntry = {
            ...entryData,
            id: "le-" + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setLedgerEntries((prev) => [newEntry, ...prev]);
    };

    const updateLedgerEntry = (updatedEntry: LedgerEntry) => {
        setLedgerEntries((prev) =>
            prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
        );
    };

    const deleteLedgerEntry = (id: string) => {
        setLedgerEntries((prev) => prev.filter((e) => e.id !== id));
    };

    // Task methods
    const addTask = (taskData: Omit<Task, "id">) => {
        const newTask: Task = {
            ...taskData,
            id: "t-" + Math.random().toString(36).substr(2, 9),
        };
        setTasks((prev) => [newTask, ...prev]);
    };

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const updateTask = (updatedTask: Task) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    // Deadline methods
    const addDeadline = (deadlineData: Omit<Deadline, "id" | "daysLeft" | "completed">) => {
        const rawDueDate = new Date(deadlineData.dueDate);
        const today = new Date("2026-08-08"); // Current workspace base date
        const diffTime = rawDueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const newDeadline: Deadline = {
            ...deadlineData,
            id: "d-" + Math.random().toString(36).substr(2, 9),
            daysLeft: isNaN(diffDays) ? 0 : diffDays,
            completed: false,
        };

        // Auto create linked task if requested
        if (deadlineData.relatedTaskId === "auto-create") {
            const relatedTaskId = "t-" + Math.random().toString(36).substr(2, 9);
            const linkedTask: Task = {
                id: relatedTaskId,
                title: `Deliver: ${deadlineData.title}`,
                completed: false,
                priority: deadlineData.priority,
                category: "Work",
                dueDate: deadlineData.dueDate,
                deadlineId: newDeadline.id,
                lifeAreaId: deadlineData.lifeAreaId,
            };
            setTasks((prev) => [linkedTask, ...prev]);
            newDeadline.relatedTaskId = relatedTaskId;
        }

        setDeadlines((prev) => [newDeadline, ...prev]);
    };

    const toggleDeadline = (id: string) => {
        setDeadlines((prev) =>
            prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
        );

        const targetDeadline = deadlines.find((d) => d.id === id);
        if (targetDeadline?.relatedTaskId) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === targetDeadline.relatedTaskId ? { ...t, completed: !targetDeadline.completed } : t
                )
            );
        }
    };

    const deleteDeadline = (id: string) => {
        setDeadlines((prev) => prev.filter((d) => d.id !== id));
    };

    const updateDeadline = (updatedDeadline: Deadline) => {
        setDeadlines((prev) =>
            prev.map((d) => (d.id === updatedDeadline.id ? updatedDeadline : d))
        );
    };

    // Decision methods
    const addDecision = (decisionData: Omit<Decision, "id" | "createdAt">) => {
        const newDecision: Decision = {
            ...decisionData,
            id: "dec-" + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split("T")[0],
        };
        setDecisions((prev) => [newDecision, ...prev]);
    };

    const updateDecision = (updatedDecision: Decision) => {
        setDecisions((prev) =>
            prev.map((d) => (d.id === updatedDecision.id ? updatedDecision : d))
        );
    };

    const deleteDecision = (id: string) => {
        setDecisions((prev) => prev.filter((d) => d.id !== id));
    };

    // Knowledge methods
    const addKnowledgeItem = (itemData: Omit<KnowledgeItem, "id" | "createdAt">) => {
        const newItem: KnowledgeItem = {
            ...itemData,
            id: "k-" + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split("T")[0],
        };
        setKnowledge((prev) => [newItem, ...prev]);
    };

    const updateKnowledgeItem = (updatedItem: KnowledgeItem) => {
        setKnowledge((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
    };

    const deleteKnowledgeItem = (id: string) => {
        setKnowledge((prev) => prev.filter((item) => item.id !== id));
    };

    // Planner methods
    const addPlannerSession = (sessionData: Omit<PlannerSession, "id">) => {
        const newSession: PlannerSession = {
            ...sessionData,
            id: "p-" + Math.random().toString(36).substr(2, 9),
        };
        setPlanner((prev) => [...prev, newSession]);
    };

    const updatePlannerSession = (updatedSession: PlannerSession) => {
        setPlanner((prev) =>
            prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
        );
    };

    const deletePlannerSession = (id: string) => {
        setPlanner((prev) => prev.filter((s) => s.id !== id));
    };

    // Ask Lifeweft Search & Data Query Engine (Designed for future AI integration)
    const queryLifeweft = async (question: string): Promise<AskLifeweftAnswer> => {
        // Simulate a brief natural thinking delay (300ms)
        await new Promise((res) => setTimeout(res, 350));

        const lowerQ = question.toLowerCase();
        const relatedItems: AskLifeweftAnswer["relatedItems"] = [];
        const insights: string[] = [];
        let summary = "";

        // 1. Check for "today" or "priorities"
        if (lowerQ.includes("today") || lowerQ.includes("priorit")) {
            const todayTasks = tasks.filter((t) => !t.completed && (t.dueDate === "2026-08-08" || t.priority === "high"));
            const todayDeadlines = deadlines.filter((d) => !d.completed && d.daysLeft <= 2);

            todayTasks.forEach((t) => {
                relatedItems.push({
                    type: "task",
                    id: t.id,
                    title: t.title,
                    detail: `Priority: ${t.priority} • ${t.category}`,
                });
            });

            todayDeadlines.forEach((d) => {
                relatedItems.push({
                    type: "deadline",
                    id: d.id,
                    title: d.title,
                    detail: `Due in ${d.daysLeft} days (${d.dueDate})`,
                });
            });

            summary = `You have ${todayTasks.length} active tasks and ${todayDeadlines.length} high-priority deadlines requiring attention. Your top focus is "${todayTasks[0]?.title || "clearing pending items"}".`;
            insights.push("Schedule your highest impact work in the morning block before checking communications.");
        }
        // 2. Check for "deadlines" or "due"
        else if (lowerQ.includes("deadline") || lowerQ.includes("due")) {
            const upcoming = deadlines.filter((d) => !d.completed).sort((a, b) => a.daysLeft - b.daysLeft);
            upcoming.forEach((d) => {
                relatedItems.push({
                    type: "deadline",
                    id: d.id,
                    title: d.title,
                    detail: `Due date: ${d.dueDate} (${d.daysLeft >= 0 ? `${d.daysLeft} days left` : "Overdue"})`,
                });
            });
            summary = `You have ${upcoming.length} upcoming deadlines. The most immediate is "${upcoming[0]?.title || "None"}" on ${upcoming[0]?.dueDate || "schedule"}.`;
        }
        // 3. Check for "decide" or "decision"
        else if (lowerQ.includes("decid") || lowerQ.includes("choice") || lowerQ.includes("database") || lowerQ.includes("supabase")) {
            decisions.forEach((dec) => {
                relatedItems.push({
                    type: "decision",
                    id: dec.id,
                    title: dec.title || dec.situation,
                    detail: `Status: ${dec.status} • Chosen: ${dec.chosenOption || "Under review"}`,
                });
            });
            summary = decisions.length > 0
                ? `You have logged ${decisions.length} strategic decision journals. Your recent recorded decision was: "${decisions[0].title}" where you chose "${decisions[0].chosenOption || "Option under review"}".`
                : "You haven't logged any decisions matching this query yet.";
        }
        // 4. Check for "ledger", "what happened", "client", "business", or "meet"
        else if (lowerQ.includes("ledger") || lowerQ.includes("happen") || lowerQ.includes("client") || lowerQ.includes("business") || lowerQ.includes("apex") || lowerQ.includes("meet")) {
            const matchedEntries = ledgerEntries.filter((e) =>
                lowerQ.includes("ledger") ||
                e.title.toLowerCase().includes(lowerQ) ||
                e.description.toLowerCase().includes(lowerQ) ||
                e.tags.some((t) => lowerQ.includes(t.toLowerCase()))
            );

            const displayEntries = matchedEntries.length > 0 ? matchedEntries : ledgerEntries;
            displayEntries.forEach((e) => {
                relatedItems.push({
                    type: "ledger",
                    id: e.id,
                    title: e.title,
                    detail: `${e.date} • ${e.description.slice(0, 100)}...`,
                });
            });

            summary = `Found ${displayEntries.length} chronological ledger entries. Most recently on ${displayEntries[0]?.date || "today"}: "${displayEntries[0]?.title}".`;
            insights.push("All client updates and architecture milestones are stored in your Personal Ledger with full relationship tags.");
        }
        // 5. Check for "learn" or "knowledge" or "notes"
        else if (lowerQ.includes("learn") || lowerQ.includes("knowledge") || lowerQ.includes("note") || lowerQ.includes("idea")) {
            knowledge.forEach((k) => {
                relatedItems.push({
                    type: "knowledge",
                    id: k.id,
                    title: k.title,
                    detail: `${k.category} • ${k.content.slice(0, 90)}...`,
                });
            });
            summary = `Your Lifeweft Knowledge Base contains ${knowledge.length} organized reference documents and saved concepts.`;
        }
        // 6. Check for "summary" or "week"
        else if (lowerQ.includes("summar") || lowerQ.includes("week")) {
            summary = `Weekly Overview: You have ${tasks.filter((t) => t.completed).length} completed tasks, ${tasks.filter((t) => !t.completed).length} active tasks, ${deadlines.filter((d) => !d.completed).length} upcoming deadlines, ${planner.length} planned focus blocks, and ${ledgerEntries.length} timeline ledger entries logged.`;
            tasks.slice(0, 2).forEach((t) => relatedItems.push({ type: "task", id: t.id, title: t.title }));
            deadlines.slice(0, 2).forEach((d) => relatedItems.push({ type: "deadline", id: d.id, title: d.title }));
            ledgerEntries.slice(0, 2).forEach((e) => relatedItems.push({ type: "ledger", id: e.id, title: e.title }));
            insights.push("You are maintaining solid momentum across Work, Business, and School life areas.");
        }
        // 7. General search fallback
        else {
            // General query across all items
            const matchedTasks = tasks.filter((t) => t.title.toLowerCase().includes(lowerQ));
            const matchedDeadlines = deadlines.filter((d) => d.title.toLowerCase().includes(lowerQ));
            const matchedLedger = ledgerEntries.filter((e) => e.title.toLowerCase().includes(lowerQ) || e.description.toLowerCase().includes(lowerQ));
            const matchedKnowledge = knowledge.filter((k) => k.title.toLowerCase().includes(lowerQ) || k.content.toLowerCase().includes(lowerQ));

            matchedTasks.forEach((t) => relatedItems.push({ type: "task", id: t.id, title: t.title }));
            matchedDeadlines.forEach((d) => relatedItems.push({ type: "deadline", id: d.id, title: d.title }));
            matchedLedger.forEach((e) => relatedItems.push({ type: "ledger", id: e.id, title: e.title }));
            matchedKnowledge.forEach((k) => relatedItems.push({ type: "knowledge", id: k.id, title: k.title }));

            summary = relatedItems.length > 0
                ? `I searched your workspace and found ${relatedItems.length} matching records across tasks, deadlines, ledger entries, and knowledge items.`
                : `I searched across your tasks, deadlines, ledger entries, decisions, and knowledge notes for "${question}". No exact records matched, but you can create one using Quick Capture (+).`;
        }

        return {
            id: "ans-" + Math.random().toString(36).substr(2, 9),
            question,
            summary,
            relatedItems,
            insights: insights.length > 0 ? insights : undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
    };

    return (
        <AppContext.Provider
            value={{
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
                queryLifeweft,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
