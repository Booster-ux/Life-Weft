export interface BreakdownNode {
    tempId: string;
    parentTempId?: string;
    title: string;
    description: string;
    goalType: "yearly" | "quarterly" | "monthly" | "weekly" | "daily" | "custom";
    period: string;
    measurableTarget?: string;
    lifeAreaId?: string;
    selected: boolean;
}

export interface BreakdownPacing {
    isNumeric: boolean;
    totalAmount: number;
    unit: string;
    prefix: string;
    perQuarter: number;
    perMonth: number;
    perWeek: number;
    perDay: number;
    summary: string;
}

export interface BreakdownRoadmap {
    yearlyGoal: {
        title: string;
        description: string;
        lifeAreaId?: string;
        targetDate?: string;
    };
    pacing?: BreakdownPacing;
    nodes: BreakdownNode[];
}

export interface GoalPreset {
    id: string;
    category: "finance" | "health" | "career" | "learning" | "habits" | "other";
    label: string;
    defaultTitle: string;
    defaultDescription: string;
    icon: string;
    placeholder: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
    {
        id: "preset-finance",
        category: "finance",
        label: "Savings & Finance",
        defaultTitle: "Save 1,000,000 by end of year",
        defaultDescription: "Build a strong financial cushion through disciplined, automated daily and weekly contributions.",
        icon: "Coins",
        placeholder: "e.g. Save 1 million before Dec 31, Earn $50,000 revenue",
    },
    {
        id: "preset-health",
        category: "health",
        label: "Health & Fitness",
        defaultTitle: "Run 500 km and exercise 4 days per week",
        defaultDescription: "Establish progressive stamina, metabolic health, and physical resilience.",
        icon: "Activity",
        placeholder: "e.g. Run 500 km this year, Lose 10 kg, Workout 150 sessions",
    },
    {
        id: "preset-career",
        category: "career",
        label: "Career & Business",
        defaultTitle: "Launch MVP product and acquire 100 paid users",
        defaultDescription: "Ship a reliable production version, validate product-market fit, and scale operations.",
        icon: "Briefcase",
        placeholder: "e.g. Launch SaaS MVP, Get promoted to Tech Lead, Sign 10 enterprise clients",
    },
    {
        id: "preset-learning",
        category: "learning",
        label: "Learning & Reading",
        defaultTitle: "Read 24 books and complete advanced certification",
        defaultDescription: "Invest 30 minutes daily into high-leverage intellectual development.",
        icon: "BookOpen",
        placeholder: "e.g. Read 24 non-fiction books, Master System Design, Pass AWS exam",
    },
    {
        id: "preset-habits",
        category: "habits",
        label: "Habits & Routine",
        defaultTitle: "Maintain daily 90-minute deep work block",
        defaultDescription: "Protect morning focus hours and build consistent execution habits.",
        icon: "Sparkles",
        placeholder: "e.g. Daily morning workout, 10,000 steps daily, Zero doom-scrolling",
    },
    {
        id: "preset-other",
        category: "other",
        label: "Other / Custom",
        defaultTitle: "",
        defaultDescription: "",
        icon: "Target",
        placeholder: "e.g. Renovate home office, Organize personal archive, Travel to 3 new countries",
    },
];

/**
 * Smart parsing helper: Extracts numeric target and currency/unit from goal text.
 */
export function extractGoalPacing(text: string): BreakdownPacing | null {
    const clean = text.toLowerCase();

    // Check for currency symbols or words
    let prefix = "";
    if (clean.includes("₦") || clean.includes("naira")) prefix = "₦";
    else if (clean.includes("$") || clean.includes("dollar") || clean.includes("usd")) prefix = "$";
    else if (clean.includes("€") || clean.includes("euro")) prefix = "€";
    else if (clean.includes("£") || clean.includes("pound")) prefix = "£";

    let unit = "";
    if (prefix) {
        unit = "";
    } else if (clean.includes("book")) unit = "books";
    else if (clean.includes("km") || clean.includes("kilometer")) unit = "km";
    else if (clean.includes("mile")) unit = "miles";
    else if (clean.includes("kg") || clean.includes("kilo")) unit = "kg";
    else if (clean.includes("lb") || clean.includes("pound")) unit = "lbs";
    else if (clean.includes("user") || clean.includes("customer")) unit = "users";
    else if (clean.includes("hour")) unit = "hours";
    else if (clean.includes("article") || clean.includes("post")) unit = "articles";

    // Match numbers like "1 million", "1.5m", "500k", "1,000,000", "50000"
    let amount = 0;

    const millionMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:million|m)\b/i);
    const kMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k)\b/i);
    const commaNumMatch = clean.match(/(?:[₦$€£]\s*)?(\d{1,3}(?:,\d{3})+|\d+)/i);

    if (millionMatch) {
        amount = parseFloat(millionMatch[1]) * 1000000;
    } else if (kMatch) {
        amount = parseFloat(kMatch[1]) * 1000;
    } else if (commaNumMatch) {
        const raw = commaNumMatch[1].replace(/,/g, "");
        amount = parseFloat(raw);
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        return null;
    }

    const perQuarter = Math.round(amount / 4);
    const perMonth = Math.round(amount / 12);
    const perWeek = Math.round(amount / 52);
    const perDay = Math.round(amount / 365);

    const fmt = (n: number) => `${prefix}${n.toLocaleString()}${unit ? ` ${unit}` : ""}`;

    return {
        isNumeric: true,
        totalAmount: amount,
        unit,
        prefix,
        perQuarter,
        perMonth,
        perWeek,
        perDay,
        summary: `Pacing: ${fmt(perQuarter)}/quarter • ${fmt(perMonth)}/month • ${fmt(perWeek)}/week • ${fmt(perDay)}/day`,
    };
}

/**
 * Generates an actionable, structured goal breakdown hierarchy.
 * Calculates exact daily, weekly, monthly, and quarterly required actions.
 */
export function generateGoalBreakdown(
    title: string,
    description: string = "",
    lifeAreaName: string = "General",
    lifeAreaId?: string,
    targetYear: string = "2026"
): BreakdownRoadmap {
    const cleanTitle = title.trim();
    const pacing = extractGoalPacing(cleanTitle) || extractGoalPacing(description);

    const isFinancial = /save|saving|earn|revenue|income|money|sales|profit|invest|\$|₦|€|£/i.test(cleanTitle);
    const isHealthOrFitness = /health|weight|fitness|run|marathon|gym|diet|workout|exercise|kg|lbs|km/i.test(cleanTitle);
    const isLearningOrBooks = /read|book|study|exam|thesis|degree|learn|course|certification/i.test(cleanTitle);
    const isCareerOrDev = /developer|engineer|coder|tech|job|career|freelance|client|portfolio|promotion/i.test(cleanTitle);

    const rootTempId = `root-${Date.now()}`;
    const nodes: BreakdownNode[] = [];

    // Root Yearly Goal
    nodes.push({
        tempId: rootTempId,
        title: cleanTitle,
        description: description || (pacing ? pacing.summary : `Complete master objective: ${cleanTitle}`),
        goalType: "yearly",
        period: targetYear,
        measurableTarget: pacing ? `${pacing.prefix}${pacing.totalAmount.toLocaleString()} ${pacing.unit}`.trim() : undefined,
        lifeAreaId,
        selected: true,
    });

    const fmt = (n: number) => pacing ? `${pacing.prefix}${n.toLocaleString()}${pacing.unit ? ` ${pacing.unit}` : ""}` : `${n}`;

    const q1Id = `q1-${Date.now()}`;
    const q2Id = `q2-${Date.now()}`;
    const q3Id = `q3-${Date.now()}`;
    const q4Id = `q4-${Date.now()}`;

    if (pacing) {
        // Numeric / Paced Breakdown (e.g. Save 1 million)
        const q1Target = pacing.perQuarter;
        const q2Target = pacing.perQuarter * 2;
        const q3Target = pacing.perQuarter * 3;
        const q4Target = pacing.totalAmount;

        nodes.push(
            {
                tempId: q1Id,
                parentTempId: rootTempId,
                title: `Q1 Milestone: Reach 25% Target (${fmt(q1Target)})`,
                description: `Pace: ${fmt(pacing.perMonth)}/month. Establish direct auto-transfers and discipline.`,
                goalType: "quarterly",
                period: `Q1 ${targetYear}`,
                measurableTarget: fmt(q1Target),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: q2Id,
                parentTempId: rootTempId,
                title: `Q2 Milestone: Reach 50% Mid-Year Target (${fmt(q2Target)})`,
                description: `Pace: Maintain ${fmt(pacing.perMonth)}/month pace to reach ${fmt(q2Target)} cumulative.`,
                goalType: "quarterly",
                period: `Q2 ${targetYear}`,
                measurableTarget: fmt(q2Target),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: q3Id,
                parentTempId: rootTempId,
                title: `Q3 Milestone: Reach 75% Velocity Checkpoint (${fmt(q3Target)})`,
                description: `Pace: Protect gains and accelerate progress to hit ${fmt(q3Target)}.`,
                goalType: "quarterly",
                period: `Q3 ${targetYear}`,
                measurableTarget: fmt(q3Target),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: q4Id,
                parentTempId: rootTempId,
                title: `Q4 Milestone: Final 100% Achievement (${fmt(q4Target)})`,
                description: `Final sprint: Complete target of ${fmt(q4Target)} and review annual accomplishments.`,
                goalType: "quarterly",
                period: `Q4 ${targetYear}`,
                measurableTarget: fmt(q4Target),
                lifeAreaId,
                selected: true,
            }
        );

        // Monthly Breakdown for Q1
        const m1Id = `m1-${Date.now()}`;
        const m2Id = `m2-${Date.now()}`;
        const m3Id = `m3-${Date.now()}`;

        nodes.push(
            {
                tempId: m1Id,
                parentTempId: q1Id,
                title: `Month 1 Target: Accumulate ${fmt(pacing.perMonth)}`,
                description: `Target rate: ${fmt(pacing.perWeek)} per week (${fmt(pacing.perDay)} daily contribution).`,
                goalType: "monthly",
                period: `Month 1 (${targetYear})`,
                measurableTarget: fmt(pacing.perMonth),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: m2Id,
                parentTempId: q1Id,
                title: `Month 2 Target: Accumulate ${fmt(pacing.perMonth)} (Total: ${fmt(pacing.perMonth * 2)})`,
                description: `Maintain disciplined weekly pacing of ${fmt(pacing.perWeek)}.`,
                goalType: "monthly",
                period: `Month 2 (${targetYear})`,
                measurableTarget: fmt(pacing.perMonth * 2),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: m3Id,
                parentTempId: q1Id,
                title: `Month 3 Target: Complete Q1 Benchmark (${fmt(q1Target)})`,
                description: `Audit progress and finalize first full quarter milestone.`,
                goalType: "monthly",
                period: `Month 3 (${targetYear})`,
                measurableTarget: fmt(q1Target),
                lifeAreaId,
                selected: true,
            }
        );

        // Weekly Breakdown for Month 1
        const w1Id = `w1-${Date.now()}`;
        const w2Id = `w2-${Date.now()}`;

        nodes.push(
            {
                tempId: w1Id,
                parentTempId: m1Id,
                title: `Week 1: Set aside ${fmt(pacing.perWeek)} (${fmt(pacing.perDay)}/day)`,
                description: `Execute daily installments and log each contribution in your ledger.`,
                goalType: "weekly",
                period: "Week 1",
                measurableTarget: fmt(pacing.perWeek),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: w2Id,
                parentTempId: m1Id,
                title: `Week 2: Maintain ${fmt(pacing.perWeek)} pace`,
                description: `Ensure zero missed daily contributions of ${fmt(pacing.perDay)}.`,
                goalType: "weekly",
                period: "Week 2",
                measurableTarget: fmt(pacing.perWeek),
                lifeAreaId,
                selected: true,
            }
        );

        // Daily Actions for Week 1
        nodes.push(
            {
                tempId: `d1-${Date.now()}`,
                parentTempId: w1Id,
                title: `Execute today's ${fmt(pacing.perDay)} daily contribution installment`,
                description: `Automate or manually record today's target rate of ${fmt(pacing.perDay)}.`,
                goalType: "daily",
                period: "Today",
                measurableTarget: fmt(pacing.perDay),
                lifeAreaId,
                selected: true,
            },
            {
                tempId: `d2-${Date.now()}`,
                parentTempId: w1Id,
                title: `Log ${fmt(pacing.perDay)} transaction into Personal Ledger`,
                description: "Keep a transparent chronological log of every step toward your target.",
                goalType: "daily",
                period: "Tomorrow",
                lifeAreaId,
                selected: true,
            }
        );
    } else {
        // Structured Qualitative / Project Roadmap
        let q1Title = "Establish Core Foundation & Research";
        let q2Title = "Build Core Assets & Initial Execution";
        let q3Title = "Launch, Acquire & Scale Momentum";
        let q4Title = "Consolidate Gains & Complete Target";

        if (isCareerOrDev) {
            q1Title = "Master Essential Tech Stack & Build Modules";
            q2Title = "Deploy Production Portfolio Projects";
            q3Title = "Outreach, Pitching & Client Engagements";
            q4Title = "Establish Consistent Workflow & Scale";
        } else if (isHealthOrFitness) {
            q1Title = "Baseline Assessment & Consistent Routine";
            q2Title = "Progressive Overload & Clean Nutrition";
            q3Title = "Peak Performance & Endurance Benchmark";
            q4Title = "Lock in Long-term Healthy Lifestyle";
        } else if (isLearningOrBooks) {
            q1Title = "Initial 6-Book Sprint & Foundation Notes";
            q2Title = "Mid-Year Progress (12 Books / 50% Milestone)";
            q3Title = "Advanced Topics & Deep Dive Reading";
            q4Title = "Complete 24 Books & Synthesis Essay";
        }

        nodes.push(
            {
                tempId: q1Id,
                parentTempId: rootTempId,
                title: `Q1: ${q1Title}`,
                description: "Quarter 1 Milestone: Lay strong groundwork and essential habits.",
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
                description: "Quarter 3 Milestone: Expand velocity and validate outputs.",
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

        const m1Id = `m1-${Date.now()}`;
        const m2Id = `m2-${Date.now()}`;
        const m3Id = `m3-${Date.now()}`;

        nodes.push(
            {
                tempId: m1Id,
                parentTempId: q1Id,
                title: "Month 1: Tooling Setup & Foundational Sprint",
                description: "Set daily schedule, remove distractions, and complete initial phase.",
                goalType: "monthly",
                period: `Month 1 (${targetYear})`,
                lifeAreaId,
                selected: true,
            },
            {
                tempId: m2Id,
                parentTempId: q1Id,
                title: "Month 2: Practical Implementation & Iteration",
                description: "Produce concrete working results and measure weekly output.",
                goalType: "monthly",
                period: `Month 2 (${targetYear})`,
                lifeAreaId,
                selected: true,
            },
            {
                tempId: m3Id,
                parentTempId: q1Id,
                title: "Month 3: Review, Refine & Q1 Checkpoint",
                description: "Synthesize outputs and prepare for Q2 rollout.",
                goalType: "monthly",
                period: `Month 3 (${targetYear})`,
                lifeAreaId,
                selected: true,
            }
        );

        const w1Id = `w1-${Date.now()}`;
        const w2Id = `w2-${Date.now()}`;

        nodes.push(
            {
                tempId: w1Id,
                parentTempId: m1Id,
                title: "Week 1: Setup Workspace & Clarify Priority Roadmap",
                description: "Organize calendar blocks and eliminate friction.",
                goalType: "weekly",
                period: "Week 1",
                lifeAreaId,
                selected: true,
            },
            {
                tempId: w2Id,
                parentTempId: m1Id,
                title: "Week 2: Complete 10 Core Focus Hours",
                description: "Execute structured deep work blocks without multitasking.",
                goalType: "weekly",
                period: "Week 2",
                lifeAreaId,
                selected: true,
            }
        );

        nodes.push(
            {
                tempId: `d1-${Date.now()}`,
                parentTempId: w1Id,
                title: `Conduct 45-min focused session on "${cleanTitle}"`,
                description: "Take the first concrete step to build momentum.",
                goalType: "daily",
                period: "Today",
                lifeAreaId,
                selected: true,
            },
            {
                tempId: `d2-${Date.now()}`,
                parentTempId: w1Id,
                title: "Schedule 90-min uninterrupted deep work block in Planner",
                description: "Protect focused time on your calendar to maintain velocity.",
                goalType: "daily",
                period: "Tomorrow",
                lifeAreaId,
                selected: true,
            }
        );
    }

    return {
        yearlyGoal: {
            title: cleanTitle,
            description: description || (pacing ? pacing.summary : `Master goal: ${cleanTitle}`),
            lifeAreaId,
            targetDate: `${targetYear}-12-31`,
        },
        pacing: pacing || undefined,
        nodes,
    };
}
