import React from "react";
import { cn } from "../../lib/utils";

export function Label({ className, children, ...props }) {
    return (
        <label
            className={cn(
                "block text-base font-medium text-gray-800 mb-2",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
}
