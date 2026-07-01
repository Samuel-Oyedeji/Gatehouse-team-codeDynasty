import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AccountNumber } from "./account-number";
import { Money } from "./money";
import { StatusPill } from "./status-pill";
import { useGatehouse } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { Send, Link2, Wallet } from "lucide-react";
import { toast } from "sonner";

export function UnitDetailSheet({ unitId, onOpenChange }: { unitId: string | null; onOpenChange: (v: boolean) => void }) {
  const { units } = useGatehouse();
  const unit = units.find((u) => u.id === unitId);

  return (
    <Sheet open={!!unitId} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {unit && (
          <>
            <SheetHeader className="border-b border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle className="font-display text-2xl">{unit.label}</SheetTitle>
                    <StatusPill kind={unit.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink">{unit.occupant}</p>
                  <p className="text-xs text-muted-foreground">{unit.phone} · {unit.occupantType}</p>
                </div>
              </div>
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
                <Button size="sm" onClick={() => toast.success(`Statement sent to ${unit.occupant}`)}>
                  <Send size={14} className="mr-1.5" /> Send statement
                </Button>
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
                      <th className="px-3 py-2 font-medium text-right">Amount</th>
                      <th className="px-3 py-2 font-medium text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.ledger.map((l) => (
                      <tr key={l.id} className="border-t border-border">
                        <td className="px-3 py-2 text-muted-foreground tabular">{formatDate(l.date)}</td>
                        <td className="px-3 py-2">
                          <div className="text-ink">{l.description}</div>
                          {l.allocation && <div className="text-xs text-muted-foreground">{l.allocation}</div>}
                        </td>
                        <td className="px-3 py-2 text-right tabular"><Money value={Math.abs(l.amount)} /></td>
                        <td className="px-3 py-2 text-right tabular text-muted-foreground"><Money value={l.running} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
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