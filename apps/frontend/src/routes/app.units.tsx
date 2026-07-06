import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useGatehouse } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { Money } from "@/components/gatehouse/money";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { UnitDetailSheet } from "@/components/gatehouse/unit-detail-sheet";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { AddUnitDialog } from "@/components/gatehouse/add-unit-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { Search, Plus } from "lucide-react";

export const Route = createFileRoute("/app/units")({
  component: UnitsPage,
});

function UnitsPage() {
  const { units, groups } = useGatehouse();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => units.filter((u) => {
    if (group !== "all" && (group === "ungrouped" ? u.groupId != null : u.groupId !== group)) return false;
    if (status !== "all" && u.status !== status) return false;
    if (q && !`${u.label} ${u.occupant}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [units, q, group, status]);

  return (
    <>
      <SectionHeader
        title="Units"
        sub={`${units.length} units${groups.length ? ` · ${groups.length} groups` : ""}.`}
        action={
          <AddUnitDialog>
            <Button><Plus size={14} className="mr-1.5" />Add unit</Button>
          </AddUnitDialog>
        }
      />
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap gap-3 p-4 border-b border-border bg-card">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by unit or occupant" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              <SelectItem value="ungrouped">Ungrouped</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground sticky top-0">
              <tr>
                <th className="px-4 py-2.5 font-medium">Unit</th>
                <th className="px-4 py-2.5 font-medium">Occupant</th>
                <th className="px-4 py-2.5 font-medium">Account number</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium text-right">Balance</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Last payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} onClick={() => setOpen(u.id)} className="border-t border-border cursor-pointer hover:bg-brand-tint">
                  <td className="px-4 py-3 font-display font-semibold">{u.label}</td>
                  <td className="px-4 py-3">
                    <div className="text-ink">{u.occupant}</div>
                    <div className="text-xs text-muted-foreground">{u.phone}</div>
                  </td>
                  <td className="px-4 py-3"><AccountNumber value={u.accountNumber} /></td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{u.occupantType}</td>
                  <td className="px-4 py-3 text-right tabular">
                    {u.credit > 0 ? <span className="text-[#4338CA]">+<Money value={u.credit} /></span> : <Money value={u.balance} />}
                  </td>
                  <td className="px-4 py-3"><StatusPill kind={u.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground tabular">{u.lastPaymentAt ? formatDate(u.lastPaymentAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <UnitDetailSheet unitId={open} onOpenChange={(v) => !v && setOpen(null)} />
    </>
  );
}