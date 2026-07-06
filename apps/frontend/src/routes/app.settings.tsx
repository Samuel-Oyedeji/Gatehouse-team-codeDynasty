import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { useGatehouse } from "@/lib/store";
import { updateEstateFn, updateFeeStructureFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { estate, allocationRule } = useGatehouse();

  return (
    <>
      <SectionHeader title="Settings" />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Estate</TabsTrigger>
          <TabsTrigger value="rules">Allocation rules</TabsTrigger>
          <TabsTrigger value="notif">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="nomba">Nomba</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <EstateTab
            key={estate.id}
            initial={{ name: estate.name, address: estate.address, city: estate.city }}
          />
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <RulesTab key={allocationRule} initial={allocationRule} />
        </TabsContent>

        <TabsContent value="notif" className="mt-4">
          <Card className="p-6 max-w-2xl space-y-4">
            <div>
              <Label>Bill notification</Label>
              <Textarea defaultValue="Hi {name}, your {cycle} service charge of ₦{amount} is now due. Transfer to {account} from any bank app — your payment is recorded automatically." rows={3} />
            </div>
            <div>
              <Label>Payment receipt</Label>
              <Textarea defaultValue="Thank you {name}. We received ₦{amount} for {cycle}. {remaining_message}" rows={3} />
            </div>
            <div>
              <Label>Arrears reminder</Label>
              <Textarea defaultValue="Hi {name}, you still owe ₦{balance} on {cycle}. Transfer to {account} to settle." rows={3} />
            </div>
            <Button onClick={() => toast.success("Templates updated")}>Save templates</Button>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="p-6 max-w-xl space-y-4">
            <div className="text-sm">
              <div className="font-medium">Estate treasurer</div>
              <div className="text-muted-foreground">Treasurer · you</div>
            </div>
            <div>
              <Label>Invite a co-manager by email</Label>
              <Input placeholder="name@email.com" />
            </div>
            <Button onClick={() => toast.success("Invitation sent")}>Send invite</Button>
          </Card>
        </TabsContent>

        <TabsContent value="nomba" className="mt-4">
          <Card className="p-6 max-w-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-brand h-6 w-6" />
              <div>
                <div className="font-medium">Connected</div>
                <div className="text-sm text-muted-foreground">Payments settle directly into {estate.name}'s Nomba business account.</div>
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => toast("Manage connection in Nomba dashboard")}>Manage connection</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function EstateTab({ initial }: { initial: { name: string; address: string; city: string } }) {
  const [name, setName] = useState(initial.name);
  const [address, setAddress] = useState(initial.address);
  const [city, setCity] = useState(initial.city);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await updateEstateFn({ data: { name, address, city } });
      await getQueryClient().invalidateQueries();
      toast.success("Estate details saved");
    } catch {
      toast.error("Could not save");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="p-6 max-w-xl space-y-4">
      <div><Label>Estate name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
      <div><Label>City / State</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
      <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
    </Card>
  );
}

function RulesTab({ initial }: { initial: "OLDEST_FIRST" | "DUES_FIRST" }) {
  const [value, setValue] = useState(initial === "DUES_FIRST" ? "dues" : "oldest");
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await updateFeeStructureFn({ data: { allocationRule: value === "dues" ? "DUES_FIRST" : "OLDEST_FIRST" } });
      await getQueryClient().invalidateQueries();
      toast.success("Allocation rule saved");
    } catch {
      toast.error("Could not save");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="p-6 max-w-xl">
      <Label className="mb-3 block">When a payment arrives and the unit owes more than one thing, apply it…</Label>
      <RadioGroup value={value} onValueChange={setValue} className="space-y-3">
        <RadioOption value="oldest" title="Oldest charge first" desc="Clears the most overdue item before newer ones. Recommended." />
        <RadioOption value="dues" title="Dues before levies" desc="Always settle the recurring service charge first, then one-off levies." />
      </RadioGroup>
      <Button className="mt-4" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
    </Card>
  );
}

function RadioOption({ value, title, desc }: { value: string; title: string; desc: string }) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary">
      <RadioGroupItem value={value} className="mt-0.5" />
      <div>
        <div className="font-medium text-ink">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </label>
  );
}
