// In-process pub/sub for real-time dashboard updates. The ingest/payout/resolve
// services broadcast a change for an estate; the SSE route (/api/stream)
// subscribes and forwards, and the client invalidates its estate-state query.
type Listener = (event: { type: string; at: number }) => void;

const listeners = new Map<string, Set<Listener>>();

export function subscribe(estateId: string, cb: Listener): () => void {
  let set = listeners.get(estateId);
  if (!set) {
    set = new Set();
    listeners.set(estateId, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
    if (set!.size === 0) listeners.delete(estateId);
  };
}

export function broadcast(estateId: string, type: string): void {
  const set = listeners.get(estateId);
  if (!set) return;
  const event = { type, at: Date.now() };
  for (const cb of set) {
    try {
      cb(event);
    } catch (err) {
      console.error("[events] listener error", err);
    }
  }
}
