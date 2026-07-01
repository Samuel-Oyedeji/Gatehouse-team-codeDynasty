import { createFileRoute } from "@tanstack/react-router";
import { useGatehouse } from "@/lib/store";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/r/$token")({
  component: ResidentPage,
});

function ResidentPage() {
  const { token } = Route.useParams();
  const { units, vendors, payouts, estate, cycle } = useGatehouse();
  // Resolve by id first, else fall back to first unit so the demo works with /r/demo
  const unit = units.find((u) => u.id === token) ?? units[0];
  const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
  const spent = payouts.reduce((a, p) => a + p.amount, 0);
  const byCat = vendors.map((v) => ({ name: v.category, amount: payouts.filter((p) => p.vendorId === v.id).reduce((a, p) => a + p.amount, 0) }));

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-card">
        <div className="max-w-md mx-auto px-5 py-4">
          <div className="text-xs text-muted-foreground">{estate.name} · {cycle}</div>
          <div className="font-display text-xl font-semibold mt-0.5">{unit.label} — {unit.occupant}</div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-6 space-y-5">
        {/* Pay card */}
        <Card className="p-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">You owe</div>
          <div className="mt-1 font-display text-4xl font-semibold tabular text-ink">
            <Money value={unit.balance} />
          </div>
          {unit.credit > 0 && (
            <div className="mt-2"><StatusPill kind="credit">Credit: ₦{unit.credit.toLocaleString("en-NG")}</StatusPill></div>
          )}
          <div className="mt-5 rounded-lg bg-brand-tint p-4">
            <div className="text-xs uppercase tracking-wide text-brand">Pay your dues — transfer to</div>
            <div className="mt-2"><AccountNumber value={unit.accountNumber} size="lg" /></div>
            <p className="mt-3 text-sm text-ink leading-relaxed">
              Transfer to this account from any bank app. Your payment is recorded automatically.
            </p>
          </div>
        </Card>

        {/* Statement */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-base font-semibold">Your statement</div>
            <StatusPill kind={unit.status} />
          </div>
          <ul className="divide-y divide-border text-sm">
            {unit.ledger.map((l) => (
              <li key={l.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-ink">{l.description}</div>
                  <div className="text-xs text-muted-foreground tabular">{formatDate(l.date)}{l.allocation ? ` · ${l.allocation}` : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`tabular font-medium ${l.kind === "payment" ? "text-[#047857]" : "text-ink"}`}>
                    {l.kind === "payment" ? "−" : ""}<Money value={Math.abs(l.amount)} />
                  </div>
                  {l.kind === "payment" && (
                    <button className="mt-0.5 text-xs text-brand inline-flex items-center gap-1"><Download size={11} />Receipt</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Transparency */}
        <Card className="p-5">
          <div className="font-display text-base font-semibold">Where the estate's money went</div>
          <p className="mt-1 text-sm text-muted-foreground">
            This quarter, residents paid <span className="tabular font-medium text-ink"><Money value={collected} /></span>.
            We spent <span className="tabular font-medium text-ink"><Money value={spent} /></span> keeping {estate.name} running.
          </p>
          <ul className="mt-4 space-y-2.5">
            {byCat.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-ink">{c.name}</span>
                <span className="tabular font-medium"><Money value={c.amount} /></span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 py-4">
          <ShieldCheck size={12} className="text-brand" />
          Powered by Gatehouse · Funds settle into {estate.name}'s own account.
        </div>
      </main>
    </div>
  );
}