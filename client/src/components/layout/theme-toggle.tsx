"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KEY = "querylab_theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as "light" | "dark" | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ?? (prefersDark ? "dark" : "light");
    apply(next);
    setTheme(next);
    setMounted(true);
  }, []);

  function apply(t: "light" | "dark") {
    document.documentElement.classList.toggle("dark", t === "dark");
  }

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem(KEY, next);
    setTheme(next);
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground hover:border-border-strong"
      )}
    >
      {mounted ? <Icon className="h-[14px] w-[14px]" /> : null}
    </button>
  );
}
