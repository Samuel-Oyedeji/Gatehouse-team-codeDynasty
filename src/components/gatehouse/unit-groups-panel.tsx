// Unit status panel for the dashboard. Replaces the old fixed A/B/C/D block
// grouping: every unit starts "Ungrouped" and the manager drags unit tiles into
// their own named groups. Groups are stored server-side (Unit.groupId); this
// component reads them from the estate state and mutates via the store, which
// refetches after each change. A unit belongs to at most one group.
import { useState } from "react";
import type { Unit, Group } from "@/lib/types";
import { store } from "@/lib/store";
import { Money } from "./money";
import { AddUnitDialog } from "./add-unit-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  units: Unit[];
  groups: Group[];
  recentlyChanged: Record<string, number>;
  onOpenUnit: (id: string) => void;
  className?: string;
}

export function UnitGroupsPanel({ units, groups, recentlyChanged, onOpenUnit, className }: Props) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const ungrouped = units.filter((u) => !u.groupId);

  const createGroup = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await store.createGroup(trimmed);
      toast.success(`Group "${trimmed}" created — drag units in`);
      setName("");
      setCreating(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create group");
    } finally {
      setBusy(false);
    }
  };

  const deleteGroup = async (id: string, gName: string) => {
    try {
      await store.deleteGroup(id);
      toast(`Group "${gName}" removed`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove group");
    }
  };

  const assign = async (unitId: string, groupId: string | null) => {
    const u = units.find((x) => x.id === unitId);
    if (!u || (u.groupId ?? null) === groupId) return; // no-op if unchanged
    try {
      await store.assignUnitGroup(unitId, groupId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not move unit");
    }
  };

  const Tile = ({ u }: { u: Unit }) => {
    const flashing = !!recentlyChanged[u.id];
    return (
      <button
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", u.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onClick={() => onOpenUnit(u.id)}
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
  };

  const dropProps = (zoneId: string, groupId: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(zoneId);
    },
    onDragLeave: (e: React.DragEvent) => {
      // Ignore leaves into child elements of the same zone.
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      if (id) void assign(id, groupId);
      setDragOver(null);
    },
  });

  const gridCls = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2";

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-lg font-semibold">Unit status</h2>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground md:inline">Drag a unit into a group · click to open its statement.</span>
          <AddUnitDialog>
            <Button size="sm" variant="outline"><Plus size={14} className="mr-1" />Add unit</Button>
          </AddUnitDialog>
        </div>
      </div>

      {/* Ungrouped — also a drop target so units can be pulled back out of a group. */}
      <div
        {...dropProps("ungrouped", null)}
        className={cn(
          "rounded-xl border border-transparent p-2 -m-2 transition-colors",
          dragOver === "ungrouped" && "border-brand bg-brand-tint/40",
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-sm font-medium text-ink">Ungrouped</h3>
          <span className="text-xs text-muted-foreground">{ungrouped.length} units</span>
        </div>
        {ungrouped.length > 0 ? (
          <div className={gridCls}>
            {ungrouped.map((u) => <Tile key={u.id} u={u} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-3">Every unit is assigned to a group.</p>
        )}
      </div>

      {/* User groups */}
      {groups.length > 0 && (
        <div className="mt-6 space-y-4">
          {groups.map((g) => {
            const members = units.filter((u) => u.groupId === g.id);
            return (
              <div
                key={g.id}
                {...dropProps(g.id, g.id)}
                className={cn(
                  "rounded-xl border border-border p-3 transition-colors",
                  dragOver === g.id && "border-brand bg-brand-tint/40",
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-medium text-ink">{g.name}</h3>
                  <span className="text-xs text-muted-foreground">{members.length} units</span>
                  <button
                    onClick={() => void deleteGroup(g.id, g.name)}
                    className="ml-auto text-muted-foreground hover:text-[#F43F5E] transition-colors"
                    title="Delete group"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {members.length > 0 ? (
                  <div className={gridCls}>
                    {members.map((u) => <Tile key={u.id} u={u} />)}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-3">Drag units here to add them.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create group — dotted square. */}
      <button
        onClick={() => setCreating(true)}
        className="mt-4 flex h-24 w-44 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
      >
        <Plus size={20} />
        <span className="text-sm font-medium">Create group</span>
      </button>

      <Dialog open={creating} onOpenChange={(v) => { setCreating(v); if (!v) setName(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Create group</DialogTitle></DialogHeader>
          <div>
            <Label>Group name</Label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void createGroup()}
              placeholder="e.g. Tower West, Duplexes, Ground floor"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCreating(false); setName(""); }}>Cancel</Button>
            <Button disabled={!name.trim() || busy} onClick={() => void createGroup()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
