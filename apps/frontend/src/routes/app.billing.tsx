import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money } from "@/components/gatehouse/money";
import { UnitPicker } from "@/components/gatehouse/unit-picker";
import { Progress } from "@/components/ui/progress";
import { useGatehouse } from "@/lib/store";
import type { BillingRunView, Group, LevyView, Unit } from "@/lib/types";
import { createBillingRunFn, createLevyFn, renameBillingRunFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import { formatDate } from "@/lib/format";
import { Bell, Pencil, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
  validateSearch: (s: Record<string, unknown>) => ({
    create: typeof s.create === "string" ? s.create : undefined,
  }),
});

function getRerunLabel(cycle: string, billingRuns: BillingRunView[]) {
  const base = cycle.replace(/ \(\d+\)$/, "");
  const max = billingRuns.reduce((m, r) => {
    if (r.cycle === base) return Math.max(m, 1);
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = r.cycle.match(new RegExp(`^${escaped} \\((\\d+)\\)$`));
    return match ? Math.max(m, Number(match[1])) : m;
  }, 0);
  return `${base} (${max + 1})`;
}

function BillingPage() {
  const { billingRuns, levies, units, groups } = useGatehouse();
  const { create } = Route.useSearch();

  const [createBillingOpen, setCreateBillingOpen] = useState(create === "billing");
  const [createLevyOpen, setCreateLevyOpen] = useState(create === "levy");
  const [selectedRun, setSelectedRun] = useState<BillingRunView | null>(null);
  const [selectedLevy, setSelectedLevy] = useState<LevyView | null>(null);
  const [rerunRun, setRerunRun] = useState<BillingRunView | null>(null);

  useEffect(() => {
    if (create) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <>
      <SectionHeader title="Billing & Charges" sub="Recurring service charge and one-off levies." />
      <Tabs defaultValue="runs">
        <TabsList>
          <TabsTrigger value="runs">Billing runs</TabsTrigger>
          <TabsTrigger value="levies">Levies</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCreateBillingOpen(true)}><Plus size={14} className="mr-1.5" />Create billing run</Button>
          </div>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Bill name</th>
                  <th className="px-4 py-2.5 font-medium">Charge</th>
                  <th className="px-4 py-2.5 font-medium">Units billed</th>
                  <th className="px-4 py-2.5 font-medium">Units paid</th>
                  <th className="px-4 py-2.5 font-medium text-right">Total</th>
                  <th className="px-4 py-2.5 font-medium text-right">Collected</th>
                  <th className="px-4 py-2.5 font-medium w-40">Progress</th>
                  <th className="px-2 py-2.5 w-24" />
                </tr>
              </thead>
              <tbody>
                {billingRuns.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No billing runs yet. Create one to bill your units.</td></tr>
                )}
                {billingRuns.map((r) => {
                  const unitsPaid = units.filter((u) =>
                    u.charges.some((c) => c.cycle === r.cycle && c.kind === "service" && c.paid >= c.amount)
                  ).length;
                  return (
                  <tr key={r.id} className="border-t border-border cursor-pointer hover:bg-secondary" onClick={() => setSelectedRun(r)}>
                    <td className="px-4 py-3 font-medium">{r.cycle}</td>
                    <td className="px-4 py-3">Service charge</td>
                    <td className="px-4 py-3 tabular">{r.unitsBilled}</td>
                    <td className="px-4 py-3 tabular">{unitsPaid}</td>
                    <td className="px-4 py-3 text-right tabular"><Money value={r.total} /></td>
                    <td className="px-4 py-3 text-right tabular"><Money value={r.collected} /></td>
                    <td className="px-4 py-3"><Progress value={r.total > 0 ? (r.collected / r.total) * 100 : 0} className="h-1.5" /></td>
                    <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" onClick={() => setRerunRun(r)}>
                        <RefreshCw size={13} className="mr-1" />Re-run
                      </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="levies" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCreateLevyOpen(true)}><Plus size={14} className="mr-1.5" />Create levy</Button>
          </div>
          {levies.map((l) => (
            <Card key={l.id} className="p-6 cursor-pointer hover:bg-secondary" onClick={() => setSelectedLevy(l)}>
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

      <CreateBillingDialog open={createBillingOpen} onOpenChange={setCreateBillingOpen} units={units} groups={groups} />
      <CreateLevyDialog open={createLevyOpen} onOpenChange={setCreateLevyOpen} units={units} groups={groups} />
      <BillingRunSheet run={selectedRun} onClose={() => setSelectedRun(null)} units={units} />
      <LevySheet levy={selectedLevy} onClose={() => setSelectedLevy(null)} units={units} />
      <RerunBillingDialog run={rerunRun} onClose={() => setRerunRun(null)} units={units} groups={groups} billingRuns={billingRuns} />
    </>
  );
}

function CreateBillingDialog({ open, onOpenChange, units, groups }: { open: boolean; onOpenChange: (v: boolean) => void; units: Unit[]; groups: Group[] }) {
  const [cycle, setCycle] = useState("");
  const [amount, setAmount] = useState(0);
  const [totalInput, setTotalInput] = useState("");
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const [busy, setBusy] = useState(false);

  const targetCount = selected ? selected.size : units.length;

  function handleTotalChange(v: string) {
    setTotalInput(v);
    const t = Number(v);
    if (t > 0 && targetCount > 0) {
      setAmount(Math.round(t / targetCount));
    }
  }

  // Re-split when unit selection changes while a total is entered.
  useEffect(() => {
    const t = Number(totalInput);
    if (t > 0 && targetCount > 0) {
      setAmount(Math.round(t / targetCount));
    }
  }, [selected]);

  async function submit() {
    setBusy(true);
    try {
      const res = await createBillingRunFn({ data: { cycleLabel: cycle, chargeAmountNaira: amount, dueDate: Date.now() + 14 * 86_400_000, unitIds: selected ? [...selected] : undefined } });
      await getQueryClient().invalidateQueries();
      toast.success(`Billing run created — ${res.unitsBilled} residents notified`);
      onOpenChange(false);
    } catch {
      toast.error("Could not create billing run");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Create billing run</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Bill name</Label><Input value={cycle} onChange={(e) => setCycle(e.target.value)} placeholder="e.g. March 2026 Service Charge" /></div>
          <div>
            <Label>Charge per unit (₦)</Label>
            <Input type="number" value={amount || ""} placeholder="e.g. 6,000,000" onChange={(e) => { setAmount(Number(e.target.value)); setTotalInput(""); }} />
          </div>
          <div className="rounded-lg bg-secondary p-3 space-y-2">
            <Label className="text-xs text-muted-foreground">Or divide a total across units</Label>
            <Input
              type="number"
              placeholder="e.g. 6,000,000"
              value={totalInput}
              onChange={(e) => handleTotalChange(e.target.value)}
            />
            {Number(totalInput) > 0 && targetCount > 0 && (
              <p className="text-xs text-muted-foreground">
                ₦{Number(totalInput).toLocaleString("en-NG")} ÷ {targetCount} units = <span className="font-semibold text-ink">₦{Math.round(Number(totalInput) / targetCount).toLocaleString("en-NG")} per unit</span>
              </p>
            )}
          </div>
          <UnitPicker units={units} groups={groups} value={selected} onChange={setSelected} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy || targetCount === 0}>{busy ? "Billing…" : `Bill ${targetCount} unit${targetCount === 1 ? "" : "s"}`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateLevyDialog({ open, onOpenChange, units, groups }: { open: boolean; onOpenChange: (v: boolean) => void; units: Unit[]; groups: Group[] }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [exact, setExact] = useState(true);
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!name.trim() || !amt) return toast.error("Enter a levy name and amount");
    if (selected && selected.size === 0) return toast.error("Select at least one unit");
    setBusy(true);
    try {
      const dueDate = due ? new Date(due).getTime() : Date.now() + 12 * 86_400_000;
      const res = await createLevyFn({ data: { name: name.trim(), amountNaira: amt, dueDate, requireExact: exact, unitIds: selected ? [...selected] : undefined } });
      await getQueryClient().invalidateQueries();
      toast.success(`Levy created — ${res.unitsBilled} residents notified`);
      onOpenChange(false);
      setName(""); setAmount(""); setDue(""); setSelected(null);
    } catch {
      toast.error("Could not create levy");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <UnitPicker units={units} groups={groups} value={selected} onChange={setSelected} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Creating…" : "Create levy"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BillingRunSheet({ run, onClose, units }: { run: BillingRunView | null; onClose: () => void; units: Unit[] }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setEditing(false);
    setAlertOpen(false);
  }, [run?.id]);

  const billedUnits = run
    ? units.filter((u) => u.charges.some((c) => c.cycle === run.cycle && c.kind === "service"))
    : [];
  const paidUnits = billedUnits.filter((u) => {
    const c = u.charges.find((c) => c.cycle === run?.cycle && c.kind === "service");
    return c && c.paid >= c.amount;
  });
  const unpaidUnits = billedUnits.filter((u) => {
    const c = u.charges.find((c) => c.cycle === run?.cycle && c.kind === "service");
    return !c || c.paid < c.amount;
  });

  async function saveName() {
    if (!run || !nameInput.trim()) return;
    setSavingName(true);
    try {
      await renameBillingRunFn({ data: { runId: run.id, cycleLabel: nameInput.trim() } });
      await getQueryClient().invalidateQueries();
      toast.success("Bill name updated");
      setEditing(false);
    } catch {
      toast.error("Could not rename billing run");
    } finally {
      setSavingName(false);
    }
  }

  return (
    <Sheet open={!!run} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        className="w-full sm:max-w-xl overflow-y-auto p-0"
        onInteractOutside={(e) => { if (alertOpen || editing) e.preventDefault(); }}
      >
        {run && (
          <>
            <SheetHeader className="border-b border-border p-6">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="h-9 text-base font-display font-semibold"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditing(false); }}
                  />
                  <Button size="sm" disabled={savingName || !nameInput.trim()} onClick={saveName}>{savingName ? "Saving…" : "Save"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SheetTitle className="font-display text-2xl">{run.cycle}</SheetTitle>
                  <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-muted-foreground" onClick={() => { setNameInput(run.cycle); setEditing(true); }}>
                    <Pencil size={13} />
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                <Money value={run.chargeAmount} /> per unit · {run.unitsBilled} units billed · created {formatDate(run.createdAt)}
              </p>
              <div className="mt-3">
                <Progress value={run.total > 0 ? (run.collected / run.total) * 100 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span><Money value={run.collected} /> collected</span>
                  <span><Money value={run.total} /> total</span>
                </div>
              </div>
              {unpaidUnits.length > 0 && (
                <div className="mt-3">
                  <Button size="sm" onClick={() => setAlertOpen(true)}>
                    <Bell size={14} className="mr-1.5" />Resend alert to {unpaidUnits.length} unpaid
                  </Button>
                </div>
              )}
            </SheetHeader>

            <div className="p-6 space-y-6">
              {paidUnits.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Paid ({paidUnits.length})</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {paidUnits.map((u, i) => (
                      <div key={u.id} className={`flex items-center justify-between px-3 py-2 text-sm${i > 0 ? " border-t border-border" : ""}`}>
                        <span className="font-medium">{u.label} — {u.occupant}</span>
                        <span className="text-[#047857] text-xs font-medium">Paid</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unpaidUnits.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Unpaid ({unpaidUnits.length})</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {unpaidUnits.map((u, i) => {
                      const c = u.charges.find((c) => c.cycle === run.cycle && c.kind === "service");
                      const isPartial = c && c.paid > 0 && c.paid < c.amount;
                      return (
                        <div key={u.id} className={`flex items-center justify-between px-3 py-2 text-sm${i > 0 ? " border-t border-border" : ""}`}>
                          <span className="font-medium">{u.label} — {u.occupant}</span>
                          <span className={`text-xs font-medium ${isPartial ? "text-amber-600" : "text-rose-500"}`}>
                            {isPartial ? `Partial — ₦${c!.paid.toLocaleString("en-NG")} paid` : "Unpaid"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {billedUnits.length === 0 && (
                <p className="text-sm text-muted-foreground">No per-unit payment data available yet.</p>
              )}
            </div>
          </>
        )}
      </SheetContent>

      {run && (
        <ResendAlertDialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          unpaidUnits={unpaidUnits}
          cycleOrName={run.cycle}
          chargeAmount={run.chargeAmount}
          kind="service"
        />
      )}
    </Sheet>
  );
}

function LevySheet({ levy, onClose, units }: { levy: LevyView | null; onClose: () => void; units: Unit[] }) {
  const [alertOpen, setAlertOpen] = useState(false);

  const billedUnits = levy
    ? units.filter((u) => u.charges.some((c) => c.kind === "levy" && c.cycle === levy.name))
    : [];
  const paidUnits = billedUnits.filter((u) => {
    const c = u.charges.find((c) => c.kind === "levy" && c.cycle === levy?.name);
    return c && c.paid >= c.amount;
  });
  const unpaidUnits = billedUnits.filter((u) => {
    const c = u.charges.find((c) => c.kind === "levy" && c.cycle === levy?.name);
    return !c || c.paid < c.amount;
  });

  return (
    <Sheet open={!!levy} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        className="w-full sm:max-w-xl overflow-y-auto p-0"
        onInteractOutside={(e) => { if (alertOpen) e.preventDefault(); }}
      >
        {levy && (
          <>
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle className="font-display text-2xl">{levy.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <Money value={levy.amount} /> per unit · due {formatDate(levy.dueDate)}{levy.requireExact ? " · exact amount required" : ""}
              </p>
              <div className="mt-3">
                <Progress value={levy.total > 0 ? (levy.collected / levy.total) * 100 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span><Money value={levy.collected} /> collected</span>
                  <span><Money value={levy.total} /> total</span>
                </div>
              </div>
              {unpaidUnits.length > 0 && (
                <Button size="sm" className="mt-3 w-fit" onClick={() => setAlertOpen(true)}>
                  <Bell size={14} className="mr-1.5" />Resend alert to {unpaidUnits.length} unpaid
                </Button>
              )}
            </SheetHeader>

            <div className="p-6 space-y-6">
              {paidUnits.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Paid ({paidUnits.length})</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {paidUnits.map((u, i) => (
                      <div key={u.id} className={`flex items-center justify-between px-3 py-2 text-sm${i > 0 ? " border-t border-border" : ""}`}>
                        <span className="font-medium">{u.label} — {u.occupant}</span>
                        <span className="text-[#047857] text-xs font-medium">Paid</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unpaidUnits.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Unpaid ({unpaidUnits.length})</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {unpaidUnits.map((u, i) => {
                      const c = u.charges.find((c) => c.kind === "levy" && c.cycle === levy.name);
                      const isPartial = c && c.paid > 0 && c.paid < c.amount;
                      return (
                        <div key={u.id} className={`flex items-center justify-between px-3 py-2 text-sm${i > 0 ? " border-t border-border" : ""}`}>
                          <span className="font-medium">{u.label} — {u.occupant}</span>
                          <span className={`text-xs font-medium ${isPartial ? "text-amber-600" : "text-rose-500"}`}>
                            {isPartial ? `Partial — ₦${c!.paid.toLocaleString("en-NG")} paid` : "Unpaid"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {billedUnits.length === 0 && (
                <p className="text-sm text-muted-foreground">No per-unit payment data available yet.</p>
              )}
            </div>
          </>
        )}
      </SheetContent>

      {levy && (
        <ResendAlertDialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          unpaidUnits={unpaidUnits}
          cycleOrName={levy.name}
          chargeAmount={levy.amount}
          kind="levy"
        />
      )}
    </Sheet>
  );
}

function RerunBillingDialog({ run, onClose, units, groups, billingRuns }: {
  run: BillingRunView | null; onClose: () => void; units: Unit[]; groups: Group[]; billingRuns: BillingRunView[];
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!run) return;
    setName(getRerunLabel(run.cycle, billingRuns));
    setAmount(run.chargeAmount);
    const originalIds = units
      .filter((u) => u.charges.some((c) => c.cycle === run.cycle && c.kind === "service"))
      .map((u) => u.id);
    setSelected(new Set(originalIds));
  }, [run?.id]);

  const targetCount = selected ? selected.size : units.length;

  async function submit() {
    if (!run || !name.trim() || targetCount === 0) return;
    setBusy(true);
    try {
      const res = await createBillingRunFn({
        data: {
          cycleLabel: name.trim(),
          chargeAmountNaira: amount,
          dueDate: Date.now() + 14 * 86_400_000,
          unitIds: selected ? [...selected] : undefined,
        },
      });
      await getQueryClient().invalidateQueries();
      toast.success(`Re-run "${name.trim()}" created — ${res.unitsBilled} units notified`);
      onClose();
    } catch {
      toast.error("Could not create re-run");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!run} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-display">Re-run bill</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Bill name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. March 2026 Service Charge (2)" />
          </div>
          <div>
            <Label>Charge per unit (₦)</Label>
            <Input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <UnitPicker units={units} groups={groups} value={selected} onChange={setSelected} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !name.trim() || targetCount === 0}>
            {busy ? "Creating…" : `Create re-run for ${targetCount} unit${targetCount === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResendAlertDialog({
  open,
  onClose,
  unpaidUnits,
  cycleOrName,
  chargeAmount,
  kind,
}: {
  open: boolean;
  onClose: () => void;
  unpaidUnits: Unit[];
  cycleOrName: string;
  chargeAmount: number;
  kind: "service" | "levy";
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(unpaidUnits.map((u) => u.id)));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSelected(new Set(unpaidUnits.map((u) => u.id)));
  }, [open]);

  function toggleAll() {
    if (selected.size === unpaidUnits.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(unpaidUnits.map((u) => u.id)));
    }
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function send() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success(`Alert sent to ${selected.size} unit${selected.size === 1 ? "" : "s"}`);
    onClose();
  }

  const example = unpaidUnits[0];
  const exampleMessage =
    kind === "service"
      ? `Hi ${example?.occupant ?? "[Name]"}, your ${cycleOrName} service charge of ₦${chargeAmount.toLocaleString("en-NG")} is now due. Transfer to ${example?.accountNumber ?? "[account]"} from any bank app — your payment is recorded automatically.`
      : `Hi ${example?.occupant ?? "[Name]"}, you have a levy "${cycleOrName}" of ₦${chargeAmount.toLocaleString("en-NG")} due. Transfer to ${example?.accountNumber ?? "[account]"} to settle.`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Resend alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{selected.size} of {unpaidUnits.length} selected</span>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {selected.size === unpaidUnits.length ? "Deselect all" : "Select all"}
            </Button>
          </div>
          <div className="max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border">
            {unpaidUnits.map((u) => (
              <label key={u.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggle(u.id)}
                  className="h-4 w-4 shrink-0"
                />
                <span className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{u.label} — {u.occupant}</span>
                </span>
                <span className="text-xs text-muted-foreground shrink-0">{u.phone || u.email || "no contact"}</span>
              </label>
            ))}
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Message preview</div>
            <div className="rounded-lg bg-secondary p-3 text-xs text-ink leading-relaxed">{exampleMessage}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={send} disabled={sending || selected.size === 0}>
            {sending ? "Sending…" : `Send to ${selected.size}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
