"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PlanNode } from "@/lib/api";
import { cn } from "@/lib/utils";

type Severity = {
  accent: string; // accent bar + dot color (CSS var or class token)
  dot: string;
  bg: string; // pill background
  fg: string; // pill foreground
  label: string;
};

function severity(node: PlanNode): Severity {
  const cost = node["Total Cost"] ?? 0;
  const type = node["Node Type"] ?? "";

  if (type === "Seq Scan" && (node["Plan Rows"] ?? 0) > 1000) {
    return {
      accent: "bg-[var(--sev-warn)]",
      dot: "bg-[var(--sev-warn)]",
      bg: "bg-[var(--sev-warn-bg)]",
      fg: "text-[var(--sev-warn)]",
      label: "seq scan",
    };
  }
  if (cost > 1000) {
    return {
      accent: "bg-[var(--sev-danger)]",
      dot: "bg-[var(--sev-danger)]",
      bg: "bg-[var(--sev-danger-bg)]",
      fg: "text-[var(--sev-danger)]",
      label: "high cost",
    };
  }
  if (type.includes("Index")) {
    return {
      accent: "bg-[var(--sev-accent)]",
      dot: "bg-[var(--sev-accent)]",
      bg: "bg-[var(--sev-accent-bg)]",
      fg: "text-[var(--sev-accent)]",
      label: "indexed",
    };
  }
  return {
    accent: "bg-border-strong",
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    fg: "text-muted-foreground",
    label: "ok",
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-[12px] font-medium mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function CondLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground pt-[3px] w-[44px]">
        {label}
      </span>
      <code className="font-mono text-[11.5px] bg-muted text-foreground px-[7px] py-0.5 rounded">
        {value}
      </code>
    </div>
  );
}

function NodeCard({ node, depth = 0 }: { node: PlanNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const children = node.Plans ?? [];
  const sev = severity(node);
  const hasChildren = children.length > 0;

  return (
    <div
      className={cn(
        "relative",
        depth === 0 ? "" : "pl-5 ml-2.5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border"
      )}
    >
      <div className="relative rounded-[10px] border border-border bg-card my-2 px-[14px] py-3">
        {/* 3px full-height severity bar */}
        <span
          className={cn(
            "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-[3px]",
            sev.accent
          )}
          aria-hidden
        />
        <div className="flex items-center gap-2.5 pl-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
              aria-label={open ? "Collapse" : "Expand"}
            >
              {open ? (
                <ChevronDown className="h-[13px] w-[13px]" />
              ) : (
                <ChevronRight className="h-[13px] w-[13px]" />
              )}
            </button>
          ) : (
            <span className="h-[13px] w-[13px] inline-block" aria-hidden />
          )}
          <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
          <span className="text-[13px] font-semibold tracking-[-0.005em]">
            {node["Node Type"] ?? "Unknown Node"}
          </span>
          {node["Relation Name"] && (
            <span className="font-mono text-[11px] text-muted-foreground">
              on{" "}
              <span className="text-foreground">{node["Relation Name"]}</span>
            </span>
          )}
          {node["Index Name"] && (
            <span className="font-mono text-[11px] text-muted-foreground">
              using{" "}
              <span className="text-foreground">{node["Index Name"]}</span>
            </span>
          )}
          <span
            className={cn(
              "ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium",
              sev.bg,
              sev.fg
            )}
          >
            {sev.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] pl-[30px] mt-2.5">
          <Stat label="Cost" value={(node["Total Cost"] ?? 0).toFixed(2)} />
          <Stat
            label="Est. Rows"
            value={
              node["Plan Rows"] !== undefined
                ? (node["Plan Rows"] as number).toLocaleString()
                : "—"
            }
          />
          <Stat
            label="Actual Rows"
            value={
              node["Actual Rows"] !== undefined
                ? (node["Actual Rows"] as number).toLocaleString()
                : "—"
            }
          />
          <Stat
            label="Time (ms)"
            value={
              node["Actual Total Time"] !== undefined
                ? (node["Actual Total Time"] as number).toFixed(2)
                : "—"
            }
          />
        </div>

        {(node["Index Cond"] || node.Filter) && (
          <div className="pl-[30px] mt-2.5 flex flex-col gap-1">
            {node["Index Cond"] && (
              <CondLine label="index" value={node["Index Cond"]} />
            )}
            {node.Filter && <CondLine label="filter" value={node.Filter} />}
          </div>
        )}
      </div>

      {open &&
        hasChildren &&
        children.map((child, i) => (
          <NodeCard key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function PlanTree({ plan }: { plan: PlanNode }) {
  return (
    <div className="p-4">
      <NodeCard node={plan} />
    </div>
  );
}
