import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
        primary: "bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20 border border-brand-blue/10",
        secondary: "bg-brand-surface hover:bg-brand-surface/80 text-brand-text border border-brand-border hover:border-brand-blue/40 shadow-sm",
        accent: "bg-brand-gold hover:bg-brand-gold/90 text-[#080B12] font-semibold border border-brand-gold/10 shadow-lg shadow-brand-gold/15",
        ghost: "bg-transparent hover:bg-brand-surface text-brand-muted hover:text-brand-text",
        danger: "bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 hover:border-red-500/50",
    };

    const sizes = {
        sm: "px-3.5 py-1.5 text-xs gap-1.5",
        md: "px-4.5 py-2.5 text-sm gap-2",
        lg: "px-6 py-3.5 text-base gap-2.5 rounded-xl",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
};
