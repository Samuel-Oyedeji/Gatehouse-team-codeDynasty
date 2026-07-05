import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import type { Group, Unit } from "@/lib/types";

// Controlled "Apply to" selector for the billing/levy dialogs. `value === null`
// means "all units" — the caller omits unitIds so the backend bills every unit.
// A Set is an explicit subset. Units are sectioned by user-defined group, each
// section with its own select-all so a manager can bill whole groups or
// cherry-pick units within a group.
export function UnitPicker({
  units,
  groups,
  value,
  onChange,
}: {
  units: Unit[];
  groups: Group[];
  value: Set<string> | null;
  onChange: (next: Set<string> | null) => void;
}) {
  const sections = useMemo(() => {
    const known = new Set(groups.map((g) => g.id));
    const byGroup = new Map<string, Unit[]>();
    const ungrouped: Unit[] = [];
    for (const u of units) {
      if (u.groupId && known.has(u.groupId)) {
        const list = byGroup.get(u.groupId) ?? [];
        list.push(u);
        byGroup.set(u.groupId, list);
      } else {
        ungrouped.push(u);
      }
    }
    const result = groups
      .filter((g) => byGroup.has(g.id))
      .map((g) => ({ id: g.id, name: g.name, units: byGroup.get(g.id)! }));
    if (ungrouped.length) result.push({ id: "__ungrouped", name: "Ungrouped", units: ungrouped });
    return result;
  }, [units, groups]);

  const isAll = value === null;
  const chosen = value ?? new Set<string>();

  function toggleUnit(id: string) {
    const next = new Set(chosen);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  }

  function toggleGroup(groupUnits: Unit[]) {
    const next = new Set(chosen);
    const allOn = groupUnits.every((u) => next.has(u.id));
    for (const u of groupUnits) {
      if (allOn) next.delete(u.id);
      else next.add(u.id);
    }
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <Label>Apply to</Label>
      <RadioGroup
        value={isAll ? "all" : "select"}
        onValueChange={(v) => onChange(v === "all" ? null : new Set())}
        className="grid-cols-2 gap-3"
      >
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <RadioGroupItem value="all" id="apply-all" />
          All units ({units.length})
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <RadioGroupItem value="select" id="apply-select" />
          Select units
        </label>
      </RadioGroup>

      {!isAll && (
        <>
          <ScrollArea className="h-56 rounded-md border border-border">
            <div className="divide-y divide-border">
              {sections.map((section) => {
                const allOn = section.units.every((u) => chosen.has(u.id));
                const someOn = section.units.some((u) => chosen.has(u.id));
                return (
                  <div key={section.id}>
                    <label className="flex items-center justify-between gap-2 bg-secondary px-3 py-2 cursor-pointer">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                        {section.name} <span className="text-muted-foreground">({section.units.length})</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Select all
                        <Checkbox
                          checked={allOn ? true : someOn ? "indeterminate" : false}
                          onCheckedChange={() => toggleGroup(section.units)}
                        />
                      </span>
                    </label>
                    <div className="py-1">
                      {section.units.map((u) => (
                        <label
                          key={u.id}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary"
                        >
                          <Checkbox checked={chosen.has(u.id)} onCheckedChange={() => toggleUnit(u.id)} />
                          <span className="font-medium">{u.label}</span>
                          <span className="text-muted-foreground">— {u.occupant || "vacant"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="text-xs text-muted-foreground">
            {chosen.size} of {units.length} units selected
          </div>
        </>
      )}
    </div>
  );
}
