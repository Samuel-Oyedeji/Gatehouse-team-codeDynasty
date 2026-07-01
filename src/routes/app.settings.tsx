import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionHeader } from "@/components/gatehouse/section-header";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <SectionHeader title="Settings" />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Estate</TabsTrigger>
          <TabsTrigger value="fees">Fee structure</TabsTrigger>
          <TabsTrigger value="rules">Allocation rules</TabsTrigger>
          <TabsTrigger value="notif">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="nomba">Nomba</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="p-6 max-w-xl space-y-4">
            <Field label="Estate name" defaultValue="Maple Court" />
            <Field label="Address" defaultValue="Plot 14 Admiralty Way" />
            <Field label="City / State" defaultValue="Lekki, Lagos" />
            <Button onClick={() => toast.success("Estate details saved")}>Save changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <Card className="p-6 max-w-xl space-y-4">
            <Field label="Service charge amount (₦)" defaultValue="45000" type="number" />
            <div>
              <Label>Cadence</Label>
              <Select defaultValue="quarterly">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast.success("Fee structure updated")}>Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card className="p-6 max-w-xl">
            <Label className="mb-3 block">When a payment arrives and the unit owes more than one thing, apply it…</Label>
            <RadioGroup defaultValue="oldest" className="space-y-3">
              <RadioOption value="oldest" title="Oldest charge first" desc="Clears the most overdue item before newer ones. Recommended." />
              <RadioOption value="dues" title="Dues before levies" desc="Always settle the recurring service charge first, then one-off levies." />
              <RadioOption value="manual" title="I will choose each time" desc="Show me a small allocation prompt for every payment." />
            </RadioGroup>
            <Button className="mt-4" onClick={() => toast.success("Allocation rule saved")}>Save</Button>
          </Card>
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
              <div className="font-medium">Adaeze Okafor</div>
              <div className="text-muted-foreground">Treasurer · you</div>
            </div>
            <Field label="Invite a co-manager by email" placeholder="name@email.com" />
            <Button onClick={() => toast.success("Invitation sent")}>Send invite</Button>
          </Card>
        </TabsContent>

        <TabsContent value="nomba" className="mt-4">
          <Card className="p-6 max-w-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-brand h-6 w-6" />
              <div>
                <div className="font-medium">Connected</div>
                <div className="text-sm text-muted-foreground">Payments settle directly into Maple Court's Nomba business account.</div>
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => toast("Manage connection in Nomba dashboard")}>Manage connection</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...rest} />
    </div>
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