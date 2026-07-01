import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useGatehouse, store } from "@/lib/store";
import { KpiCard } from "@/components/gatehouse/kpi-card";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UnitDetailSheet } from "@/components/gatehouse/unit-detail-sheet";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Send, FilePlus2, Wallet } from "lucide-react";
import { relTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { units, activity, recentlyChanged, cycle } = useGatehouse();
  const [openUnit, setOpenUnit] = useState<string | null>(null);

  const stats = useMemo(() => {
    const billed = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.amount, 0), 0);
    const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
    const outstanding = billed - collected;
    const paid = units.filter((u) => u.status === "paid" || u.status === "credit").length;
    const partial = units.filter((u) => u.status === "partial").length;
    const unpaid = units.filter((u) => u.status === "overdue").length;
    const rate = billed > 0 ? Math.round((collected / billed) * 100) : 0;
    return { billed, collected, outstanding, paid, partial, unpaid, rate };
  }, [units]);

  const blocks = ["A", "B", "C", "D"];

  return (
    <>
      <SectionHeader
        title={`Dashboard — ${cycle}`}
        sub="Every payment lands here the moment it clears."
        action={
          <div className="flex gap-2">
            <Button onClick={() => toast.success("Billing run started for this cycle")}><FilePlus2 size={14} className="mr-1.5" />Bill this cycle</Button>
            <Button variant="outline" onClick={() => toast("Record manual payment")}><Wallet size={14} className="mr-1.5" />Record a payment</Button>
            <Button variant="outline" onClick={() => toast("Pay a vendor")}><Send size={14} className="mr-1.5" />Pay a vendor</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Collected this cycle"
          value={<Money value={stats.collected} />}
          sub={<>of <Money value={stats.billed} /> billed</>}
        />
        <KpiCard
          label="Collection rate"
          value={`${stats.rate}%`}
        >
          <Progress value={stats.rate} className="h-1.5" />
        </KpiCard>
        <KpiCard
          label="Outstanding"
          value={<Money value={stats.outstanding} />}
          sub={`${stats.unpaid + stats.partial} units behind`}
        />
        <KpiCard
          label="Units status"
          value={`${stats.paid}/${units.length}`}
          sub={`${stats.paid} paid · ${stats.partial} partial · ${stats.unpaid} unpaid`}
        >
          <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
            <div style={{ width: `${(stats.paid / units.length) * 100}%`, backgroundColor: "#10B981" }} />
            <div style={{ width: `${(stats.partial / units.length) * 100}%`, backgroundColor: "#F59E0B" }} />
            <div style={{ width: `${(stats.unpaid / units.length) * 100}%`, backgroundColor: "#F43F5E" }} />
          </div>
        </KpiCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Unit status</h2>
            <div className="text-xs text-muted-foreground">Click any unit to open its statement.</div>
          </div>
          <div className="space-y-5">
            {blocks.map((blk) => {
              const blkUnits = units.filter((u) => u.block === blk);
              return (
                <div key={blk}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-ink">Block {blk}</h3>
                    <span className="text-xs text-muted-foreground">{blkUnits.length} units</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {blkUnits.map((u) => {
                      const flashing = !!recentlyChanged[u.id];
                      const tone = {
                        paid: "border-[#A7F3D0] bg-[#ECFDF5]",
                        partial: "border-[#FDE68A] bg-[#FFFBEB]",
                        overdue: "border-[#FECDD3] bg-[#FFF1F2]",
                        unbilled: "border-border bg-secondary",
                        credit: "border-[#C7D2FE] bg-[#EEF2FF]",
                      }[u.status];
                      return (
                        <button
                          key={u.id}
                          onClick={() => setOpenUnit(u.id)}
                          className={`text-left rounded-xl border p-3 transition-all hover:shadow-sm ${tone} ${flashing ? "pulse-flash ring-2 ring-brand" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-display text-base font-semibold text-ink">{u.label}</div>
                            <StatusPill kind={u.status} />
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground truncate">{u.occupant.split(" ")[0]}</div>
                          <div className="mt-1 text-sm font-medium tabular text-ink">
                            {u.balance > 0 ? <>owing <Money value={u.balance} /></> : u.credit > 0 ? <span className="text-[#4338CA]">+<Money value={u.credit} /></span> : <span className="text-[#047857]">settled</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Activity</h2>
          {activity.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing yet. New payments will appear here as they clear.</p>
          )}
          <ol className="space-y-3">
            {activity.slice(0, 12).map((a) => (
              <li
                key={a.id}
                className="flex gap-3 cursor-pointer rounded-md p-2 -mx-2 hover:bg-secondary"
                onClick={() => a.unitId && setOpenUnit(a.unitId)}
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-brand shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-ink">{a.message}</div>
                  <div className="text-xs text-muted-foreground tabular">{relTime(a.timestamp)}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
            Tip: click "Simulate payment" in the top bar to fire a fake transfer.
            {" "}
            <button onClick={() => store.reset()} className="text-brand underline">Reset demo</button>
          </div>
        </Card>
      </div>

      <UnitDetailSheet unitId={openUnit} onOpenChange={(v) => !v && setOpenUnit(null)} />
    </>
  );
}