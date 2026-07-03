import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money } from "@/components/gatehouse/money";
import { Progress } from "@/components/ui/progress";
import { useGatehouse } from "@/lib/store";
import { createBillingRunFn, createLevyFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import { formatDate } from "@/lib/format";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { billingRuns, levies, units } = useGatehouse();

  return (
    <>
      <SectionHeader title="Billing & Charges" sub="Recurring service charge and one-off levies." />
      <Tabs defaultValue="runs">
        <TabsList>
          <TabsTrigger value="runs">Billing runs</TabsTrigger>
          <TabsTrigger value="levies">Levies</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="mt-4 space-y-4">
          <div className="flex justify-end"><CreateBillingDialog unitCount={units.length} /></div>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Cycle</th>
                  <th className="px-4 py-2.5 font-medium">Charge</th>
                  <th className="px-4 py-2.5 font-medium">Units billed</th>
                  <th className="px-4 py-2.5 font-medium text-right">Total</th>
                  <th className="px-4 py-2.5 font-medium text-right">Collected</th>
                  <th className="px-4 py-2.5 font-medium w-40">Progress</th>
                </tr>
              </thead>
              <tbody>
                {billingRuns.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No billing runs yet. Create one to bill your units.</td></tr>
                )}
                {billingRuns.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{r.cycle}</td>
                    <td className="px-4 py-3">Service charge</td>
                    <td className="px-4 py-3 tabular">{r.unitsBilled}</td>
                    <td className="px-4 py-3 text-right tabular"><Money value={r.total} /></td>
                    <td className="px-4 py-3 text-right tabular"><Money value={r.collected} /></td>
                    <td className="px-4 py-3"><Progress value={r.total > 0 ? (r.collected / r.total) * 100 : 0} className="h-1.5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="levies" className="mt-4 space-y-4">
          <div className="flex justify-end"><CreateLevyDialog /></div>
          {levies.map((l) => (
            <Card key={l.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-semibold">{l.name}</div>
                  <div className="text-sm text-muted-foreground">
                    <Money value={l.amount} /> per unit · due {formatDate(l.dueDate)}{l.requireExact ? " · exact amount required" : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold tabular"><Money value={l.collected} /> / <Money value={l.total} /></div>
                  <div className="text-xs text-muted-foreground">{l.total > 0 ? Math.round((l.collected / l.total) * 100) : 0}% collected</div>
                </div>
              </div>
              <Progress value={l.total > 0 ? (l.collected / l.total) * 100 : 0} className="h-1.5 mt-4" />
            </Card>
          ))}
          <Card className="p-6 text-sm text-muted-foreground border-dashed">
            {levies.length === 0 ? "No active levies. " : "Add another levy. "}
            Click <span className="text-ink font-medium">Create levy</span> above to add one.
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function CreateBillingDialog({ unitCount }: { unitCount: number }) {
  const [open, setOpen] = useState(false);
  const [cycle, setCycle] = useState("Q4 2026");
  const [amount, setAmount] = useState(45000);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await createBillingRunFn({ data: { cycleLabel: cycle, chargeAmountNaira: amount, dueDate: Date.now() + 14 * 86_400_000 } });
      await getQueryClient().invalidateQueries();
      toast.success(`Billing run created — ${res.unitsBilled} residents notified`);
      setOpen(false);
    } catch {
      toast.error("Could not create billing run");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus size={14} className="mr-1.5" />Create billing run</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Create billing run</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Cycle</Label><Input value={cycle} onChange={(e) => setCycle(e.target.value)} /></div>
          <div><Label>Charge amount (₦)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
          <div><Label>Apply to</Label><Input readOnly value={`All units (${unitCount})`} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Billing…" : `Bill ${unitCount} units`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateLevyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [exact, setExact] = useState(true);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!name.trim() || !amt) return toast.error("Enter a levy name and amount");
    setBusy(true);
    try {
      const dueDate = due ? new Date(due).getTime() : Date.now() + 12 * 86_400_000;
      const res = await createLevyFn({ data: { name: name.trim(), amountNaira: amt, dueDate, requireExact: exact } });
      await getQueryClient().invalidateQueries();
      toast.success(`Levy created — ${res.unitsBilled} residents notified`);
      setOpen(false);
      setName(""); setAmount(""); setDue("");
    } catch {
      toast.error("Could not create levy");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus size={14} className="mr-1.5" />Create levy</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Create one-off levy</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Borehole repair levy" /></div>
          <div><Label>Amount (₦)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" /></div>
          <div><Label>Due date</Label><Input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" id="exact" checked={exact} onChange={(e) => setExact(e.target.checked)} />
            <label htmlFor="exact">Require exact amount — flag payments into this levy that are not the exact figure.</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Creating…" : "Create levy"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
