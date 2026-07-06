import { Card } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold tabular text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground tabular">{sub}</div>}
      {children && <div className="mt-3">{children}</div>}
    </Card>
  );
}