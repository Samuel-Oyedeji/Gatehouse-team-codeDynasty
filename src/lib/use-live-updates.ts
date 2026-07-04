import { useEffect } from "react";
import { getQueryClient } from "./query-client";
import { apiUrl, getToken, getEstateId } from "./http";

// Subscribes to the NestJS SSE stream and invalidates cached queries whenever the
// estate changes (a payment lands, an exception resolves, a payout posts), so the
// dashboard updates without a manual refresh (PRD §8). The JWT + estate id go as
// query params because EventSource can't set Authorization headers.
export function useLiveUpdates() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;
    const token = getToken();
    const estateId = getEstateId();
    if (!token || !estateId) return;

    const url = apiUrl(`/stream?token=${encodeURIComponent(token)}&estateId=${encodeURIComponent(estateId)}`);
    const es = new EventSource(url);
    es.onmessage = () => {
      getQueryClient().invalidateQueries();
    };
    return () => es.close();
  }, []);
}
