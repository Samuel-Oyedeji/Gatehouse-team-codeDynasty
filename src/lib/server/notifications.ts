// Notification interface (server-only). Stubbed behind an interface for the
// hackathon (logs to the console); swap in a real SMS/WhatsApp/email provider by
// implementing Notifier and setting NOTIFY_PROVIDER.
import { formatNaira } from "../money";

export interface Notifier {
  billIssued(to: { name: string; phone?: string }, ctx: { unitLabel: string; amountKobo: number; dueDate: number; accountNumber?: string }): Promise<void>;
  receipt(to: { name: string; phone?: string }, ctx: { unitLabel: string; amountKobo: number; balanceKobo: number }): Promise<void>;
  arrears(to: { name: string; phone?: string }, ctx: { unitLabel: string; outstandingKobo: number }): Promise<void>;
}

class LoggingNotifier implements Notifier {
  async billIssued(to: { name: string; phone?: string }, ctx: { unitLabel: string; amountKobo: number; dueDate: number; accountNumber?: string }) {
    console.info(`[notify] BILL → ${to.name} (${to.phone ?? "no phone"}): ${ctx.unitLabel} owes ${formatNaira(ctx.amountKobo)}, pay into ${ctx.accountNumber ?? "your unit account"}.`);
  }
  async receipt(to: { name: string; phone?: string }, ctx: { unitLabel: string; amountKobo: number; balanceKobo: number }) {
    console.info(`[notify] RECEIPT → ${to.name}: received ${formatNaira(ctx.amountKobo)} for ${ctx.unitLabel}. Balance ${formatNaira(ctx.balanceKobo)}.`);
  }
  async arrears(to: { name: string; phone?: string }, ctx: { unitLabel: string; outstandingKobo: number }) {
    console.info(`[notify] ARREARS → ${to.name}: ${ctx.unitLabel} still owes ${formatNaira(ctx.outstandingKobo)}.`);
  }
}

// Only the logging notifier ships today; a provider-backed one plugs in here.
export const notifier: Notifier = new LoggingNotifier();
