// Add or edit a vendor. Captures bank, account number and name, and confirms the
// account holder via Nomba's name lookup (store.resolveAccount →
// POST /vendors/resolve-account) before saving. The bank dropdown carries the
// Nomba bankCode that later payouts to this vendor use, so a verified account can
// actually be paid. Pass a `vendor` to edit an existing one (the dialog prefills
// and calls store.updateVendor); omit it to add. On success the store invalidates
// estate-state so the change shows without a reload.
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { store, useBanksQuery } from "@/lib/store";
import type { Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BadgeCheck, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function VendorDialog({ children, vendor }: { children: React.ReactNode; vendor?: Vendor }) {
  const isEdit = !!vendor;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [account, setAccount] = useState("");
  const [confirmedName, setConfirmedName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const { data: banks = [], isLoading: banksLoading, isError: banksError } = useBanksQuery();

  const bank = banks.find((b) => b.code === bankCode);
  const accountValid = /^\d{10}$/.test(account);
  const canVerify = accountValid && !!bank && !verifying;
  const canSave = !!name.trim() && !!bank && accountValid && !busy;

  // Load the form from the vendor being edited, or blank for a new one. Runs on
  // every open so a reopened dialog reflects the current vendor, not stale edits.
  function hydrate() {
    setName(vendor?.name ?? "");
    setCategory(vendor?.category ?? "");
    setBankCode(vendor?.bankCode ?? "");
    setAccount(vendor?.account ?? "");
    setConfirmedName(null);
    setVerifying(false);
    setBankPickerOpen(false);
  }

  // Selecting a different bank or editing the number invalidates a prior lookup,
  // so clear the confirmation to avoid showing a name that no longer applies.
  const clearConfirmation = () => setConfirmedName(null);

  async function verify() {
    if (!canVerify) return;
    setVerifying(true);
    setConfirmedName(null);
    try {
      const { accountName } = await store.resolveAccount(account, bankCode);
      setConfirmedName(accountName);
      // Prefill the vendor name with the confirmed value so what we save matches
      // the bank's record. Still editable if the manager prefers a display name.
      setName(accountName);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not verify account");
    } finally {
      setVerifying(false);
    }
  }

  async function submit() {
    if (!canSave || !bank) return;
    setBusy(true);
    const payload = {
      name: name.trim(),
      category: category.trim() || "General",
      bankName: bank.name,
      bankCode: bank.code,
      accountNumber: account,
    };
    try {
      if (isEdit) {
        await store.updateVendor(vendor!.id, payload);
        toast.success("Vendor updated");
      } else {
        await store.addVendor(payload);
        toast.success("Vendor added");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : isEdit ? "Could not update vendor" : "Could not add vendor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) hydrate(); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">{isEdit ? "Edit vendor" : "Add vendor"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Bank</Label>
            {/* Searchable combobox: 77+ banks come back from Nomba, so let the
                manager type the bank name (cmdk filters on name; codes are added
                as keywords so a code search works too). */}
            <Popover open={bankPickerOpen} onOpenChange={setBankPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={bankPickerOpen}
                  disabled={banksLoading || banksError}
                  className="w-full justify-between font-normal"
                >
                  <span className={cn("truncate", !bank && "text-muted-foreground")}>
                    {bank ? bank.name : banksLoading ? "Loading banks…" : banksError ? "Couldn't load banks" : "Select bank"}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search bank…" />
                  <CommandList>
                    <CommandEmpty>No bank found.</CommandEmpty>
                    <CommandGroup>
                      {banks.map((b) => (
                        <CommandItem
                          key={b.code}
                          value={b.name}
                          keywords={[b.code]}
                          onSelect={() => { setBankCode(b.code); clearConfirmation(); setBankPickerOpen(false); }}
                        >
                          <Check className={cn("mr-2 size-4", bankCode === b.code ? "opacity-100" : "opacity-0")} />
                          {b.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {banksError && <p className="mt-1 text-xs text-destructive">Couldn't load the bank list — reopen to retry.</p>}
          </div>
          <div>
            <Label>Account number</Label>
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                maxLength={10}
                placeholder="0123456789"
                value={account}
                onChange={(e) => { setAccount(e.target.value.replace(/\D/g, "")); clearConfirmation(); }}
              />
              <Button type="button" variant="outline" disabled={!canVerify} onClick={verify}>
                {verifying ? <Loader2 size={14} className="animate-spin" /> : "Verify"}
              </Button>
            </div>
          </div>
          {confirmedName && (
            <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
              <BadgeCheck size={16} className="shrink-0 text-brand" />
              <span className="text-muted-foreground">Confirmed:</span>
              <span className="font-medium">{confirmedName}</span>
            </div>
          )}
          <div>
            <Label>Vendor name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sentinel Security Ltd" />
          </div>
          <div>
            <Label>Category <span className="text-muted-foreground">(optional)</span></Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Security" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!canSave} onClick={submit}>
            {busy ? (isEdit ? "Saving…" : "Adding…") : isEdit ? "Save changes" : "Add vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
