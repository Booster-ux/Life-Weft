"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";
import { checkAndNotifyNewDevice } from "@/lib/utils/deviceSecurity";
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft,
    Lock,
    Mail,
    User,
    ShieldAlert,
    CheckCircle2,
    KeyRound,
    RefreshCw,
    LogIn,
    Sparkles,
} from "lucide-react";

function SignupFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";

    // Form inputs (Email + Password + Confirm Password)
    const [name, setName] = useState("");
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Verification Step (6-digit OTP code)
    const [otpStep, setOtpStep] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Feedback states
    const [error, setError] = useState("");
    const [existingAccount, setExistingAccount] = useState(false);
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

    // Step 1: Submit Email + Password + Confirm Password -> Triggers Email Verification Code
    const handleInitialSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setExistingAccount(false);

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (cleanPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (cleanPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Register account with Supabase Auth (dispatches 6-digit verification code)
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPassword,
                options: {
                    data: {
                        full_name: name.trim() || undefined,
                    },
                },
            });

            if (signUpError) {
                const errMsg = signUpError.message.toLowerCase();
                if (
                    errMsg.includes("already registered") ||
                    errMsg.includes("already exists") ||
                    errMsg.includes("user already")
                ) {
                    setExistingAccount(true);
                    setError("An account with this email already exists.");
                } else if (errMsg.includes("rate limit") || errMsg.includes("too many requests")) {
                    setError("Too many signup requests. Please wait a moment before trying again.");
                } else {
                    setError(signUpError.message);
                }
                setLoading(false);
                return;
            }

            // Move to Step 2: 6-digit OTP verification screen
            setOtpStep(true);
            setResendCooldown(60);
            setMessage("A 6-digit verification code has been sent to your email. Enter it below to complete signup.");
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to initiate signup. Please try again.");
            setLoading(false);
        }
    };

    // Step 2: Verify the 6-Digit Email Code -> Completes Verification & Creates Authenticated Session
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const cleanToken = otpCode.trim();
        if (!cleanToken || cleanToken.length < 6) {
            setError("Enter the 6-digit code sent to your email.");
            return;
        }

        setLoading(true);

        try {
            // 1. First attempt verification with signup OTP type
            let verifyResult = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: cleanToken,
                type: "signup",
            });

            // 2. Fallback attempt for standard email OTP type
            if (verifyResult.error) {
                verifyResult = await supabase.auth.verifyOtp({
                    email: email.trim(),
                    token: cleanToken,
                    type: "email",
                });
            }

            if (verifyResult.error) {
                const errMsg = verifyResult.error.message.toLowerCase();
                if (errMsg.includes("expired")) {
                    setError("That code has expired. Request a new code.");
                } else if (errMsg.includes("invalid") || errMsg.includes("incorrect") || errMsg.includes("token")) {
                    setError("That code is incorrect.");
                } else {
                    setError(verifyResult.error.message);
                }
                setLoading(false);
                return;
            }

            if (verifyResult.data.session) {
                checkAndNotifyNewDevice(verifyResult.data.session.user.id);
            }

            setMessage("Code verified! Directing to your workspace...");
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
            setLoading(false);
        }
    };

    // Resend 6-Digit Verification Code
    const handleResendCode = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email: email.trim(),
            });

            if (resendError) {
                // Fallback attempt with signInWithOtp
                const { error: otpFallbackError } = await supabase.auth.signInWithOtp({
                    email: email.trim(),
                    options: { shouldCreateUser: false },
                });

                if (otpFallbackError) {
                    setError(otpFallbackError.message);
                    setLoading(false);
                    return;
                }
            }

            setResendCooldown(60);
            setMessage("A new 6-digit verification code has been sent to your email.");
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to resend code. Please try again.");
            setLoading(false);
        }
    };

    // Google OAuth Handler
    const handleGoogleSignup = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const siteUrl = getSiteUrl();
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
                },
            });

            if (oauthError) {
                if (
                    oauthError.message.includes("provider is not enabled") ||
                    oauthError.message.includes("Unsupported provider")
                ) {
                    setError("Google sign-in is currently pending activation in your Supabase dashboard. Please sign up with email and password.");
                } else {
                    setError(oauthError.message);
                }
                setLoading(false);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to initialize Google signup.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-white transition-colors mb-6 ml-2 sm:ml-0"
                >
                    <ArrowLeft size={14} />
                    Back to Home
                </Link>

                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-border border border-brand-blue/30 shadow-lg shadow-brand-blue/10 mb-4">
                        <Sparkles size={22} className="text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Create Your Workspace
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-brand-muted">
                        Join Lifeweft for free. Enter your details to receive your verification code.
                    </p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xl">
                    {/* Error and Alert Messages */}
                    {error && (
                        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-2.5 text-rose-300 text-xs">
                            <ShieldAlert size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold leading-relaxed">{error}</p>
                                {existingAccount && (
                                    <div className="mt-2.5">
                                        <Link
                                            href={`/login?email=${encodeURIComponent(email)}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <LogIn size={13} />
                                            Log in instead
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-2.5 text-emerald-300 text-xs">
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="font-semibold leading-relaxed">{message}</p>
                        </div>
                    )}

                    {otpStep ? (
                        /* Step 2: 6-Digit Email Code Verification Screen */
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="p-4 bg-brand-bg border border-brand-border rounded-xl space-y-1">
                                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <KeyRound size={14} className="text-brand-gold" />
                                    Enter 6-Digit Verification Code
                                </p>
                                <p className="text-[11px] text-brand-muted">
                                    Sent to <span className="text-white font-mono">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                    required
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-mono font-bold focus:border-brand-blue outline-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || otpCode.length < 6}
                                className="w-full font-bold uppercase tracking-wider py-2.5"
                            >
                                {loading ? "Verifying..." : "Verify & Complete Signup"}
                            </Button>

                            <div className="flex items-center justify-between text-xs pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpStep(false);
                                        setOtpCode("");
                                        setError("");
                                    }}
                                    className="text-brand-muted hover:text-white"
                                >
                                    Change Email / Details
                                </button>

                                <button
                                    type="button"
                                    disabled={resendCooldown > 0 || loading}
                                    onClick={handleResendCode}
                                    className="text-brand-blue hover:underline disabled:opacity-50 disabled:no-underline font-semibold flex items-center gap-1"
                                >
                                    <RefreshCw size={11} className={resendCooldown > 0 ? "animate-spin" : ""} />
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Step 1: Standard Signup Form (Email + Password + Confirm Password) */
                        <div className="space-y-5">
                            <form onSubmit={handleInitialSignup} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Full Name (Optional)
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                        <input
                                            type="text"
                                            placeholder="Julian Vance"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs focus:border-brand-blue outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs focus:border-brand-blue outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                            <input
                                                type="password"
                                                placeholder="Min. 6 chars"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs focus:border-brand-blue outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                            Confirm Password *
                                        </label>
                                        <div className="relative">
                                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                            <input
                                                type="password"
                                                placeholder="Re-enter password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs focus:border-brand-blue outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                    className="w-full font-bold uppercase tracking-wider py-2.5 mt-2"
                                >
                                    {loading ? "Sending Code..." : "Sign Up"}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-brand-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-brand-surface px-2 text-brand-muted font-mono text-[10px]">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign In */}
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-brand-bg hover:bg-brand-border/40 border border-brand-border rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                                Continue with Google
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-brand-muted mt-6">
                    Already have an account?{" "}
                    <Link
                        href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
                        className="text-brand-blue hover:underline font-semibold"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-muted text-xs">Loading...</div>}>
            <SignupFormContent />
        </Suspense>
    );
}
