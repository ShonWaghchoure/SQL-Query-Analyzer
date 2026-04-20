export function MiniPlan() {
  const nodes: Array<{
    type: string;
    cost: string;
    tone: "muted" | "warn" | "accent";
    indent?: number;
    tag?: "warning" | "indexed";
  }> = [
    { type: "HashAggregate", cost: "218.40", tone: "muted" },
    { type: "Hash Right Join", cost: "184.12", tone: "muted", indent: 1 },
    {
      type: "Seq Scan on orders",
      cost: "142.00",
      tone: "warn",
      indent: 2,
      tag: "warning",
    },
    {
      type: "Index Scan on users_created_idx",
      cost: "18.20",
      tone: "accent",
      indent: 2,
      tag: "indexed",
    },
  ];

  const toneBar = {
    muted: "bg-border-strong",
    warn: "bg-[var(--sev-warn)]",
    accent: "bg-[var(--sev-accent)]",
  };

  return (
    <div className="flex flex-col gap-0.5">
      {nodes.map((n, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 py-1.5"
          style={{ paddingLeft: (n.indent ?? 0) * 14 }}
        >
          <span
            className={`h-[18px] w-[2px] rounded-sm ${toneBar[n.tone]}`}
            aria-hidden
          />
          <span className="font-mono text-[12px] flex-1 text-foreground/85 truncate">
            {n.type}
          </span>
          {n.tag && (
            <span
              className={`text-[10px] px-[7px] py-0.5 rounded-full font-medium ${
                n.tag === "warning"
                  ? "bg-[var(--sev-warn-bg)] text-[var(--sev-warn)]"
                  : "bg-[var(--sev-accent-bg)] text-[var(--sev-accent)]"
              }`}
            >
              {n.tag}
            </span>
          )}
          <span className="font-mono text-[11px] text-muted-foreground w-14 text-right">
            {n.cost}
          </span>
        </div>
      ))}
    </div>
  );
}
