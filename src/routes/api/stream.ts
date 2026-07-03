// Server-sent events stream (PRD §11 real-time). Emits an event whenever the
// signed-in user's estate changes; the client invalidates its estate-state query.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stream")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getCurrentUser } = await import("@/lib/server/session");
        const user = await getCurrentUser();
        if (!user) return new Response("Unauthorized", { status: 401 });
        const estateId = user.estateId;
        const { subscribe } = await import("@/lib/server/events");

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            const send = (data: unknown) => {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              } catch {
                /* stream closed */
              }
            };
            send({ type: "connected", at: Date.now() });
            const unsubscribe = subscribe(estateId, (e) => send(e));
            const heartbeat = setInterval(() => {
              try {
                controller.enqueue(encoder.encode(`: ping\n\n`));
              } catch {
                /* ignore */
              }
            }, 25_000);
            const close = () => {
              clearInterval(heartbeat);
              unsubscribe();
              try {
                controller.close();
              } catch {
                /* already closed */
              }
            };
            request.signal.addEventListener("abort", close);
          },
        });

        return new Response(stream, {
          headers: {
            "content-type": "text/event-stream",
            "cache-control": "no-cache, no-transform",
            connection: "keep-alive",
          },
        });
      },
    },
  },
});
