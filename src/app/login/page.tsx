"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft,
    Lock,
    Mail,
    ShieldAlert,
    CheckCircle2,
    KeyRound,
    RefreshCw,
    Sparkles,
} from "lucide-react";

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectedFrom = searchParams.get("redirectedFrom");
    const initialError = searchParams.get("error");

    const [authMode, setAuthMode] = useState<"password" | "otp">("password");

    // Password credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // OTP state
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Messages
    const [error, setError] = useState(initialError || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    // Resend countdown timer
    React.useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Password-based sign in
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                router.push(redirectedFrom || "/dashboard");
                router.refresh();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
            setLoading(false);
        }
    };

    // Send OTP Code
    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address to receive your one-time code.");
            return;
        }

        setLoading(true);

        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${origin}/auth/callback`,
                },
            });

            if (otpError) {
                setError(otpError.message);
                setLoading(false);
                return;
            }

            setOtpSent(true);
            setResendCooldown(60);
            setMessage("A 6-digit verification code has been sent to your email.");
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send code. Please try again.");
            setLoading(false);
        }
    };

    // Verify OTP Code
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const cleanToken = otpCode.trim();
        if (!cleanToken || cleanToken.length < 6) {
            setError("Please enter the complete 6-digit code sent to your email.");
            return;
        }

        setLoading(true);

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: cleanToken,
                type: "email",
            });

            if (verifyError) {
                setError(verifyError.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                router.push(redirectedFrom || "/dashboard");
                router.refresh();
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed. Please check the code.");
            setLoading(false);
        }
    };

    // Google OAuth
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectedFrom || "/dashboard")}`,
                },
            });

            if (oauthError) {
                setError(oauthError.message);
                setLoading(false);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Google sign in failed.");
            setLoading(false);
        }
    };

    // Reset password request
    const handleResetPassword = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Enter your email address above to receive a password reset link.");
            return;
        }

        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${origin}/auth/callback?next=/dashboard/settings`,
            });

            if (resetError) {
                setError(resetError.message);
            } else {
                setMessage("Password reset instructions sent to your email.");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send reset link.");
        }
    };

    return (
        <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {/* Top Logo / Title */}
            <div className="text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-105 transition-transform">
                        <span className="font-extrabold text-white text-base">L</span>
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-white">
                        Lifeweft<span className="text-brand-gold">.</span>
                    </span>
                </Link>
                <h1 className="text-lg font-bold text-white tracking-tight">Welcome back</h1>
                <p className="text-xs text-brand-muted">
                    Sign in to your personal life-management workspace.
                </p>
            </div>

            {/* Error / Feedback alerts */}
            {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
                    <ShieldAlert size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {message && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{message}</span>
                </div>
            )}

            {/* Google One-Click Login */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-brand-bg hover:bg-brand-border/40 border border-brand-border text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:border-brand-border/80 cursor-pointer disabled:opacity-50"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
                <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-brand-border/60" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">or continue with email</span>
                <div className="flex-1 h-px bg-brand-border/60" />
            </div>

            {/* Auth Mode Toggle: Password vs Email OTP */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-brand-bg rounded-xl border border-brand-border text-xs">
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode("password");
                        setOtpSent(false);
                        setError("");
                    }}
                    className={`py-2 rounded-lg font-semibold transition-all ${
                        authMode === "password"
                            ? "bg-brand-surface text-white shadow-sm border border-brand-border"
                            : "text-brand-muted hover:text-white"
                    }`}
                >
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode("otp");
                        setError("");
                    }}
                    className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        authMode === "otp"
                            ? "bg-brand-surface text-white shadow-sm border border-brand-border"
                            : "text-brand-muted hover:text-white"
                    }`}
                >
                    <KeyRound size={13} className="text-brand-gold" />
                    <span>Email Code (OTP)</span>
                </button>
            </div>

            {/* Mode A: Password Form */}
            {authMode === "password" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="text-[10px] text-brand-blue hover:underline font-semibold"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full py-3 text-xs font-bold uppercase tracking-wider justify-center shadow-lg shadow-brand-blue/20"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            )}

            {/* Mode B: Email OTP Form */}
            {authMode === "otp" && (
                <div className="space-y-4">
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:border-brand-blue outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-full py-3 text-xs font-bold uppercase tracking-wider justify-center shadow-lg shadow-brand-blue/20"
                            >
                                {loading ? "Sending Code..." : "Send 6-Digit Code"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Enter 6-Digit Code
                                    </label>
                                    <span className="text-[10px] text-brand-muted font-mono">{email}</span>
                                </div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                    required
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || otpCode.length < 6}
                                className="w-full py-3 text-xs font-bold uppercase tracking-wider justify-center shadow-lg shadow-brand-gold/20"
                            >
                                {loading ? "Verifying..." : "Verify Code & Sign In"}
                            </Button>

                            <div className="flex items-center justify-between pt-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="text-[11px] text-brand-muted hover:text-white"
                                >
                                    Change Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSendOtp()}
                                    disabled={resendCooldown > 0 || loading}
                                    className="text-[11px] text-brand-blue hover:underline font-semibold disabled:text-brand-muted disabled:no-underline flex items-center gap-1"
                                >
                                    <RefreshCw size={11} className={resendCooldown > 0 ? "animate-spin" : ""} />
                                    <span>
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Footer / Switch to Signup */}
            <div className="pt-2 border-t border-brand-border/40 text-center space-y-2">
                <p className="text-xs text-brand-muted">
                    Don&apos;t have an account yet?{" "}
                    <Link href="/signup" className="text-brand-blue font-bold hover:underline">
                        Create free account
                    </Link>
                </p>
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[11px] text-brand-muted hover:text-white transition-colors"
                    >
                        <ArrowLeft size={12} />
                        <span>Back to overview</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#080B12] text-brand-text flex items-center justify-center p-4 selection:bg-brand-blue/30 selection:text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <Suspense fallback={<div className="text-xs text-brand-muted">Loading authentication...</div>}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}
