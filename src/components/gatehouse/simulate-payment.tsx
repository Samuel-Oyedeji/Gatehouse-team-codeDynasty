import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { store, useGatehouse } from "@/lib/store";

export function SimulatePayment() {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("");
  const [amount, setAmount] = useState("45000");
  const { units } = useGatehouse();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed text-muted-foreground hover:text-ink hover:border-brand">
          <Zap size={14} className="mr-1.5" />
          Simulate payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Simulate an incoming payment</DialogTitle>
          <DialogDescription>
            Developer-only. Fires a fake transfer into the app so reconciliation runs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sim-unit">Unit label (e.g. A3, B12)</Label>
            <Input id="sim-unit" value={unit} onChange={(e) => setUnit(e.target.value)} list="sim-unit-list" />
            <datalist id="sim-unit-list">
              {units.map((u) => <option key={u.id} value={u.label}>{u.occupant}</option>)}
            </datalist>
            <p className="mt-1 text-xs text-muted-foreground">Leave blank or enter an unknown label to test unmatched flow.</p>
          </div>
          <div>
            <Label htmlFor="sim-amount">Amount (₦)</Label>
            <Input id="sim-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const n = Number(amount);
              if (!n || n <= 0) return;
              store.recordPayment(unit.trim(), n);
              setOpen(false);
            }}
          >
            Fire payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}