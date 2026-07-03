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
import { updateEstateFn, updateFeeStructureFn, provisionUnitsFn, createLevyFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

interface Draft {
  unitCount: number;
  serviceCharge: number;
  cadence: string;
  levies: { name: string; amount: string }[];
  accounts: { label: string; accountNumber: string | null }[];
}

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const total = 4;
  const [draft, setDraft] = useState<Draft>({
    unitCount: 60,
    serviceCharge: 45000,
    cadence: "quarterly",
    levies: [{ name: "Generator repair levy", amount: "10000" }],
    accounts: [],
  });

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={markAsset} alt="Gatehouse logo" className="h-7 w-7 object-contain" />
            <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
          </Link>
          <div className="text-sm text-muted-foreground tabular">Step {step} of {total}</div>
        </div>
        <div className="max-w-2xl mx-auto px-6 pb-3"><Progress value={(step / total) * 100} className="h-1" /></div>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {step === 1 && <StepEstate draft={draft} setDraft={setDraft} next={() => setStep(2)} />}
        {step === 2 && <StepNomba next={() => setStep(3)} />}
        {step === 3 && <StepFees draft={draft} setDraft={setDraft} next={() => setStep(4)} />}
        {step === 4 && (
          <StepUnits
            draft={draft}
            setDraft={setDraft}
            next={async () => {
              await getQueryClient().invalidateQueries();
              nav({ to: "/app/dashboard" });
            }}
          />
        )}
      </div>
    </div>
  );
}

function StepCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <Card className="p-8">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </Card>
  );
}

function StepEstate({ draft, setDraft, next }: { draft: Draft; setDraft: (d: Draft) => void; next: () => void }) {
  const [name, setName] = useState("Maple Court");
  const [address, setAddress] = useState("Plot 14 Admiralty Way");
  const [city, setCity] = useState("Lekki, Lagos");
  const [count, setCount] = useState(draft.unitCount);
  const [busy, setBusy] = useState(false);

  async function onContinue() {
    setBusy(true);
    try {
      await updateEstateFn({ data: { name, address, city, cycleLabel: "Q3 2026" } });
      setDraft({ ...draft, unitCount: count });
      next();
    } catch {
      toast.error("Could not save estate details");
      setBusy(false);
    }
  }

  return (
    <StepCard title="Create your estate" sub="Tell us about the community you manage.">
      <div><Label>Estate name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>City / State</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
        <div><Label>Number of units</Label><Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
      </div>
      <Button onClick={onContinue} className="w-full" disabled={busy}>{busy ? "Saving…" : "Continue"}</Button>
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
              <div className="text-sm text-muted-foreground">Payments will settle into your estate's account.</div>
            </div>
          </div>
          <Button onClick={next} className="w-full">Continue</Button>
        </>
      )}
    </StepCard>
  );
}

function StepFees({ draft, setDraft, next }: { draft: Draft; setDraft: (d: Draft) => void; next: () => void }) {
  const [serviceCharge, setServiceCharge] = useState(draft.serviceCharge);
  const [cadence, setCadence] = useState(draft.cadence);
  const [levies, setLevies] = useState(draft.levies);
  const [busy, setBusy] = useState(false);

  async function onContinue() {
    setBusy(true);
    try {
      await updateFeeStructureFn({ data: { serviceChargeNaira: serviceCharge, serviceChargeCadence: cadence } });
      setDraft({ ...draft, serviceCharge, cadence, levies });
      next();
    } catch {
      toast.error("Could not save fee structure");
      setBusy(false);
    }
  }

  return (
    <StepCard title="Set the fee structure" sub="What residents pay you, and how often.">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Service charge (₦)</Label><Input type="number" value={serviceCharge} onChange={(e) => setServiceCharge(Number(e.target.value))} /></div>
        <div>
          <Label>Cadence</Label>
          <Select value={cadence} onValueChange={setCadence}>
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
      <Button onClick={onContinue} className="w-full" disabled={busy}>{busy ? "Saving…" : "Continue"}</Button>
    </StepCard>
  );
}

function makeUnitRows(count: number) {
  const blocks = ["A", "B", "C", "D"];
  const perBlock = Math.ceil(count / blocks.length);
  const rows: { label: string; block: string; occupantName: string }[] = [];
  for (let i = 0; i < count; i++) {
    const block = blocks[Math.floor(i / perBlock)] ?? blocks[blocks.length - 1];
    const num = (i % perBlock) + 1;
    const label = `${block}${num}`;
    rows.push({ label, block, occupantName: `Resident ${label}` });
  }
  return rows;
}

function StepUnits({ draft, setDraft, next }: { draft: Draft; setDraft: (d: Draft) => void; next: () => void }) {
  const [busy, setBusy] = useState(false);
  const done = draft.accounts.length > 0;

  async function generate() {
    setBusy(true);
    try {
      const rows = makeUnitRows(draft.unitCount);
      const provisioned = await provisionUnitsFn({ data: { units: rows } });
      // Create any levies now that units exist.
      for (const l of draft.levies) {
        const amount = Number(l.amount);
        if (l.name.trim() && amount > 0) {
          await createLevyFn({ data: { name: l.name.trim(), amountNaira: amount, dueDate: Date.now() + 12 * 86_400_000, requireExact: true } });
        }
      }
      setDraft({
        ...draft,
        accounts: provisioned.map((p) => ({ label: p.label, accountNumber: p.accountNumber })),
      });
      toast.success(`${provisioned.length} unit accounts provisioned`);
    } catch {
      toast.error("Could not provision unit accounts");
    } finally {
      setBusy(false);
    }
  }

  return (
    <StepCard title="Add your units" sub="Each unit gets its own dedicated account number once added.">
      {!done ? (
        <>
          <div className="rounded-xl border-2 border-dashed border-border p-8 text-center bg-secondary">
            <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
            <div className="mt-3 font-medium">Drop your CSV here</div>
            <div className="mt-1 text-sm text-muted-foreground">Columns: unit label, occupant name, phone, owner or tenant</div>
            <Button variant="outline" size="sm" className="mt-4">Download template</Button>
          </div>
          <div className="text-xs text-center text-muted-foreground">— or generate them —</div>
          <Button onClick={generate} className="w-full" disabled={busy}>
            {busy ? "Provisioning accounts…" : `Generate ${draft.unitCount} unit accounts`}
          </Button>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-brand-tint border border-[#A7F3D0] p-6 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-brand" />
            <div className="mt-3 font-display text-xl font-semibold">{draft.accounts.length} units, {draft.accounts.length} account numbers.</div>
            <p className="mt-1 text-sm text-muted-foreground">Each one settles into your estate's Nomba account.</p>
            <div className="mt-5 space-y-2 max-w-xs mx-auto text-left">
              {draft.accounts.slice(0, 4).map((a) => (
                <div key={a.label} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.label}</span>
                  <AccountNumber value={a.accountNumber ?? "pending"} size="sm" />
                </div>
              ))}
              {draft.accounts.length > 4 && <div className="text-center text-xs text-muted-foreground pt-2">+ {draft.accounts.length - 4} more</div>}
            </div>
          </div>
          <Button onClick={next} className="w-full">Open my dashboard</Button>
        </>
      )}
    </StepCard>
  );
}
