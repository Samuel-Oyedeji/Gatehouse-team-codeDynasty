import { useEffect } from "react";
import { getQueryClient } from "./query-client";

// Subscribes to the server's SSE stream and invalidates cached queries whenever
// the estate changes (a payment lands, an exception resolves, a payout posts),
// so the dashboard/grid/activity update without a manual refresh (PRD §8).
export function useLiveUpdates() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;
    const es = new EventSource("/api/stream");
    es.onmessage = () => {
      getQueryClient().invalidateQueries();
    };
    // On error the browser auto-reconnects; nothing to do.
    return () => es.close();
  }, []);
}
