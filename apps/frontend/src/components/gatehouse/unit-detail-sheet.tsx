import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountNumber } from "./account-number";
import { Money } from "./money";
import { StatusPill } from "./status-pill";
import { store, useGatehouse } from "@/lib/store";
import type { LedgerEntry, Unit } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Send, Link2, Wallet, Bell, Pencil, Trash2, Loader2, MoreVertical } from "lucide-react";
import { toast } from "sonner";

export function UnitDetailSheet({ unitId, onOpenChange }: { unitId: string | null; onOpenChange: (v: boolean) => void }) {
  const { units } = useGatehouse();
  const unit = units.find((u) => u.id === unitId);

  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);

  // Reset transient UI (edit form, menu, confirm) whenever a different unit is
  // opened or the sheet closes, so nothing leaks into the next unit.
  useEffect(() => {
    setEditing(false);
    setMenuOpen(false);
    setConfirmOpen(false);
    setStatementOpen(false);
  }, [unitId]);

  function startEdit() {
    setEmail(unit?.email ?? "");
    setPhone(unit?.phone ?? "");
    setEditing(true);
  }

  async function saveContact() {
    if (!unit) return;
    const nextEmail = email.trim();
    const nextPhone = phone.trim();
    // Email is required by the schema, so it can be changed but not cleared. A
    // blank field means "leave unchanged"; any value must look like an email.
    if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSaving(true);
    try {
      await store.updateUnit(unit.id, { email: nextEmail || undefined, phone: nextPhone });
      toast.success("Contact updated");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update unit");
    } finally {
      setSaving(false);
    }
  }

  async function removeUnit() {
    if (!unit) return;
    setDeleting(true);
    try {
      await store.deleteUnit(unit.id);
      toast.success(`${unit.label} removed`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove unit");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Sheet open={!!unitId} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-xl overflow-y-auto p-0"
        // The kebab menu and delete confirm portal outside the sheet's DOM, so a
        // click on (or away from) them reads as an "outside" interaction. Keep the
        // sheet open while either is up — dismissing them shouldn't close the panel.
        onInteractOutside={(e) => {
          if (menuOpen || confirmOpen || statementOpen) e.preventDefault();
        }}
      >
        {unit && (
          <>
            {!editing && (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-11 top-2.5 z-20 h-8 w-8 text-muted-foreground"
                    aria-label="Unit actions"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={startEdit}>
                    <Pencil size={14} className="mr-2" /> Edit contact
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setConfirmOpen(true)} className="text-destructive focus:text-destructive">
                    <Trash2 size={14} className="mr-2" /> Delete unit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <SheetHeader className="border-b border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle className="font-display text-2xl">{unit.label}</SheetTitle>
                    <StatusPill kind={unit.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink">{unit.occupant} · <span className="capitalize">{unit.occupantType}</span></p>
                </div>
              </div>

              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {unit.label}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes {unit.label} ({unit.occupant}) from the estate. Payment history is kept for the record, but the unit will no longer appear in your lists. The virtual account will be expired and can no longer receive payments.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => { e.preventDefault(); removeUnit(); }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? "Removing…" : "Remove unit"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {editing ? (
                <div className="mt-3 space-y-3 rounded-lg border border-border p-3">
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="resident@email.com" />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" disabled={saving} onClick={() => setEditing(false)}>Cancel</Button>
                    <Button size="sm" disabled={saving} onClick={saveContact}>
                      {saving && <Loader2 size={14} className="mr-1.5 animate-spin" />}
                      {saving ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  <div>{unit.email || "No email on file"}</div>
                  <div>{unit.phone || "No phone on file"}</div>
                </div>
              )}
              <div className="mt-4 rounded-lg bg-brand-tint p-3">
                <div className="text-[11px] uppercase tracking-wide text-brand">Receiving account</div>
                <div className="mt-1"><AccountNumber value={unit.accountNumber} size="lg" /></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-left">
                <Stat label="Owed" value={<Money value={unit.balance} />} tone={unit.balance > 0 ? "warn" : "ok"} />
                <Stat label="Credit" value={<Money value={unit.credit} />} tone={unit.credit > 0 ? "credit" : "muted"} />
                <Stat label="Last paid" value={unit.lastPaymentAt ? formatDate(unit.lastPaymentAt) : "—"} tone="muted" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setStatementOpen(true)}>
                  <Send size={14} className="mr-1.5" /> Send statement
                </Button>
                {unit.balance > 0 && (
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Payment reminder sent to ${unit.occupant} — owes ₦${unit.balance.toLocaleString("en-NG")}`)}>
                    <Bell size={14} className="mr-1.5" /> Send reminder
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/r/${unit.id}`); toast.success("Resident link copied"); }}>
                  <Link2 size={14} className="mr-1.5" /> Copy resident link
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast("Record cash payment — opens form in real app")}>
                  <Wallet size={14} className="mr-1.5" /> Record payment
                </Button>
              </div>
            </SheetHeader>

            <div className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Arrears aging</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { l: "0–30", v: unit.balance },
                  { l: "31–60", v: 0 },
                  { l: "61–90", v: 0 },
                  { l: "90+", v: 0 },
                ].map((b) => (
                  <div key={b.l} className="rounded-lg border border-border p-3">
                    <div className="text-[11px] text-muted-foreground">{b.l} days</div>
                    <div className="mt-1 text-sm font-medium tabular text-ink">₦{b.v.toLocaleString("en-NG")}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Transaction ledger</div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Amount</th>
                      <th className="px-3 py-2 font-medium text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...unit.ledger].reverse().map((l) => (
                      <tr key={l.id} className="border-t border-border">
                        <td className="px-3 py-2 text-muted-foreground tabular">{formatDate(l.date)}</td>
                        <td className="px-3 py-2">
                          <div className="text-ink">{l.description}</div>
                          {l.allocation && <div className="text-xs text-muted-foreground">{l.allocation}</div>}
                        </td>
                        <td className="px-3 py-2"><LedgerStatus entry={l} /></td>
                        <td className="px-3 py-2 text-right tabular"><Money value={Math.abs(l.amount)} /></td>
                        <td className="px-3 py-2 text-right tabular text-muted-foreground"><Money value={l.running} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <SendStatementDialog open={statementOpen} onClose={() => setStatementOpen(false)} unit={unit} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Per-row settlement badge for the transaction ledger. Charge rows reflect how
// much of that charge is paid; payment/credit rows describe the money movement.
function LedgerStatus({ entry }: { entry: LedgerEntry }) {
  if (entry.kind === "payment") return <StatusPill kind="paid">Received</StatusPill>;
  if (entry.kind === "debit") return <StatusPill kind="debit" />;
  if (entry.kind === "credit") return <StatusPill kind="credit" />;
  if (entry.settled === "paid") return <StatusPill kind="paid" />;
  if (entry.settled === "partial") return <StatusPill kind="partial" />;
  return <StatusPill kind="overdue">Unpaid</StatusPill>;
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone: "ok" | "warn" | "credit" | "muted" }) {
  const colors = {
    ok: "bg-[#ECFDF5] text-[#047857]",
    warn: "bg-[#FFFBEB] text-[#B45309]",
    credit: "bg-[#EEF2FF] text-[#4338CA]",
    muted: "bg-secondary text-ink",
  }[tone];
  return (
    <div className={`rounded-lg p-3 ${colors}`}>
      <div className="text-[11px] uppercase tracking-wide opacity-80">{label}</div>
      <div className="mt-1 text-sm font-semibold tabular">{value}</div>
    </div>
  );
}

function SendStatementDialog({ open, onClose, unit }: { open: boolean; onClose: () => void; unit: Unit }) {
  const [sending, setSending] = useState(false);

  const totalCharged = unit.charges.reduce((a, c) => a + c.amount, 0);
  const totalPaid = unit.charges.reduce((a, c) => a + c.paid, 0);
  const preview = `Hi ${unit.occupant}, your Gatehouse account summary: ₦${totalCharged.toLocaleString("en-NG")} billed, ₦${totalPaid.toLocaleString("en-NG")} received${unit.balance > 0 ? `, ₦${unit.balance.toLocaleString("en-NG")} outstanding` : ", fully settled"}. Payment account: ${unit.accountNumber} (any bank). — Gatehouse`;

  async function send() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success(`Statement sent to ${unit.occupant}`);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Send statement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-border divide-y divide-border">
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{unit.phone || "Not on file"}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{unit.email || "Not on file"}</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Message preview</div>
            <div className="rounded-lg bg-secondary p-3 text-xs text-ink leading-relaxed">{preview}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={send} disabled={sending || (!unit.phone && !unit.email)}>
            {sending ? "Sending…" : "Send statement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}