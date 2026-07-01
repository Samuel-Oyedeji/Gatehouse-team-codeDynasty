import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGatehouse, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Money } from "@/components/gatehouse/money";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/vendors")({
  component: VendorsPage,
});

function VendorsPage() {
  const { vendors, payouts } = useGatehouse();

  return (
    <>
      <SectionHeader
        title="Vendors & Payouts"
        sub="The money-out side. Every payout feeds the transparency report."
        action={<PayVendorDialog />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {vendors.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.category} · {v.bank}</div>
                <div className="mt-2"><AccountNumber value={v.account} size="sm" /></div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Paid this cycle</div>
                <div className="font-display text-xl font-semibold tabular"><Money value={v.totalPaid} /></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-border font-medium">Payout history</div>
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Vendor</th>
              <th className="px-4 py-2.5 font-medium">Note</th>
              <th className="px-4 py-2.5 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => {
              const v = vendors.find((x) => x.id === p.vendorId)!;
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground tabular">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.note}</td>
                  <td className="px-4 py-3 text-right tabular"><Money value={p.amount} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function PayVendorDialog() {
  const { vendors } = useGatehouse();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(vendors[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Send size={14} className="mr-1.5" />Pay vendor</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Pay vendor</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Vendor</Label>
            <Select value={vendor} onValueChange={setVendor}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.name} — {v.category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Amount (₦)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div><Label>Note</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="August security" /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={!vendor || !amount}
            onClick={() => {
              store.payVendor(vendor, Number(amount), note || "Payout");
              setOpen(false); setAmount(""); setNote("");
              toast.success("Payout sent");
            }}
          >Confirm payout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}