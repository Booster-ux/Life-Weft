"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, Mail, User, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: name.trim(),
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                // User signed in immediately (e.g. confirm email disabled)
                router.push("/dashboard");
                router.refresh();
            } else if (data.user && !data.session) {
                // Email confirmation required by Supabase project settings
                setMessage("Registration successful! Please check your email to confirm your account, then sign in.");
                setLoading(false);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError("");

        try {
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (oauthError) {
                setError(oauthError.message);
                setLoading(false);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Google signup failed.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#080B12] text-brand-text flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans min-h-screen">
            {/* Glow Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Back button */}
            <Link
                href="/"
                className="absolute top-6 left-6 text-brand-muted hover:text-white flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
                <ArrowLeft size={14} />
                Back to Home
            </Link>

            <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl relative z-10 space-y-5">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-1">
                        <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center">
                            <span className="font-extrabold text-white text-xs">L</span>
                        </div>
                        <span className="font-extrabold text-lg text-white">
                            Lifeweft<span className="text-brand-gold">.</span>
                        </span>
                    </Link>
                    <h2 className="text-xl font-bold text-white tracking-tight">Create your workspace</h2>
                    <p className="text-xs text-brand-muted">Get started free. Reclaim control of your memory and life.</p>
                </div>

                {/* Validation / Error Messages */}
                {error && (
                    <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-3 rounded-lg flex items-start gap-2 text-xs leading-normal animate-shake">
                        <ShieldAlert size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 p-3 rounded-lg flex items-start gap-2 text-xs leading-normal">
                        <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Name field */}
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                                <User size={16} />
                            </div>
                            <input
                                id="name"
                                type="text"
                                placeholder="Julian Vance"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-brand-muted/50 focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Email field */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                                <Mail size={16} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-brand-muted/50 focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                                <Lock size={16} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-brand-muted/50 focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                                <Lock size={16} />
                            </div>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Match password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-brand-muted/50 focus:border-brand-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Sign Up button */}
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        className="w-full py-3 justify-center text-xs font-bold uppercase tracking-wider"
                    >
                        Create Workspace
                    </Button>
                </form>

                {/* Separator */}
                <div className="flex items-center gap-3 text-xs text-brand-muted py-0.5">
                    <div className="h-[1px] bg-brand-border/40 flex-1" />
                    <span>or continue with</span>
                    <div className="h-[1px] bg-brand-border/40 flex-1" />
                </div>

                {/* Google sign up button */}
                <button
                    onClick={handleGoogleSignup}
                    type="button"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-brand-bg hover:bg-brand-border/30 border border-brand-border text-xs font-semibold text-brand-text hover:text-white rounded-lg transition-all cursor-pointer font-sans disabled:opacity-40"
                >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Sign up with Google</span>
                </button>

                {/* Login redirection */}
                <p className="text-xs text-brand-muted text-center pt-2 select-text">
                    Already have a workspace?{" "}
                    <Link href="/login" className="text-brand-blue font-semibold hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
