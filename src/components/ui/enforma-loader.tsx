"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
  size?: number;
}

export function EnFormaLoader({
  text = "Processing data...",
  className,
  size = 88,
}: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer orbital tracking ring (cyan) */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan border-r-cyan/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          style={{ boxShadow: "var(--glow-cyan)" }}
        />

        {/* Secondary inner ring (counter-rotation) */}
        <motion.span
          className="absolute inset-[14%] rounded-full border border-transparent border-b-foreground/30 border-l-foreground/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner pulsing biometric node (lime) */}
        <motion.span
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{ scale: [1, 1.45, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "var(--glow-lime)" }}
        />
      </div>

      {/* AI status text */}
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
