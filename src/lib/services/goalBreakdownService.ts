export interface BreakdownNode {
    tempId: string;
    parentTempId?: string;
    title: string;
    description: string;
    goalType: "yearly" | "quarterly" | "monthly" | "weekly" | "daily";
    period: string;
    measurableTarget?: string;
    lifeAreaId?: string;
    selected: boolean;
}

export interface BreakdownRoadmap {
    yearlyGoal: {
        title: string;
        description: string;
        lifeAreaId?: string;
        targetDate?: string;
    };
    nodes: BreakdownNode[];
}

export interface AIProviderConfig {
    apiKey?: string;
    model?: string;
}

/**
 * Generates a structured, realistic goal breakdown hierarchy.
 * Uses structured decomposition templates tailored to the goal's domain and intent,
 * with a clean interface for LLM/AI model integration.
 */
export function generateGoalBreakdown(
    title: string,
    description: string = "",
    lifeAreaName: string = "General",
    lifeAreaId?: string,
    targetYear: string = "2026"
): BreakdownRoadmap {
    const cleanTitle = title.trim();
    const isFinancial = /earn|revenue|income|\$|money|sales|profit|save|invest/i.test(cleanTitle);
    const isCareerOrDev = /developer|engineer|coder|tech|job|career|freelance|client|portfolio/i.test(cleanTitle);
    const isHealthOrFitness = /health|weight|fitness|run|marathon|gym|diet|muscle/i.test(cleanTitle);
    const isAcademic = /study|exam|thesis|degree|gpa|school|university|research/i.test(cleanTitle);
    const isBusiness = /business|startup|saas|product|launch|market|company/i.test(cleanTitle);

    const rootTempId = `root-${Date.now()}`;
    const nodes: BreakdownNode[] = [];

    // Root Yearly Goal
    nodes.push({
        tempId: rootTempId,
        title: cleanTitle,
        description: description || `Complete master objective: ${cleanTitle}`,
        goalType: "yearly",
        period: targetYear,
        lifeAreaId,
        selected: true,
    });

    // Quarterly Milestones
    let q1Title = "Establish Core Foundation & Research";
    let q2Title = "Build Core Assets & Initial Execution";
    let q3Title = "Launch, Acquire & Scale Momentum";
    let q4Title = "Consolidate Gains, Review & Hit Annual Target";

    if (isCareerOrDev) {
        q1Title = "Master Essential Tech Stack & Build Practice Modules";
        q2Title = "Develop & Deploy 2 Production-Grade Portfolio Projects";
        q3Title = "Outreach, Pitching & First Paid Client Engagements";
        q4Title = "Establish Consistent Workflow & Scale Retainers";
    } else if (isBusiness || isFinancial) {
        q1Title = "Validate Market Need, Setup Operations & Build MVP";
        q2Title = "Initial Product Beta, Feedback Iteration & Early Sales";
        q3Title = "Scale Marketing Funnels & Acquire First 100 Customers";
        q4Title = "Optimize Unit Economics & Surpass Annual Revenue Target";
    } else if (isHealthOrFitness) {
        q1Title = "Baseline Assessment, Habit Formation & Foundational Training";
        q2Title = "Progressive Overload & Strict Nutritional Consistency";
        q3Title = "Performance Peak & Milestone Endurance / Strength Test";
        q4Title = "Lock in Long-Term Lifestyle Habits & Target Metrics";
    } else if (isAcademic) {
        q1Title = "Complete Literature Review & Core Coursework Mastery";
        q2Title = "Primary Data Collection & Experimental Methodology";
        q3Title = "Draft Comprehensive Thesis / Research Chapters";
        q4Title = "Final Defense, Revisions & Academic Submission";
    }

    const q1Id = `q1-${Date.now()}`;
    const q2Id = `q2-${Date.now()}`;
    const q3Id = `q3-${Date.now()}`;
    const q4Id = `q4-${Date.now()}`;

    nodes.push(
        {
            tempId: q1Id,
            parentTempId: rootTempId,
            title: `Q1: ${q1Title}`,
            description: "Quarter 1 Milestone: Lay strong groundwork and essential systems.",
            goalType: "quarterly",
            period: `Q1 ${targetYear}`,
            lifeAreaId,
            selected: true,
        },
        {
            tempId: q2Id,
            parentTempId: rootTempId,
            title: `Q2: ${q2Title}`,
            description: "Quarter 2 Milestone: Concrete build phase and initial deliverables.",
            goalType: "quarterly",
            period: `Q2 ${targetYear}`,
            lifeAreaId,
            selected: true,
        },
        {
            tempId: q3Id,
            parentTempId: rootTempId,
            title: `Q3: ${q3Title}`,
            description: "Quarter 3 Milestone: Market launch and expanding operations.",
            goalType: "quarterly",
            period: `Q3 ${targetYear}`,
            lifeAreaId,
            selected: true,
        },
        {
            tempId: q4Id,
            parentTempId: rootTempId,
            title: `Q4: ${q4Title}`,
            description: "Quarter 4 Milestone: Final sprint and achievement validation.",
            goalType: "quarterly",
            period: `Q4 ${targetYear}`,
            lifeAreaId,
            selected: true,
        }
    );

    // Monthly breakdown for Q1
    const m1Id = `m1-${Date.now()}`;
    const m2Id = `m2-${Date.now()}`;
    const m3Id = `m3-${Date.now()}`;

    nodes.push(
        {
            tempId: m1Id,
            parentTempId: q1Id,
            title: "Month 1: Deep Dive Setup & Core Fundamentals",
            description: "Setup tooling, establish structured schedule and complete initial learning curve.",
            goalType: "monthly",
            period: `Month 1 (${targetYear})`,
            lifeAreaId,
            selected: true,
        },
        {
            tempId: m2Id,
            parentTempId: q1Id,
            title: "Month 2: First Prototype & Practical Implementation",
            description: "Build initial working artifacts and validate key concepts.",
            goalType: "monthly",
            period: `Month 2 (${targetYear})`,
            lifeAreaId,
            selected: true,
        },
        {
            tempId: m3Id,
            parentTempId: q1Id,
            title: "Month 3: Review, Refine & Q1 Milestone Checkpoint",
            description: "Synthesize outputs, measure progress and prepare for Q2 rollout.",
            goalType: "monthly",
            period: `Month 3 (${targetYear})`,
            lifeAreaId,
            selected: true,
        }
    );

    // Weekly breakdown for Month 1
    const w1Id = `w1-${Date.now()}`;
    const w2Id = `w2-${Date.now()}`;

    nodes.push(
        {
            tempId: w1Id,
            parentTempId: m1Id,
            title: "Week 1: Environmental Setup & Priority Roadmap",
            description: "Clarify daily calendar, configure required assets and remove blockers.",
            goalType: "weekly",
            period: "Week 1",
            lifeAreaId,
            selected: true,
        },
        {
            tempId: w2Id,
            parentTempId: m1Id,
            title: "Week 2: Focused Execution Sprint",
            description: "Complete first 10 core hours of dedicated deep work.",
            goalType: "weekly",
            period: "Week 2",
            lifeAreaId,
            selected: true,
        }
    );

    // Daily actions for Week 1
    nodes.push(
        {
            tempId: `d1-${Date.now()}`,
            parentTempId: w1Id,
            title: `Conduct 45-min research & define requirements for "${cleanTitle}"`,
            description: "Actionable first step to turn ambiguity into a clear checklist.",
            goalType: "daily",
            period: "Today",
            lifeAreaId,
            selected: true,
        },
        {
            tempId: `d2-${Date.now()}`,
            parentTempId: w1Id,
            title: "Block out 90 minutes in daily planner for uninterrupted focus",
            description: "Protect focused time on your calendar to maintain velocity.",
            goalType: "daily",
            period: "Tomorrow",
            lifeAreaId,
            selected: true,
        }
    );

    return {
        yearlyGoal: {
            title: cleanTitle,
            description: description || `Master goal: ${cleanTitle}`,
            lifeAreaId,
            targetDate: `${targetYear}-12-31`,
        },
        nodes,
    };
}

/**
 * Extension hook for calling AI services when configured.
 * Safely falls back to deterministic domain decomposition if no remote LLM is active.
 */
export async function requestAIGoalBreakdown(
    title: string,
    description: string,
    lifeAreaName: string,
    lifeAreaId?: string,
    targetYear: string = "2026",
    _aiConfig?: AIProviderConfig
): Promise<BreakdownRoadmap> {
    // When an AI backend route or API key is connected, this sends the structured prompt:
    // "Decompose yearly goal into 4 realistic quarterly milestones, 3 monthly goals, 2 weekly goals, and 2 daily actions."
    // For now, it returns the rich deterministic breakdown template.
    return Promise.resolve(
        generateGoalBreakdown(title, description, lifeAreaName, lifeAreaId, targetYear)
    );
}
