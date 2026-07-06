import { KpiCard } from "./kpi-card";
import { Money } from "./money";
import { useAccountBalanceQuery } from "@/lib/store";
import { relTime } from "@/lib/format";

// Live float in the shared Nomba settlement sub-account — the real money on
// hand, distinct from the ledger-derived "collected − spent" figure. Degrades
// to a fallback when Nomba is unconfigured/unreachable (available === false).
export function AccountBalanceCard() {
  const { data, isLoading } = useAccountBalanceQuery();
  const ready = data?.available && data.amountNaira != null;

  return (
    <KpiCard
      label="Nomba account balance"
      value={ready ? <Money value={data!.amountNaira!} /> : isLoading ? "…" : "—"}
      sub={
        ready
          ? `Live settlement-account float · updated ${relTime(data!.asOf ?? Date.now())}`
          : isLoading
            ? "Fetching from Nomba…"
            : "Unavailable — check Nomba connection"
      }
    />
  );
}
