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
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { units, cycle } = useGatehouse();
  const billed = units.length * 45000;
  const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
  const levyTotal = 60 * 10000;
  const levyCollected = Math.round(levyTotal * 0.62);

  return (
    <>
      <SectionHeader title="Billing & Charges" sub="Recurring service charge and one-off levies." />
      <Tabs defaultValue="runs">
        <TabsList>
          <TabsTrigger value="runs">Billing runs</TabsTrigger>
          <TabsTrigger value="levies">Levies</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="mt-4 space-y-4">
          <div className="flex justify-end"><CreateBillingDialog /></div>
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
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{cycle}</td>
                  <td className="px-4 py-3">Service charge</td>
                  <td className="px-4 py-3 tabular">{units.length}</td>
                  <td className="px-4 py-3 text-right tabular"><Money value={billed} /></td>
                  <td className="px-4 py-3 text-right tabular"><Money value={collected} /></td>
                  <td className="px-4 py-3"><Progress value={(collected / billed) * 100} className="h-1.5" /></td>
                </tr>
                <tr className="border-t border-border text-muted-foreground">
                  <td className="px-4 py-3 font-medium">Q2 2026</td>
                  <td className="px-4 py-3">Service charge</td>
                  <td className="px-4 py-3 tabular">{units.length}</td>
                  <td className="px-4 py-3 text-right tabular"><Money value={billed} /></td>
                  <td className="px-4 py-3 text-right tabular"><Money value={billed} /></td>
                  <td className="px-4 py-3"><Progress value={100} className="h-1.5" /></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="levies" className="mt-4 space-y-4">
          <div className="flex justify-end"><CreateLevyDialog /></div>
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-lg font-semibold">Generator repair levy</div>
                <div className="text-sm text-muted-foreground">₦10,000 per unit · due in 12 days · exact amount required</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-semibold tabular"><Money value={levyCollected} /> / <Money value={levyTotal} /></div>
                <div className="text-xs text-muted-foreground">{Math.round((levyCollected / levyTotal) * 100)}% collected</div>
              </div>
            </div>
            <Progress value={(levyCollected / levyTotal) * 100} className="h-1.5 mt-4" />
          </Card>
          <Card className="p-6 text-sm text-muted-foreground border-dashed">
            No other active levies. Click <span className="text-ink font-medium">Create levy</span> above to add one.
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function CreateBillingDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus size={14} className="mr-1.5" />Create billing run</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Create billing run</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Cycle</Label><Input defaultValue="Q4 2026" /></div>
          <div><Label>Charge amount (₦)</Label><Input type="number" defaultValue={45000} /></div>
          <div><Label>Apply to</Label><Input defaultValue="All units (60)" /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success("Billing run created — 60 residents notified"); }}>Bill 60 units</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateLevyDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus size={14} className="mr-1.5" />Create levy</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Create one-off levy</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Name</Label><Input placeholder="Borehole repair levy" /></div>
          <div><Label>Amount (₦)</Label><Input type="number" placeholder="10000" /></div>
          <div><Label>Due date</Label><Input type="date" /></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" id="exact" defaultChecked />
            <label htmlFor="exact">Require exact amount — only this figure will be accepted into the unit's account for this levy.</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success("Levy created and residents notified"); }}>Create levy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}