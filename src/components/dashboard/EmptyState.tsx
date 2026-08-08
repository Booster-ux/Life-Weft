"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onActionClick?: () => void;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No items to show",
    description = "Get started by adding a task or tracking a priority.",
    actionLabel,
    onActionClick,
    icon,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-brand-border rounded-xl bg-brand-surface/30 min-h-[300px]">
            <div className="h-100 flex items-center justify-center p-4 bg-brand-bg rounded-full border border-brand-border/60 text-brand-muted/70 mb-4.5">
                {icon || <Inbox size={32} className="stroke-[1.5]" />}
            </div>
            <h3 className="text-base font-bold text-brand-text mb-1">{title}</h3>
            <p className="text-sm text-brand-muted max-w-sm mb-5 leading-relaxed">{description}</p>
            {actionLabel && onActionClick && (
                <Button onClick={onActionClick} variant="secondary" size="sm">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
