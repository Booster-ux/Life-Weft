"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp, AskLifeweftAnswer } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import {
    Sparkles,
    Send,
    Bot,
    User,
    CheckSquare,
    Timer,
    BookOpen,
    GitFork,
    Library,
    Calendar,
    ArrowRight,
    RotateCcw,
    Lightbulb,
    Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
    id: string;
    sender: "user" | "assistant";
    text: string;
    answer?: AskLifeweftAnswer;
    timestamp: string;
}

const SUGGESTED_PROMPTS = [
    "What do I need to do today?",
    "What are my important deadlines this week?",
    "What did I decide about my architecture/stack?",
    "What happened in my business and client projects recently?",
    "What did I learn and save in knowledge notes?",
    "Summarize my week across all life areas.",
    "What should I prioritize today?",
];

export default function AskLifeweftPage() {
    const { queryLifeweft, userName } = useApp();

    const [inputQuery, setInputQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "msg-welcome",
            sender: "assistant",
            text: `Hello ${userName}. I am your Lifeweft intelligence workspace layer. You can ask me anything about your tasks, personal ledger timeline, deadlines, past decisions, or knowledge notes.`,
            timestamp: "Just now",
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (queryToSend?: string) => {
        const query = (queryToSend || inputQuery).trim();
        if (!query || isLoading) return;

        const userMessageId = "msg-" + Math.random().toString(36).substr(2, 9);
        const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Add user message
        const newMessages: ChatMessage[] = [
            ...messages,
            {
                id: userMessageId,
                sender: "user",
                text: query,
                timestamp: timeNow,
            },
        ];
        setMessages(newMessages);
        setInputQuery("");
        setIsLoading(true);

        try {
            // Query workspace knowledge layer
            const answer = await queryLifeweft(query);

            setMessages((prev) => [
                ...prev,
                {
                    id: answer.id,
                    sender: "assistant",
                    text: answer.summary,
                    answer,
                    timestamp: answer.timestamp,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: "msg-err-" + Date.now(),
                    sender: "assistant",
                    text: "An error occurred while searching your workspace records. Please try asking again.",
                    timestamp: timeNow,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: "msg-welcome-new",
                sender: "assistant",
                text: `Conversation cleared. What would you like to explore across your Lifeweft data, ${userName}?`,
                timestamp: "Just now",
            },
        ]);
    };

    const getIconForType = (type: AskLifeweftAnswer["relatedItems"][0]["type"]) => {
        switch (type) {
            case "task":
                return <CheckSquare size={13} className="text-brand-blue" />;
            case "deadline":
                return <Timer size={13} className="text-rose-400" />;
            case "ledger":
                return <BookOpen size={13} className="text-brand-gold" />;
            case "decision":
                return <GitFork size={13} className="text-indigo-400" />;
            case "knowledge":
                return <Library size={13} className="text-teal-400" />;
            default:
                return <Calendar size={13} className="text-brand-muted" />;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-110px)] max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                        <Sparkles size={18} className="text-brand-gold" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none flex items-center gap-2">
                            Ask Lifeweft
                            <span className="text-[10px] uppercase tracking-wider bg-brand-blue/10 border border-brand-blue/30 text-brand-blue px-2 py-0.5 rounded font-mono font-bold">
                                Personal Intelligence Layer
                            </span>
                        </h1>
                        <p className="text-xs text-brand-muted mt-1 leading-none">
                            Context-aware query engine over your tasks, ledger, deadlines, decisions & knowledge.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleClearChat}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-brand-muted hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Clear Chat</span>
                </Button>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {messages.map((msg) => {
                    const isAssistant = msg.sender === "assistant";
                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3 max-w-3xl",
                                isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                            )}
                        >
                            {/* Avatar */}
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md",
                                    isAssistant
                                        ? "bg-brand-surface border border-brand-gold/40 text-brand-gold"
                                        : "bg-brand-blue text-white"
                                )}
                            >
                                {isAssistant ? <Sparkles size={15} /> : <User size={15} />}
                            </div>

                            {/* Message Bubble Container */}
                            <div
                                className={cn(
                                    "rounded-2xl p-4 space-y-2.5 text-xs leading-relaxed max-w-[85%] sm:max-w-[75%]",
                                    isAssistant
                                        ? "bg-brand-surface border border-brand-border text-brand-text shadow-sm"
                                        : "bg-brand-blue text-white font-medium"
                                )}
                            >
                                <p className="select-text whitespace-pre-wrap">{msg.text}</p>

                                {/* Structured Related Items Returned from Active Data */}
                                {msg.answer?.relatedItems && msg.answer.relatedItems.length > 0 && (
                                    <div className="pt-2 border-t border-brand-border/40 space-y-1.5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
                                            <Lightbulb size={11} className="text-brand-gold" />
                                            Referenced Lifeweft Data Records:
                                        </p>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {msg.answer.relatedItems.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2 p-2 rounded-lg bg-brand-bg/60 border border-brand-border/60 text-[11px]"
                                                >
                                                    <span className="mt-0.5 flex-shrink-0">{getIconForType(item.type)}</span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-brand-text truncate">{item.title}</p>
                                                        {item.detail && (
                                                            <p className="text-[10px] text-brand-muted truncate">{item.detail}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Intelligence Insights */}
                                {msg.answer?.insights && msg.answer.insights.length > 0 && (
                                    <div className="pt-1.5">
                                        {msg.answer.insights.map((insight, iIdx) => (
                                            <p key={iIdx} className="text-[10px] text-brand-gold italic bg-brand-gold/5 p-1.5 rounded border border-brand-gold/20">
                                                💡 {insight}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <div className="text-[9px] text-brand-muted/70 text-right font-mono">
                                    {msg.timestamp}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading State Spinner */}
                {isLoading && (
                    <div className="flex gap-3 mr-auto max-w-md items-center">
                        <div className="h-8 w-8 rounded-full bg-brand-surface border border-brand-gold/40 text-brand-gold flex items-center justify-center shadow-md">
                            <Sparkles size={15} className="animate-spin" />
                        </div>
                        <div className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 text-xs text-brand-muted flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-brand-gold animate-ping" />
                            <span>Synthesizing records across your Lifeweft data...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Chips (Empty or Context exploration) */}
            <div className="pt-1">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-brand-gold" />
                    Suggested Inquiries:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            disabled={isLoading}
                            className="text-[11px] bg-brand-surface hover:bg-brand-border/60 text-brand-muted hover:text-brand-text px-3 py-1.5 rounded-lg border border-brand-border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <span>{prompt}</span>
                            <ArrowRight size={11} className="opacity-60" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Submission Bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className="relative bg-brand-surface border border-brand-border rounded-xl p-2 flex items-center gap-2 shadow-lg focus-within:border-brand-blue transition-colors"
            >
                <input
                    type="text"
                    placeholder="Ask Lifeweft anything about your tasks, ledger, deadlines, decisions, or notes..."
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-brand-text placeholder:text-brand-muted/60 text-xs sm:text-sm px-3 py-2 outline-none border-none"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isLoading}
                    disabled={!inputQuery.trim() || isLoading}
                    className="px-4 py-2 font-bold uppercase text-[11px] flex items-center gap-1.5 flex-shrink-0"
                >
                    <span>Ask</span>
                    <Send size={12} />
                </Button>
            </form>

            {/* Privacy Architecture Notice */}
            <div className="text-[10px] text-brand-muted text-center flex items-center justify-center gap-1.5 select-none opacity-80">
                <Shield size={11} className="text-emerald-400" />
                <span>Privacy-First Architecture • Ready for Supabase Row-Level-Security (RLS) & Private AI integration</span>
            </div>
        </div>
    );
}
