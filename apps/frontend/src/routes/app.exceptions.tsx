import { createFileRoute } from "@tanstack/react-router";
import { useGatehouse, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Money } from "@/components/gatehouse/money";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { relTime } from "@/lib/format";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exceptions")({
  component: ExceptionsPage,
});

function ExceptionsPage() {
  const { exceptions, payments, units } = useGatehouse();

  return (
    <>
      <SectionHeader title="Exceptions" sub="Payments that need a quick human decision." />
      {exceptions.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 font-display text-xl font-semibold">All clear.</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every payment is attributed.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {exceptions.map((ex) => {
            const p = payments.find((x) => x.id === ex.paymentId)!;
            const u = p.unitId ? units.find((x) => x.id === p.unitId) : null;
            return (
              <ExceptionCard key={ex.id} ex={ex} payment={p} unit={u} />
            );
          })}
        </div>
      )}
    </>
  );
}

function ExceptionCard({ ex, payment, unit }: any) {
  const { units } = useGatehouse();
  const [target, setTarget] = useState<string>(ex.candidateUnitId ?? "");
  const [refundOpen, setRefundOpen] = useState(false);

  const refundAmount = payment.surplusAmount ?? payment.amount;

  return (
    <>
      <AlertDialog open={refundOpen} onOpenChange={setRefundOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm refund</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p>The following transfer will be sent via Nomba immediately and cannot be undone.</p>
                <div className="rounded-md border bg-muted/40 p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold tabular text-ink"><Money value={refundAmount} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-medium text-ink">{payment.sender}</span>
                  </div>
                  {payment.sourceAccount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium text-ink tabular">{payment.sourceAccount}</span>
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                store.resolveException(ex.id, "refund");
                toast.success("Refund sent");
              }}
            >
              Send refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusPill kind={ex.type} />
              <span className="text-xs text-muted-foreground tabular">{relTime(payment.timestamp)}</span>
            </div>
            <div className="font-display text-lg font-semibold tabular text-ink">
              <Money value={payment.amount} /> from <span className="font-sans">{payment.sender}</span>
            </div>
            {unit && <div className="mt-1 text-sm text-muted-foreground">Received into <span className="font-medium text-ink">{unit.label}</span> · {unit.occupant}</div>}
            <div className="mt-2 text-sm text-ink">{ex.suggestion}</div>
          </div>
          <div className="shrink-0 w-72 space-y-2">
            {ex.type === "overpayment" && (
              <>
                <Button className="w-full" onClick={() => { store.resolveException(ex.id, "credit"); toast.success("Surplus moved to credit balance"); }}>
                  Move surplus to credit
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setRefundOpen(true)}>
                  Issue refund
                </Button>
              </>
            )}
            {ex.type === "duplicate" && (
              <>
                <Button className="w-full" onClick={() => { store.resolveException(ex.id, "duplicate-hold"); toast.success("Held as duplicate"); }}>
                  Confirm duplicate, hold
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { store.resolveException(ex.id, "duplicate-keep"); toast.success("Treated as a separate payment"); }}>
                  Treat as separate payment
                </Button>
              </>
            )}
            {ex.type === "misdirected" && (
              <>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Choose correct unit" /></SelectTrigger>
                  <SelectContent>
                    {units.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.label} — {u.occupant}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button className="w-full" disabled={!target} onClick={() => { store.resolveException(ex.id, "reassign", target); toast.success("Reassigned to the correct unit"); }}>
                  Reassign payment
                </Button>
              </>
            )}
            {ex.type === "third_party" && (
              <>
                <Button className="w-full" onClick={() => { store.resolveException(ex.id, "attribute"); toast.success("Attributed and tagged as paid on behalf"); }}>
                  Attribute to {unit?.label} (paid on behalf)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setRefundOpen(true)}>
                  Issue refund
                </Button>
              </>
            )}
            {ex.type === "reversal" && (
              <Button className="w-full" onClick={() => { store.resolveException(ex.id, "acknowledge"); toast.success("Reversal acknowledged"); }}>
                Acknowledge (balance adjusted)
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}