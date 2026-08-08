"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { GitFork, Lightbulb, Scale, Sparkles, Check, Trash2, ArrowRight, CornerDownRight } from "lucide-react";

export default function DecisionsPage() {
    const { decisions, addDecision, deleteDecision } = useApp();

    const [situation, setSituation] = useState("");
    const [loading, setLoading] = useState(false);
    const [analyzedItem, setAnalyzedItem] = useState<typeof decisions[0] | null>(null);

    // Suggestions that users can click to pre-fill
    const SUGGESTIONS = [
        {
            label: "Should I buy this new laptop upgrade?",
            situation: "Should I buy the M4 MacBook Pro upgrade for $1,999?",
            options: [
                {
                    name: "Option A: Buy now",
                    pros: ["20% faster builds", "Stunning display", "Reliable battery life for remote work"],
                    cons: ["High cost", "Existing M1 laptop still functions fine", "Financial liquidity reduction"],
                    cost: "$1,999",
                    time: "Immediate upgrade",
                    risks: "Buyer's remorse if performance increase doesn't affect hourly rate"
                },
                {
                    name: "Option B: Wait 6 months",
                    pros: ["Save money for investments", "Price drops or discounts downstream"],
                    cons: ["Dealing with minor stuttering", "Missing out on potential efficiency yields"],
                    cost: "$0 (Deferred)",
                    time: "6 Months",
                    risks: "Slight velocity loss on work deliverables"
                }
            ],
            recommendedStep: "Run a system diagnostic check. If CPU bottleneck is costing you >1 hour of waiting time weekly, pull the trigger. Otherwise, wait until Black Friday discounts."
        },
        {
            label: "Rent vs Buy local townhouse?",
            situation: "Should I sign a 2-year lease or make a downpayment on a 2BC condo?",
            options: [
                {
                    name: "Option A: Sign lease (Rent)",
                    pros: ["High mobility", "Zero maintenance overheads", "Predictable monthly cash flow"],
                    cons: ["No equity growth", "Subject to rent hikes", "Decorating restrictions"],
                    cost: "Medium monthly cost",
                    time: "24-Month commitment",
                    risks: "Sunk capital on housing costs"
                },
                {
                    name: "Option B: Invest / buy condo",
                    pros: ["Real asset ownership", "Fixed-rate mortgage stability", "Tax write-offs potential"],
                    cons: ["Huge cash downpayment required", "HOA monthly fees", "Transaction costs to buy/sell"],
                    cost: "High upfront cost",
                    time: "10+ Years typical",
                    risks: "Interest rate fluctuations or property value drop"
                }
            ],
            recommendedStep: "Compare cap rates. If mortgage interest + HOA is significantly higher than equivalent rent, renting represents a safer bet. Rent and invest the downpayment difference."
        },
        {
            label: "Side project focus vs Freelance client work?",
            situation: "How should I allocate my 15 weekly side-hours?",
            options: [
                {
                    name: "Option A: Build SaaS Startup (DailyDo features)",
                    pros: ["Create passive income potential", "Full creative license", "Scale leverage"],
                    cons: ["Zero immediate income guarantee", "High likelihood of launch failure", "Hard to get users"],
                    cost: "$20/month base",
                    time: "6-12 Months to MVP",
                    risks: "Opportunity cost of lost wages"
                },
                {
                    name: "Option B: Freelance Client Retainers",
                    pros: ["Immediate predictable cash inflow ($80/hr)", "Build client references", "Definite return on effort"],
                    cons: ["Trading hours for dollars", "Clients own work rights", "Less scaling potential"],
                    cost: "$0",
                    time: "Weekly billing cycles",
                    risks: "Limits long-term wealth assets creation"
                }
            ],
            recommendedStep: "Run a hybrid allocation: 80% freelancing initially to secure a 3-month savings reserve. Once secure, transition to 50% freelancing and 50% SaaS incubation."
        }
    ];

    const handleSuggestionClick = (sugg: typeof SUGGESTIONS[0]) => {
        setSituation(sugg.situation);
        // Auto simulate analyzing
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Construct a mock item
            const mockResult = {
                id: "mock" + Math.random().toString(36).substr(2, 9),
                situation: sugg.situation,
                options: sugg.options,
                recommendedStep: sugg.recommendedStep,
                createdAt: new Date().toISOString().split("T")[0]
            };
            setAnalyzedItem(mockResult);
            // Also commit to global state
            addDecision(sugg.situation, sugg.options, sugg.recommendedStep);
        }, 900);
    };

    const handleCustomAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!situation.trim()) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const mockOptions = [
                {
                    name: "Option 1: Proceed with action",
                    pros: ["Gain experience", "Clear progress indicator", "Potential high upside"],
                    cons: ["Requires energy/resources", "Might disrupt current routine"],
                    cost: "Variable",
                    time: "Short-term",
                    risks: "Moderate adjustment curve"
                },
                {
                    name: "Option 2: Status quo (Do nothing)",
                    pros: ["Saves time and money", "Predictable stress levels", "High consistency"],
                    cons: ["Opportunity cost of inaction", "Potential regret downstream"],
                    cost: "Nil",
                    time: "None",
                    risks: "Stagnation"
                }
            ];
            const mockRecommendation = "Run a small 5-day script experiment. Test the assumptions with minimal energy to collect feedback before scaling the decision commitments.";

            const newItem = {
                id: "mock" + Math.random().toString(36).substr(2, 9),
                situation: situation.trim(),
                options: mockOptions,
                recommendedStep: mockRecommendation,
                createdAt: new Date().toISOString().split("T")[0]
            };

            setAnalyzedItem(newItem);
            addDecision(situation.trim(), mockOptions, mockRecommendation);
        }, 1200);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <GitFork className="text-brand-blue" />
                    Smart Decisions
                </h1>
                <p className="text-sm text-brand-muted mt-1 leading-none">
                    Give DailyDo the situation. We'll help you structure, compare, and recommend pathing options.
                </p>
            </div>

            {/* Main interactive grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left column: Decision Situation Input */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                            What are you trying to decide?
                        </h3>

                        <form onSubmit={handleCustomAnalyze} className="space-y-3.5">
                            <textarea
                                placeholder="e.g. Should I rent a space downtown or continue working from home?"
                                value={situation}
                                onChange={(e) => setSituation(e.target.value)}
                                rows={4}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg p-3 text-sm focus:border-brand-blue outline-none resize-none leading-relaxed"
                                required
                            />

                            <Button
                                type="submit"
                                variant="accent"
                                loading={loading}
                                className="w-full py-2.5 justify-center text-xs font-bold uppercase tracking-wider"
                            >
                                Assemble Analysis
                            </Button>
                        </form>
                    </div>

                    {/* Suggestions List */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Example Templates</p>
                        <div className="space-y-1.5">
                            {SUGGESTIONS.map((sugg, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(sugg)}
                                    className="w-full text-left p-3.5 bg-brand-surface hover:bg-brand-border/40 border border-brand-border rounded-lg text-xs text-brand-muted hover:text-white transition-all cursor-pointer font-medium leading-normal flex justify-between items-center group"
                                >
                                    <span className="truncate">{sugg.label}</span>
                                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 text-brand-blue" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column: Formatted Analysis preview result */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="bg-brand-surface/40 border border-brand-border rounded-xl p-12 text-center space-y-4 min-h-[400px] flex flex-col justify-center items-center">
                            <div className="relative h-12 w-12 rounded-full border-t-2 border-brand-blue animate-spin" />
                            <p className="text-xs text-brand-muted font-semibold tracking-wider uppercase animate-pulse">
                                Assembling Options, Weighting Cons & Risk Profiles...
                            </p>
                        </div>
                    ) : analyzedItem ? (
                        <div className="bg-brand-surface border border-brand-border rounded-xl p-6.5 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">

                            {/* Situation heading */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold px-2 py-0.5 rounded leading-none">
                                        Structured Analysis
                                    </span>
                                    <h2 className="text-base font-bold text-white leading-snug select-text">
                                        "{analyzedItem.situation}"
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setAnalyzedItem(null)}
                                    className="text-xs text-brand-muted hover:text-brand-text cursor-pointer"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Options mapping details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5 pt-1.5">
                                {analyzedItem.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="bg-brand-bg/60 border border-brand-border/60 rounded-lg p-4 space-y-3.5">
                                        <h4 className="font-bold text-xs text-white border-b border-brand-border/60 pb-1.5 uppercase tracking-wide">
                                            {opt.name}
                                        </h4>

                                        {/* Pros */}
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Pros</p>
                                            <ul className="space-y-1 pl-1">
                                                {opt.pros.map((pro, pIdx) => (
                                                    <li key={pIdx} className="text-xs text-brand-text flex items-start gap-1.5 leading-snug">
                                                        <span className="text-emerald-400 text-[10px] mt-0.5 flex-shrink-0">✓</span>
                                                        <span>{pro}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Cons */}
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Cons</p>
                                            <ul className="space-y-1 pl-1">
                                                {opt.cons.map((con, cIdx) => (
                                                    <li key={cIdx} className="text-xs text-brand-muted flex items-start gap-1.5 leading-snug">
                                                        <span className="text-rose-400 text-[10px] mt-0.5 flex-shrink-0">×</span>
                                                        <span>{con}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Parameters grid */}
                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-border/40 text-[10px]">
                                            <div>
                                                <span className="text-brand-muted block">Cost:</span>
                                                <span className="font-bold text-white">{opt.cost}</span>
                                            </div>
                                            <div>
                                                <span className="text-brand-muted block">Time:</span>
                                                <span className="font-bold text-white">{opt.time}</span>
                                            </div>
                                            <div>
                                                <span className="text-brand-muted block">Risk:</span>
                                                <span className="font-semibold text-brand-gold truncate block">{opt.risks}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recommended Direction */}
                            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg p-4 space-y-2">
                                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                    <Sparkles size={13} className="text-brand-gold" />
                                    Recommended Next Step
                                </h4>
                                <p className="text-xs text-brand-text leading-relaxed select-text pl-1.5 border-l border-brand-blue/40">
                                    {analyzedItem.recommendedStep}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-brand-surface/20 border border-brand-border border-dashed rounded-xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center space-y-3.5">
                            <div className="h-10 w-10 rounded-full border border-brand-border flex items-center justify-center text-brand-muted">
                                <Scale size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Analysis Workspace Ready</h3>
                                <p className="text-xs text-brand-muted mt-1 max-w-sm leading-relaxed">
                                    Submit your custom queries on the left panel or click a preloaded template card to mock test paths.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Past Decisions List */}
                    {decisions.length > 0 && (
                        <div className="space-y-3 pt-6 border-t border-brand-border/40">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                                Saved Analyses History ({decisions.length})
                            </h3>
                            <div className="space-y-2">
                                {decisions.map((dec) => (
                                    <div key={dec.id} className="bg-brand-surface border border-brand-border rounded-lg p-3.5 flex justify-between items-center group">
                                        <div className="min-w-0 pr-4">
                                            <p className="text-xs font-bold text-white truncate">"{dec.situation}"</p>
                                            <p className="text-[10px] text-brand-muted mt-1 leading-none">Simulated: {dec.createdAt}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setAnalyzedItem(dec)}
                                                className="text-[11px] text-brand-blue hover:underline cursor-pointer"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => deleteDecision(dec.id)}
                                                className="p-1 rounded text-brand-muted hover:text-red-400 cursor-pointer"
                                                title="Delete Decision Log"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
