"use client";

import type { ExecuteSuccess } from "@/lib/api";
import { cn } from "@/lib/utils";

// Rough pg OID -> friendly name. Non-exhaustive, but covers the common cases
// and gives the header annotation the right feel per the design spec.
const OID_TYPES: Record<number, string> = {
  16: "bool",
  20: "int8",
  21: "int2",
  23: "int4",
  25: "text",
  700: "float4",
  701: "float8",
  1043: "varchar",
  1082: "date",
  1083: "time",
  1114: "timestamp",
  1184: "timestamptz",
  1700: "numeric",
  2950: "uuid",
  3802: "jsonb",
  114: "json",
};

function typeHint(oid?: number): string {
  if (oid === undefined) return "";
  return OID_TYPES[oid] ?? `oid:${oid}`;
}

function renderCell(value: unknown): { text: string; nullish: boolean; zero: boolean } {
  if (value === null || value === undefined)
    return { text: "NULL", nullish: true, zero: false };
  if (typeof value === "object")
    return { text: JSON.stringify(value), nullish: false, zero: false };
  const text = String(value);
  return { text, nullish: false, zero: text === "0" };
}

export function ResultsTable({ result }: { result: ExecuteSuccess }) {
  const rows = result.data ?? [];
  const fields = result.fields ?? [];
  const columns = fields.length
    ? fields.map((f) => ({ name: f.name, type: typeHint(f.dataType) }))
    : rows[0]
    ? Object.keys(rows[0]).map((n) => ({ name: n, type: "" }))
    : [];

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        </div>
        <div className="text-sm font-medium">No rows returned</div>
        <p className="mt-1 text-xs text-muted-foreground">
          The query executed successfully but produced an empty result set.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-auto max-h-[480px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="text-left px-[14px] py-[10px] font-medium text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-[var(--color-table-head)] whitespace-nowrap"
                >
                  {col.name}
                  {col.type && (
                    <span className="font-mono text-[10px] normal-case tracking-normal ml-1.5 text-border-strong">
                      {col.type}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border">
                {columns.map((col) => {
                  const { text, nullish, zero } = renderCell(
                    (row as Record<string, unknown>)[col.name]
                  );
                  return (
                    <td
                      key={col.name}
                      className={cn(
                        "px-[14px] py-[9px] font-mono text-[12.5px] whitespace-nowrap max-w-[360px] overflow-hidden text-ellipsis",
                        (nullish || zero) && "text-muted-foreground"
                      )}
                      title={text}
                    >
                      {nullish ? <span className="italic">NULL</span> : text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-[14px] py-2.5 text-[11px] text-muted-foreground border-t border-border">
        <span>
          Showing {rows.length} of {result.rowCount ?? rows.length} rows
        </span>
        <span className="font-mono">
          {result.executionTimeMs.toFixed(2)} ms
        </span>
      </div>
    </div>
  );
}
