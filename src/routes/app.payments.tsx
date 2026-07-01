import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useGatehouse } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Search, Download } from "lucide-react";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { payments, units } = useGatehouse();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => payments
    .filter((p) => status === "all" || p.status === status)
    .filter((p) => !q || p.sender.toLowerCase().includes(q.toLowerCase())),
  [payments, q, status]);

  const unitLookup = useMemo(() => new Map(units.map((u) => [u.id, u])), [units]);

  return (
    <>
      <SectionHeader title="Payments" sub="Every incoming transfer across the estate, newest first." />
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap gap-3 p-4 border-b border-border bg-card">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by sender" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overpayment">Overpayment</SelectItem>
              <SelectItem value="exception">Exception</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.success("CSV export ready")}><Download size={14} className="mr-1.5" />Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Unit</th>
                <th className="px-4 py-2.5 font-medium">Sender</th>
                <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const u = p.unitId ? unitLookup.get(p.unitId) : null;
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="px-4 py-3 text-muted-foreground tabular">{formatDate(p.timestamp)}</td>
                    <td className="px-4 py-3">
                      {u ? <span className="font-medium">{u.label}</span> : (
                        <Link to="/app/exceptions" className="text-[#BE123C] font-medium">Unmatched →</Link>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.sender}</td>
                    <td className="px-4 py-3 text-right tabular"><Money value={p.amount} /></td>
                    <td className="px-4 py-3"><StatusPill kind={p.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.allocation}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No payments match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}