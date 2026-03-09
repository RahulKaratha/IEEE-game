import React from "react";
import { cn } from "../../lib/utils";

export function Button({ className, variant = "default", children, ...props }) {
    const variants = {
        default: "glass-button",
        outline: "border border-white/20 hover:bg-white/10 text-white",
        ghost: "hover:bg-white/5 text-white/80 hover:text-white",
    };

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
