import { createFileRoute } from "@tanstack/react-router";
import { useGatehouse } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { KpiCard } from "@/components/gatehouse/kpi-card";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { Download, Link2 } from "lucide-react";
import { ngn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { units, vendors, payouts, cycle } = useGatehouse();
  const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
  const spent = payouts.reduce((a, p) => a + p.amount, 0);
  const arrears = units.filter((u) => u.balance > 0).sort((a, b) => b.balance - a.balance);

  const byCategory = vendors.map((v) => ({
    name: v.category,
    amount: payouts.filter((p) => p.vendorId === v.id).reduce((a, p) => a + p.amount, 0),
  }));

  const trend = [
    { week: "W1", collected: 380000 },
    { week: "W2", collected: 720000 },
    { week: "W3", collected: 480000 },
    { week: "W4", collected: 350000 },
    { week: "W5", collected: 280000 },
    { week: "W6", collected: 220000 },
  ];

  return (
    <>
      <SectionHeader title={`Reports — ${cycle}`} sub="Money in versus money out, plus a public view for residents." />
      <Tabs defaultValue="financials">
        <TabsList>
          <TabsTrigger value="financials">Estate financials</TabsTrigger>
          <TabsTrigger value="public">Public transparency view</TabsTrigger>
        </TabsList>

        <TabsContent value="financials" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard label="Total collected" value={<Money value={collected} />} />
            <KpiCard label="Total spent" value={<Money value={spent} />} />
            <KpiCard label="Balance" value={<Money value={collected - spent} />} sub="Sitting in estate account" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="font-display text-base font-semibold mb-4">Spending by category</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
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
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
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
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/public`); toast.success("Public link copied"); }}>
              <Link2 size={14} className="mr-1.5" />Copy public link
            </Button>
          </div>
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="text-sm text-muted-foreground">Maple Court · {cycle}</div>
            <h2 className="font-display text-3xl font-semibold mt-2">Where your dues went</h2>
            <p className="mt-4 text-ink leading-relaxed">
              This quarter, residents paid <span className="font-semibold tabular"><Money value={collected} /></span>{" "}
              in service charges. We spent <span className="font-semibold tabular"><Money value={spent} /></span>{" "}
              keeping the estate running.
            </p>
            <div className="mt-6 space-y-3">
              {byCategory.map((c) => (
                <div key={c.name} className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{Math.round((c.amount / spent) * 100)}% of spending</div>
                  </div>
                  <div className="font-display text-lg font-semibold tabular"><Money value={c.amount} /></div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}