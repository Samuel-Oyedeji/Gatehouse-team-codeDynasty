import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGatehouse, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { Money } from "@/components/gatehouse/money";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { VendorDialog } from "@/components/gatehouse/vendor-dialog";
import type { Vendor } from "@/lib/types";
import { Send, Plus, Pencil, Trash2 } from "lucide-react";
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
        action={
          <div className="flex items-center gap-2">
            <VendorDialog>
              <Button variant="outline"><Plus size={14} className="mr-1.5" />Add vendor</Button>
            </VendorDialog>
            <PayVendorDialog />
          </div>
        }
      />
      <div className="max-h-[420px] overflow-y-auto pr-1 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
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
            {payouts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground tabular">{formatDate(p.date)}</td>
                <td className="px-4 py-3 font-medium">{p.vendorName}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.note}</td>
                <td className="px-4 py-3 text-right tabular"><Money value={p.amount} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    try {
      await store.deleteVendor(vendor.id);
      toast.success(`${vendor.name} removed`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove vendor");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-display text-lg font-semibold">{vendor.name}</div>
          <div className="text-xs text-muted-foreground">{vendor.category} · {vendor.bank}</div>
          <div className="mt-2"><AccountNumber value={vendor.account} size="sm" /></div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total paid</div>
          <div className="font-display text-xl font-semibold tabular"><Money value={vendor.totalPaid} /></div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1 border-t border-border pt-3">
        <VendorDialog vendor={vendor}>
          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit vendor"><Pencil size={15} /></Button>
        </VendorDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Delete vendor">
              <Trash2 size={15} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove {vendor.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes {vendor.name} from your vendor list. Past payouts stay in your history and the transparency report. You can add them again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); remove(); }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Removing…" : "Remove vendor"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

function PayVendorDialog() {
  const { vendors } = useGatehouse();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(vendors[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const selected = vendors.find((v) => v.id === vendor);

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
            {/* Echo the recipient's name and account so the manager can eyeball
                who they're paying before confirming the transfer. */}
            {selected && (
              <div className="mt-2 rounded-md bg-secondary px-3 py-2.5 text-sm">
                <div className="font-medium">{selected.name}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{selected.bank}</span>
                  <span>·</span>
                  <AccountNumber value={selected.account} size="sm" />
                </div>
              </div>
            )}
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