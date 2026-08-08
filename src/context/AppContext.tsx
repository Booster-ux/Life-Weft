"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    time?: string; // e.g. "Morning", "Afternoon", "Evening"
    priority: "high" | "normal" | "low";
    category: "Work" | "Personal" | "Student" | "Finance" | "Health";
    dueDate?: string; // ISO date string or just date string
    deadlineId?: string;
}

export interface Deadline {
    id: string;
    title: string;
    dueDate: string; // "YYYY-MM-DD" or similar
    daysLeft: number;
    priority: "high" | "normal" | "low";
    relatedTaskId?: string;
    completed: boolean;
}

export interface Decision {
    id: string;
    situation: string;
    options: {
        name: string;
        pros: string[];
        cons: string[];
        cost: string; // e.g. "Low", "Medium", "High"
        time: string; // e.g. "Quick", "Months", "Years"
        risks: string;
    }[];
    recommendedStep: string;
    createdAt: string;
}

export interface KnowledgeItem {
    id: string;
    title: string;
    content: string;
    category: "Notes" | "Important Information" | "Ideas" | "References" | "Saved Items";
    createdAt: string;
}

export interface PlannerSession {
    id: string;
    day: string; // "Monday", "Tuesday", etc.
    title: string;
    time: string; // e.g. "09:00 - 11:00"
    type: "work" | "study" | "personal" | "health";
}

interface AppContextType {
    tasks: Task[];
    deadlines: Deadline[];
    decisions: Decision[];
    knowledge: KnowledgeItem[];
    planner: PlannerSession[];
    userName: string;
    setUserName: (name: string) => void;
    addTask: (task: Omit<Task, "id">) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTask: (task: Task) => void;
    addDeadline: (deadline: Omit<Deadline, "id" | "daysLeft" | "completed">) => void;
    toggleDeadline: (id: string) => void;
    deleteDeadline: (id: string) => void;
    addDecision: (situation: string, options: Decision["options"], recommendedStep: string) => void;
    deleteDecision: (id: string) => void;
    addKnowledgeItem: (item: Omit<KnowledgeItem, "id" | "createdAt">) => void;
    deleteKnowledgeItem: (id: string) => void;
    updatePlannerSession: (session: PlannerSession) => void;
    addPlannerSession: (session: Omit<PlannerSession, "id">) => void;
    deletePlannerSession: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialTasks: Task[] = [
    { id: "1", title: "Prep for Q3 Project Review presentation", completed: false, time: "Morning", priority: "high", category: "Work", dueDate: "2026-08-08" },
    { id: "2", title: "Review design feedback on DailyDo landing page", completed: true, time: "Morning", priority: "high", category: "Work", dueDate: "2026-08-08" },
    { id: "3", title: "Read Chapter 4 of Economics textbook", completed: false, time: "Afternoon", priority: "normal", category: "Student", dueDate: "2026-08-08" },
    { id: "4", title: "Renew gym membership", completed: false, time: "Afternoon", priority: "normal", category: "Health", dueDate: "2026-08-08" },
    { id: "5", title: "Submit Statistics Homework", completed: false, time: "Evening", priority: "high", category: "Student", dueDate: "2026-08-10", deadlineId: "d1" },
    { id: "6", title: "Buy groceries: oats, organic berries, eggs, salmon", completed: false, time: "Evening", priority: "low", category: "Personal", dueDate: "2026-08-08" },
    { id: "7", title: "Plan upcoming summer flight itinerary", completed: true, time: "Evening", priority: "normal", category: "Personal", dueDate: "2026-08-07" },
];

const initialDeadlines: Deadline[] = [
    { id: "d1", title: "Statistics Term Assignment", dueDate: "2026-08-10", daysLeft: 2, priority: "high", relatedTaskId: "5", completed: false },
    { id: "d2", title: "Project Deliverable Alpha Launch", dueDate: "2026-08-13", daysLeft: 5, priority: "high", completed: false },
    { id: "d3", title: "Tax Declaration Filing 2025", dueDate: "2026-08-23", daysLeft: 15, priority: "normal", completed: false },
    { id: "d4", title: "Draft Proposal for Brand Refresh", dueDate: "2026-08-06", daysLeft: -2, priority: "normal", completed: true },
];

const initialDecisions: Decision[] = [
    {
        id: "dec1",
        situation: "Should I sign up for the Advanced Coding Bootcamp?",
        options: [
            {
                name: "Option A: Sign up ($2,500 cost)",
                pros: ["Structured curriculum", "Experienced mentors", "Hands-on projects", "Immediate networking"],
                cons: ["High initial cost", "Requires 15 hours/week from busy schedule", "Standardized pace"],
                cost: "High",
                time: "3 Months",
                risks: "Financial investment risk if not committed"
            },
            {
                name: "Option B: Self-guided learning via YouTube/Udemy",
                pros: ["Almost free ($20)", "Highly flexible timeline", "Can focus strictly on missing skills"],
                cons: ["No formal accountability", "No mentor to solve roadblocks", "Takes longer to structure curriculum"],
                cost: "Low",
                time: "6-9 Months",
                risks: "High risk of losing motivation or dropping out"
            }
        ],
        recommendedStep: "Try free self-guided learning strictly for 10 days. If you keep the pace of 2 hours daily, proceed with Self-guided. If you find yourself struggling with discipline, invest in the Bootcamp.",
        createdAt: "2026-08-07"
    }
];

const initialKnowledge: KnowledgeItem[] = [
    { id: "k1", title: "DailyDo Brand Specs", content: "Palette values:\nBackground: #080B12\nSurface: #111722\nPrimary blue: #2563EB\nGold accent: #D4A72C\nDo not overuse gold. Accentuate highlights, priorities, achievements.", category: "Notes", createdAt: "2026-08-08" },
    { id: "k2", title: "Growth Marketing Ideas", content: "1. Micro-tools for students (e.g. study planner generator)\n2. Referral discounts for visual themes\n3. Shareable planning widgets on Twitter", category: "Ideas", createdAt: "2026-08-06" },
    { id: "k3", title: "Keyboard Shortcuts Draft", content: "n: Quick add task\nd: Go to Dashboard\np: Open decisions explorer\n?: Toggle shortcuts cheat sheet", category: "References", createdAt: "2026-08-05" },
    { id: "k4", title: "Healthy Sleep Routine", content: "No screens 45 mins before bedtime. Maintain bedroom at 18 degrees Celsius. Read physical book to ease brain wave frequency.", category: "Saved Items", createdAt: "2026-08-04" }
];

const initialPlanner: PlannerSession[] = [
    { id: "p1", day: "Monday", title: "Deep Work: Project Review", time: "09:00 - 11:30", type: "work" },
    { id: "p2", day: "Monday", title: "Econ Lecture & Study", time: "14:00 - 16:00", type: "study" },
    { id: "p3", day: "Tuesday", title: "Design Sprint & Wireframes", time: "10:00 - 12:00", type: "work" },
    { id: "p4", day: "Wednesday", title: "Stats Lab Focus", time: "13:30 - 15:30", type: "study" },
    { id: "p5", day: "Thursday", title: "Gym & Conditioning", time: "17:00 - 18:30", type: "health" },
    { id: "p6", day: "Friday", title: "Weekly Retro & Organization", time: "15:00 - 16:00", type: "personal" },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
    const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge);
    const [planner, setPlanner] = useState<PlannerSession[]>(initialPlanner);
    const [userName, setUserName] = useState<string>("Julian");

    // Load state from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTasks = localStorage.getItem("dd_tasks");
            const storedDeadlines = localStorage.getItem("dd_deadlines");
            const storedDecisions = localStorage.getItem("dd_decisions");
            const storedKnowledge = localStorage.getItem("dd_knowledge");
            const storedPlanner = localStorage.getItem("dd_planner");
            const storedUser = localStorage.getItem("dd_username");

            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedDeadlines) setDeadlines(JSON.parse(storedDeadlines));
            if (storedDecisions) setDecisions(JSON.parse(storedDecisions));
            if (storedKnowledge) setKnowledge(JSON.parse(storedKnowledge));
            if (storedPlanner) setPlanner(JSON.parse(storedPlanner));
            if (storedUser) setUserName(storedUser);
        }
    }, []);

    // Sync state to localStorage when changed
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_tasks", JSON.stringify(tasks));
        }
    }, [tasks]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_deadlines", JSON.stringify(deadlines));
        }
    }, [deadlines]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_decisions", JSON.stringify(decisions));
        }
    }, [decisions]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_knowledge", JSON.stringify(knowledge));
        }
    }, [knowledge]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_planner", JSON.stringify(planner));
        }
    }, [planner]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("dd_username", userName);
        }
    }, [userName]);

    // Task methods
    const addTask = (taskData: Omit<Task, "id">) => {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setTasks((prev) => [newTask, ...prev]);

        // If task has a deadlineId, let's make sure that's kept in sync too
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
        const today = new Date("2026-08-08"); // Current date per system metadata
        const diffTime = rawDueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const newDeadline: Deadline = {
            ...deadlineData,
            id: "deadline" + Math.random().toString(36).substr(2, 9),
            daysLeft: diffDays,
            completed: false,
        };
        setDeadlines((prev) => [newDeadline, ...prev]);

        // Also auto-add a linked task if required
        if (deadlineData.relatedTaskId === "auto-create") {
            const relatedTaskId = "task" + Math.random().toString(36).substr(2, 9);
            const newTask: Task = {
                id: relatedTaskId,
                title: `Submit: ${deadlineData.title}`,
                completed: false,
                priority: deadlineData.priority,
                category: "Student", // Default category
                dueDate: deadlineData.dueDate,
                deadlineId: newDeadline.id,
            };
            setTasks((prev) => [newTask, ...prev]);

            // Update deadline to reference this new task
            newDeadline.relatedTaskId = relatedTaskId;
        }
    };

    const toggleDeadline = (id: string) => {
        setDeadlines((prev) =>
            prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
        );

        // Context synchronization: toggle related tasks as completed as well
        const deadline = deadlines.find((d) => d.id === id);
        if (deadline?.relatedTaskId) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === deadline.relatedTaskId ? { ...t, completed: !deadline.completed } : t
                )
            );
        }
    };

    const deleteDeadline = (id: string) => {
        setDeadlines((prev) => prev.filter((d) => d.id !== id));
    };

    // Decision methods
    const addDecision = (situation: string, options: Decision["options"], recommendedStep: string) => {
        const newDecision: Decision = {
            id: "dec" + Math.random().toString(36).substr(2, 9),
            situation,
            options,
            recommendedStep,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setDecisions((prev) => [newDecision, ...prev]);
    };

    const deleteDecision = (id: string) => {
        setDecisions((prev) => prev.filter((dec) => dec.id !== id));
    };

    // Knowledge methods
    const addKnowledgeItem = (itemData: Omit<KnowledgeItem, "id" | "createdAt">) => {
        const newItem: KnowledgeItem = {
            ...itemData,
            id: "k" + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split("T")[0],
        };
        setKnowledge((prev) => [newItem, ...prev]);
    };

    const deleteKnowledgeItem = (id: string) => {
        setKnowledge((prev) => prev.filter((item) => item.id !== id));
    };

    // Planner methods
    const addPlannerSession = (sessionData: Omit<PlannerSession, "id">) => {
        const newSession: PlannerSession = {
            ...sessionData,
            id: "p" + Math.random().toString(36).substr(2, 9),
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

    return (
        <AppContext.Provider
            value={{
                tasks,
                deadlines,
                decisions,
                knowledge,
                planner,
                userName,
                setUserName,
                addTask,
                toggleTask,
                deleteTask,
                updateTask,
                addDeadline,
                toggleDeadline,
                deleteDeadline,
                addDecision,
                deleteDecision,
                addKnowledgeItem,
                deleteKnowledgeItem,
                addPlannerSession,
                updatePlannerSession,
                deletePlannerSession,
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
