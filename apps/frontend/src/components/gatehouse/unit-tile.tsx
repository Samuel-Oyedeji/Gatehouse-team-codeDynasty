// A single unit square, as shown in the dashboard's Unit status panel. Kept in
// its own file so the tile styling is a single source of truth and survives
// rewrites of the surrounding panel. Draggable: drag-start carries the unit id
// so a drop target can reassign the unit's group.
import type { Unit } from "@/lib/types";
import { Money } from "./money";
import { cn } from "@/lib/utils";

const TONE: Record<Unit["status"], string> = {
  paid: "border-[#A7F3D0] bg-[#ECFDF5]",
  partial: "border-[#FDE68A] bg-[#FFFBEB]",
  overdue: "border-[#FECDD3] bg-[#FFF1F2]",
  unbilled: "border-border bg-secondary",
  credit: "border-[#C7D2FE] bg-[#EEF2FF]",
};

// Status accent — a compact dot replaces the full-text pill, which overflowed
// narrow tiles and forced the label to wrap.
const DOT: Record<Unit["status"], string> = {
  paid: "#10B981",
  partial: "#F59E0B",
  overdue: "#F43F5E",
  unbilled: "#94A3B8",
  credit: "#6366F1",
};

interface Props {
  unit: Unit;
  flashing?: boolean;
  onOpen: (id: string) => void;
}

export function UnitTile({ unit: u, flashing, onOpen }: Props) {
  return (
    <button
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", u.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onOpen(u.id)}
      className={cn(
        "flex min-w-0 flex-col rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-grab active:cursor-grabbing",
        TONE[u.status],
        flashing && "pulse-flash ring-2 ring-brand",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: DOT[u.status] }} />
        <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold leading-tight text-ink">{u.label}</span>
      </div>
      <div className="mt-1.5 truncate text-xs text-muted-foreground">{u.occupant}</div>
      <div className="mt-2 truncate text-sm font-medium tabular">
        {u.balance > 0 ? (
          <span className="text-ink">owing <Money value={u.balance} /></span>
        ) : u.credit > 0 ? (
          <span className="text-[#4338CA]">+<Money value={u.credit} /></span>
        ) : u.status === "unbilled" ? (
          <span className="text-muted-foreground">not billed</span>
        ) : (
          <span className="text-[#047857]">settled</span>
        )}
      </div>
    </button>
  );
}
