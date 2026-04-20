"use client";

import type { ExecuteSuccess } from "@/lib/api";

type Cell = {
  label: string;
  value: string;
  unit?: string;
  tone?: "ok";
};

function MetricCell({ label, value, unit, tone }: Cell) {
  return (
    <div className="bg-card px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className="font-mono font-semibold"
          style={{ fontSize: 22, letterSpacing: "-0.01em" }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {unit}
          </span>
        )}
        {tone === "ok" && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-[var(--sev-accent)]">
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--sev-accent)]" />
            fast
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricsBar({ result }: { result: ExecuteSuccess }) {
  const cols = result.fields?.length ?? 0;
  const fast = result.executionTimeMs < 50;

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[var(--radius)] border border-border overflow-hidden"
      style={{ background: "var(--border)" }}
    >
      <MetricCell
        label="Execution"
        value={result.executionTimeMs.toFixed(2)}
        unit="ms"
        tone={fast ? "ok" : undefined}
      />
      <MetricCell label="Status" value="OK" />
      <MetricCell label="Rows" value={String(result.rowCount ?? 0)} />
      <MetricCell label="Columns" value={String(cols)} />
    </section>
  );
}
