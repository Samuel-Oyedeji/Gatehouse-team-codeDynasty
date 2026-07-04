// Add one or more units from inside the app (the units-page header and the
// dashboard unit-status panel both drop this in around their own trigger button).
// Mirrors onboarding's manual add: one row per unit (label, occupant, phone) with
// a "+" to append rows. The backend keeps `block` and `unitName` separate, so we
// derive the block from the label prefix. On success store.addUnits invalidates
// the estate-state query, so new units and their account numbers appear without a
// reload.
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { store } from "@/lib/store";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

// Derive the block from a unit label (e.g. "A1" → "A"). Falls back to "A" when the
// label has no leading letters. Matches blockFromLabel in onboarding.tsx.
function blockFromLabel(label: string) {
  const match = label.trim().match(/^[A-Za-z]+/);
  return (match ? match[0] : "A").toUpperCase();
}

interface Row {
  label: string;
  occupant: string;
  phone: string;
}

const emptyRow = (): Row => ({ label: "", occupant: "", phone: "" });

export function AddUnitDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [busy, setBusy] = useState(false);

  const validRows = rows.filter((r) => r.label.trim() && r.occupant.trim());

  const reset = () => setRows([emptyRow()]);
  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function submit() {
    if (validRows.length === 0) return;
    setBusy(true);
    try {
      await store.addUnits(
        validRows.map((r) => ({
          label: r.label.trim(),
          block: blockFromLabel(r.label),
          occupantName: r.occupant.trim(),
          occupantPhone: r.phone.trim() || undefined,
        })),
      );
      toast.success(`${validRows.length} unit${validRows.length === 1 ? "" : "s"} added — account numbers minted`);
      reset();
      setOpen(false);
    } catch {
      toast.error("Could not add units");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle className="font-display">Add units</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <div className="grid grid-cols-[90px_1fr_130px_auto] gap-2 px-0.5 text-xs font-medium text-muted-foreground">
            <span>Unit</span>
            <span>Occupant</span>
            <span>Phone</span>
            <span className="w-9" />
          </div>
          <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-0.5">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[90px_1fr_130px_auto] gap-2">
                <Input autoFocus={i === 0} placeholder="A1" value={r.label} onChange={(e) => update(i, { label: e.target.value })} />
                <Input placeholder="Jane Doe" value={r.occupant} onChange={(e) => update(i, { occupant: e.target.value })} />
                <Input placeholder="08012345678" value={r.phone} onChange={(e) => update(i, { phone: e.target.value })} />
                {i === rows.length - 1 ? (
                  <Button type="button" variant="outline" size="icon" onClick={() => setRows([...rows, emptyRow()])} aria-label="Add another unit">
                    <Plus size={16} />
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove unit">
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
          <Button disabled={validRows.length === 0 || busy} onClick={submit}>
            {busy ? "Adding…" : validRows.length <= 1 ? "Add unit" : `Add ${validRows.length} units`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
