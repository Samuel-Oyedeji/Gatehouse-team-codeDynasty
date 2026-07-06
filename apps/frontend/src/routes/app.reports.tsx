import { createFileRoute } from "@tanstack/react-router";
import { useGatehouse } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { KpiCard } from "@/components/gatehouse/kpi-card";
import { AccountBalanceCard } from "@/components/gatehouse/account-balance-card";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { Download, Link2 } from "lucide-react";
import { ngn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

function fmtAxis(v: number): string {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (v >= 1_000) return `₦${Math.round(v / 1_000)}k`;
  return `₦${Math.round(v)}`;
}

function ReportsPage() {
  const { units, vendors, payouts, payments, estate } = useGatehouse();
  const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
  const spent = payouts.reduce((a, p) => a + p.amount, 0);
  const arrears = units.filter((u) => u.balance > 0).sort((a, b) => b.balance - a.balance);

  const byCategory = vendors.map((v) => ({
    name: v.category,
    amount: payouts.filter((p) => p.vendorId === v.id).reduce((a, p) => a + p.amount, 0),
  }));

  // Real collection-over-time: sum non-exception payments per day (last 8 days seen).
  const byDay = new Map<string, number>();
  for (const p of payments) {
    if (p.status === "exception") continue;
    const d = new Date(p.timestamp);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    byDay.set(key, (byDay.get(key) ?? 0) + p.amount);
  }
  const trend = [...byDay.entries()]
    .sort((a, b) => {
      const [am, ad] = a[0].split("/").map(Number);
      const [bm, bd] = b[0].split("/").map(Number);
      return am !== bm ? am - bm : ad - bd;
    })
    .slice(-8)
    .map(([week, amount]) => ({ week, collected: amount }));

  return (
    <>
      <SectionHeader title="Reports" sub="Money in versus money out, plus a public view for residents." />
      <Tabs defaultValue="financials">
        <TabsList>
          <TabsTrigger value="financials">Estate financials</TabsTrigger>
          <TabsTrigger value="public">Public transparency view</TabsTrigger>
        </TabsList>

        <TabsContent value="financials" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total collected" value={<Money value={collected} />} />
            <KpiCard label="Total spent" value={<Money value={spent} />} />
            <KpiCard label="Balance" value={<Money value={collected - spent} />} sub="Expected — collected minus spent" />
            <AccountBalanceCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="font-display text-base font-semibold mb-4">Spending by category</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={fmtAxis} />
                  <Tooltip formatter={(v: number) => ngn(v)} />
                  <Bar dataKey="amount" fill="#0F766E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6">
              <div className="font-display text-base font-semibold mb-4">Collection over time</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={fmtAxis} />
                  <Tooltip formatter={(v: number) => ngn(v)} />
                  <Line type="monotone" dataKey="collected" stroke="#0F766E" strokeWidth={2} dot={{ fill: "#0F766E" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="font-medium">Arrears report</div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Arrears CSV exported")}><Download size={14} className="mr-1.5" />Export</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Unit</th>
                  <th className="px-4 py-2.5 font-medium">Occupant</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium text-right">Owed</th>
                </tr>
              </thead>
              <tbody>
                {arrears.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{u.label}</td>
                    <td className="px-4 py-3">{u.occupant}</td>
                    <td className="px-4 py-3"><StatusPill kind={u.status} /></td>
                    <td className="px-4 py-3 text-right tabular"><Money value={u.balance} /></td>
                  </tr>
                ))}
                {arrears.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No outstanding balances. Beautiful.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Share this link with residents so they can see how their dues were spent.</p>
            <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/public/${estate.id}`); toast.success("Public link copied"); }}>
              <Link2 size={14} className="mr-1.5" />Copy public link
            </Button>
          </div>
          <Card className="max-w-2xl mx-auto overflow-hidden p-0">
            <div className="px-6 py-5 border-b border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{estate.name} · Preview</div>
              <h2 className="font-display text-2xl font-semibold mt-1">Where your dues went</h2>
              <p className="mt-2 text-sm text-ink leading-relaxed">
                Residents paid <span className="font-semibold tabular"><Money value={collected} /></span>{" "}
                this cycle. We spent <span className="font-semibold tabular"><Money value={spent} /></span> keeping the estate running.
              </p>
            </div>
            {byCategory.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No spending recorded yet.</div>
            ) : (
              <ul className="divide-y divide-border">
                {[...byCategory].sort((a, b) => b.amount - a.amount).map((c) => {
                  const pct = spent > 0 ? Math.round((c.amount / spent) * 100) : 0;
                  return (
                    <li key={c.name} className="px-6 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium capitalize">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{pct}% of spending</div>
                      </div>
                      <div className="font-display font-semibold tabular text-ink"><Money value={c.amount} /></div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}