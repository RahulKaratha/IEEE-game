import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
