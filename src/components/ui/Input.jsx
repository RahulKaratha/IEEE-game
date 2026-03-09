import React from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                "glass-input w-full px-4 py-3 rounded-xl text-base",
                className
            )}
            {...props}
        />
    );
}
