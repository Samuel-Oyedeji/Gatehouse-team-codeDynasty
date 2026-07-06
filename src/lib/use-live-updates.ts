import { useEffect } from "react";
import { getQueryClient } from "./query-client";
import { apiUrl, getToken, getEstateId } from "./http";
import { fetchStreamTicket } from "./api";

// Subscribes to the NestJS SSE stream and invalidates cached queries whenever the
// estate changes (a payment lands, an exception resolves, a payout posts), so the
// dashboard updates without a manual refresh (PRD §8). EventSource can't set
// Authorization headers, so each connection is authenticated with a short-lived
// stream ticket in the URL — never the long-lived API JWT. Because that ticket
// expires in ~60s, we drive reconnection ourselves and mint a fresh ticket each
// time rather than letting EventSource silently retry the stale URL.
export function useLiveUpdates() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;
    if (!getToken() || !getEstateId()) return;

    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let closed = false;

    async function connect() {
      const estateId = getEstateId();
      if (closed || !estateId) return;

      let ticket: string;
      try {
        ticket = await fetchStreamTicket();
      } catch {
        // Couldn't mint a ticket (server down, API token expired) — back off, retry.
        if (!closed) reconnectTimer = setTimeout(connect, 5000);
        return;
      }
      if (closed) return;

      const url = apiUrl(
        `/stream?token=${encodeURIComponent(ticket)}&estateId=${encodeURIComponent(estateId)}`,
      );
      es = new EventSource(url);
      es.onmessage = () => getQueryClient().invalidateQueries();
      es.onerror = () => {
        // The ticket may have expired; drop this connection and reconnect with a
        // fresh one instead of letting EventSource retry the now-stale URL.
        es?.close();
        es = null;
        if (!closed) reconnectTimer = setTimeout(connect, 3000);
      };
    }

    void connect();

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      es?.close();
    };
  }, []);
}
