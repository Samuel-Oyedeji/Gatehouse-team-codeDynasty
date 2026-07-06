import { createFileRoute } from "@tanstack/react-router";
import { fetchEstateTransparency } from "@/lib/api";
import { Money } from "@/components/gatehouse/money";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/public/$estateId")({
  loader: ({ params }) => fetchEstateTransparency({ data: { estateId: params.estateId } }),
  component: PublicTransparencyPage,
});

function PublicTransparencyPage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">Estate not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This link is invalid or the estate no longer exists.</p>
        </div>
      </div>
    );
  }

  const { estate, collected, spent, byCategory } = data;
  const total = byCategory.reduce((a, c) => a + c.amount, 0);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-card">
        <div className="max-w-xl mx-auto px-5 py-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{estate.city}</div>
          <h1 className="font-display text-2xl font-semibold mt-1">{estate.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Financial transparency report</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Collected</div>
            <div className="mt-2 font-display text-xl font-semibold tabular text-ink">
              <Money value={collected} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Resident dues</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Spent</div>
            <div className="mt-2 font-display text-xl font-semibold tabular text-ink">
              <Money value={spent} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Paid to vendors</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Balance</div>
            <div className="mt-2 font-display text-xl font-semibold tabular text-ink">
              <Money value={collected - spent} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Unspent</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <div className="font-display text-base font-semibold">Where the money went</div>
            <p className="mt-0.5 text-sm text-muted-foreground">Breakdown of spending by service category</p>
          </div>
          {byCategory.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No spending recorded yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {byCategory
                .sort((a, b) => b.amount - a.amount)
                .map((c) => {
                  const pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
                  return (
                    <li key={c.category} className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium capitalize">{c.category}</div>
                        <div className="text-xs text-muted-foreground">{pct}% of spending</div>
                      </div>
                      <div className="font-display font-semibold tabular text-ink"><Money value={c.amount} /></div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 py-2">
          <ShieldCheck size={12} className="text-brand" />
          Powered by Gatehouse · Funds settle into {estate.name}'s own account.
        </div>
      </main>
    </div>
  );
}
