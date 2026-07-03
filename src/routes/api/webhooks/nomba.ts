// Nomba inbound webhook (PRD §7.3). Verifies the HmacSHA256 `nomba-signature`,
// acknowledges fast, and dispatches by event_type. Idempotent on the Nomba
// transaction reference. Server-only route (no component).
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhooks/nomba")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("nomba-signature") ?? "";
        const nombaTimestamp = request.headers.get("nomba-timestamp") ?? "";

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const { verifyNombaSignature } = await import("@/lib/server/nomba");
        if (!verifyNombaSignature(payload, signature, nombaTimestamp)) {
          return new Response("Invalid signature", { status: 401 });
        }

        // Process, but always acknowledge so Nomba doesn't hammer retries.
        try {
          await dispatch(payload);
        } catch (err) {
          console.error("[webhook] processing error", err);
        }
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

async function dispatch(payload: any) {
  const eventType: string = payload?.event_type;
  const tx = payload?.data?.transaction ?? {};

  if (eventType === "payment_success") {
    const { ingestInboundPayment } = await import("@/lib/server/ingest");
    const { nairaToKobo } = await import("@/lib/money");
    const customer = payload?.data?.customer ?? {};
    await ingestInboundPayment({
      nombaTxnRef: tx.transactionId,
      accountRef: tx.aliasAccountReference ?? null,
      accountNumber: tx.aliasAccountNumber ?? null,
      amountKobo: nairaToKobo(Number(tx.transactionAmount)),
      sourceName: customer.senderName ?? "Unknown sender",
      sourceAccount: customer.accountNumber ?? null,
      receivedAt: tx.time ? new Date(tx.time).getTime() : Date.now(),
      rawPayload: payload,
    });
    return;
  }

  if (eventType === "payout_success" || eventType === "payout_failed" || eventType === "payout_refund") {
    const { prisma } = await import("@/lib/server/db");
    const { broadcast } = await import("@/lib/server/events");
    const status = eventType === "payout_success" ? "SUCCESS" : eventType === "payout_refund" ? "REVERSED" : "FAILED";
    const payout = await prisma.payout.findFirst({
      where: { OR: [{ nombaTxnRef: tx.transactionId }, { merchantTxRef: tx.merchantTxRef ?? "" }] },
    });
    if (payout) {
      await prisma.payout.update({ where: { id: payout.id }, data: { status } });
      broadcast(payout.estateId, "payout");
    }
    return;
  }

  // payment_reversal / payment_failed — logged; extend as needed.
  console.info(`[webhook] unhandled event_type=${eventType}`);
}
