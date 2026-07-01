import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { CheckCircle2, Upload, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const total = 4;
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-brand text-white grid place-items-center font-display font-bold">G</div>
            <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
          </Link>
          <div className="text-sm text-muted-foreground tabular">Step {step} of {total}</div>
        </div>
        <div className="max-w-2xl mx-auto px-6 pb-3"><Progress value={(step / total) * 100} className="h-1" /></div>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {step === 1 && <StepEstate next={() => setStep(2)} />}
        {step === 2 && <StepNomba next={() => setStep(3)} />}
        {step === 3 && <StepFees next={() => setStep(4)} />}
        {step === 4 && <StepUnits next={() => nav({ to: "/app/dashboard" })} />}
      </div>
    </div>
  );
}

function StepCard({ title, sub, children }: any) {
  return (
    <Card className="p-8">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </Card>
  );
}

function StepEstate({ next }: { next: () => void }) {
  return (
    <StepCard title="Create your estate" sub="Tell us about the community you manage.">
      <div><Label>Estate name</Label><Input defaultValue="Maple Court" /></div>
      <div><Label>Address</Label><Input defaultValue="Plot 14 Admiralty Way" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>City / State</Label><Input defaultValue="Lekki, Lagos" /></div>
        <div><Label>Number of units</Label><Input type="number" defaultValue={60} /></div>
      </div>
      <Button onClick={next} className="w-full">Continue</Button>
    </StepCard>
  );
}

function StepNomba({ next }: { next: () => void }) {
  const [connected, setConnected] = useState(false);
  return (
    <StepCard title="Connect Nomba" sub="Gatehouse connects to your estate's Nomba business account so payments settle directly there.">
      {!connected ? (
        <>
          <div className="rounded-lg border border-border bg-secondary p-5">
            <div className="text-sm text-ink">Your committee keeps control of the funds. Gatehouse only reads incoming payments so it can attribute them to the right unit.</div>
          </div>
          <Button onClick={() => { setConnected(true); toast.success("Nomba account connected"); }} className="w-full">Connect Nomba account</Button>
        </>
      ) : (
        <>
          <div className="rounded-lg bg-brand-tint border border-[#A7F3D0] p-5 flex items-start gap-3">
            <CheckCircle2 className="text-brand h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium text-ink">Connected.</div>
              <div className="text-sm text-muted-foreground">Payments will settle into Maple Court's account.</div>
            </div>
          </div>
          <Button onClick={next} className="w-full">Continue</Button>
        </>
      )}
    </StepCard>
  );
}

function StepFees({ next }: { next: () => void }) {
  const [levies, setLevies] = useState<{ name: string; amount: string }[]>([{ name: "Generator repair levy", amount: "10000" }]);
  return (
    <StepCard title="Set the fee structure" sub="What residents pay you, and how often.">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Service charge (₦)</Label><Input type="number" defaultValue={45000} /></div>
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
      </div>
      <div>
        <div className="text-sm font-medium mb-2">One-off levies (optional)</div>
        <div className="space-y-2">
          {levies.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_auto] gap-2">
              <Input placeholder="Levy name" value={l.name} onChange={(e) => setLevies(levies.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <Input type="number" placeholder="Amount" value={l.amount} onChange={(e) => setLevies(levies.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))} />
              <Button variant="ghost" size="sm" onClick={() => setLevies(levies.filter((_, j) => j !== i))}>Remove</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setLevies([...levies, { name: "", amount: "" }])}>
            <Plus size={14} className="mr-1.5" />Add a levy
          </Button>
        </div>
      </div>
      <Button onClick={next} className="w-full">Continue</Button>
    </StepCard>
  );
}

function StepUnits({ next }: { next: () => void }) {
  const [done, setDone] = useState(false);
  const sampleAccounts = ["8021449320", "8021449321", "8021449322", "8021449323"];
  return (
    <StepCard title="Add your units" sub="Each unit gets its own account number once added.">
      {!done ? (
        <>
          <div className="rounded-xl border-2 border-dashed border-border p-8 text-center bg-secondary">
            <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
            <div className="mt-3 font-medium">Drop your CSV here</div>
            <div className="mt-1 text-sm text-muted-foreground">Columns: unit label, occupant name, phone, owner or tenant</div>
            <Button variant="outline" size="sm" className="mt-4">Download template</Button>
          </div>
          <div className="text-xs text-center text-muted-foreground">— or add one at a time —</div>
          <div className="grid grid-cols-[80px_1fr_140px_auto] gap-2">
            <Input placeholder="A1" />
            <Input placeholder="Occupant" />
            <Input placeholder="Phone" />
            <Button variant="outline" size="sm"><Plus size={14} /></Button>
          </div>
          <Button onClick={() => setDone(true)} className="w-full">Generate 60 unit accounts</Button>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-brand-tint border border-[#A7F3D0] p-6 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-brand" />
            <div className="mt-3 font-display text-xl font-semibold">60 units, 60 account numbers.</div>
            <p className="mt-1 text-sm text-muted-foreground">Each one settles into Maple Court's Nomba account.</p>
            <div className="mt-5 space-y-2 max-w-xs mx-auto text-left">
              {sampleAccounts.map((a, i) => (
                <div key={a} className="flex items-center justify-between text-sm">
                  <span className="font-medium">A{i + 1}</span>
                  <AccountNumber value={a} size="sm" />
                </div>
              ))}
              <div className="text-center text-xs text-muted-foreground pt-2">+ 56 more</div>
            </div>
          </div>
          <Button onClick={next} className="w-full">Open my dashboard</Button>
        </>
      )}
    </StepCard>
  );
}