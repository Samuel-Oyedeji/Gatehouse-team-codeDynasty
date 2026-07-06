import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AccountNumber } from "@/components/gatehouse/account-number";
import { CheckCircle2, Upload, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { createEstateFn, fetchCurrentUser, fetchOnboardingState, provisionUnitsFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    // Auth is a client-side JWT (localStorage), so gate on the client only; the
    // server render falls through and the client re-checks on hydration.
    if (typeof window === "undefined") return;
    const user = await fetchCurrentUser();
    if (!user) throw redirect({ to: "/login" });
    // Already onboarded managers must not re-enter the wizard — it would re-show
    // step 1 and re-trigger the duplicate-estate error.
    if (user.onboarded) throw redirect({ to: "/app/dashboard" });
  },
  component: OnboardingPage,
});

interface Draft {
  unitCount: number;
  accounts: { label: string; accountNumber: string | null }[];
}

function OnboardingPage() {
  // Null until we've resolved backend progress, so a refresh resumes at the right
  // step instead of flashing step 1.
  const [step, setStep] = useState<number | null>(null);
  const nav = useNavigate();
  const total = 3;
  const [draft, setDraft] = useState<Draft>({
    unitCount: 60,
    accounts: [],
  });

  useEffect(() => {
    let active = true;
    fetchOnboardingState()
      .then((s) => {
        if (!active) return;
        if (s.estate) {
          const units = s.estate.units;
          setDraft((d) => ({ ...d, unitCount: units }));
        }
        // Backend may still return step 4 (old fees→units split). Clamp to 3
        // since the fees step no longer exists in the frontend.
        setStep(Math.min(s.step, 3));
      })
      .catch(() => {
        // If progress can't be loaded, fall back to a fresh wizard.
        if (active) setStep(1);
      });
    return () => {
      active = false;
    };
  }, []);

  if (step === null) {
    return (
      <div className="min-h-screen bg-canvas grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative grid place-items-center">
            <div className="h-14 w-14 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
            <img src={markAsset} alt="Gatehouse logo" className="absolute h-7 w-7 object-contain" />
          </div>
          <div className="text-sm text-muted-foreground">Loading your onboarding…</div>
        </div>
      </div>
    );
  }

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
        {step === 3 && (
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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [count, setCount] = useState(draft.unitCount);
  const [busy, setBusy] = useState(false);

  async function onContinue() {
    setBusy(true);
    try {
      await createEstateFn({ data: { name, address, city, units: count } });
      setDraft({ ...draft, unitCount: count });
      next();
    } catch {
      toast.error("Could not create estate");
      setBusy(false);
    }
  }

  return (
    <StepCard title="Create your estate" sub="Tell us about the community you manage.">
      <div><Label>Estate name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maple Court" /></div>
      <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Plot 14 Admiralty Way" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>City / State</Label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lekki, Lagos" /></div>
        <div><Label>Number of units</Label><Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} placeholder="60" /></div>
      </div>
      <Button onClick={onContinue} className="w-full" disabled={busy}>{busy ? "Saving…" : "Continue"}</Button>
    </StepCard>
  );
}

function StepNomba({ next }: { next: () => void }) {
  const [created, setCreated] = useState(false);
  return (
    <StepCard title="Create your Nomba subaccount" sub="Gatehouse creates a dedicated Nomba subaccount for your estate, where every unit payment settles.">
      {!created ? (
        <>
          <div className="rounded-lg border border-border bg-secondary p-5">
            <div className="text-sm text-ink">The subaccount sits under your estate's Nomba business account, so your committee keeps control of the funds. Gatehouse only reads incoming payments so it can attribute them to the right unit.</div>
          </div>
          <Button onClick={() => { setCreated(true); toast.success("Nomba subaccount created"); }} className="w-full">Create subaccount</Button>
        </>
      ) : (
        <>
          <div className="rounded-lg bg-brand-tint border border-[#A7F3D0] p-5 flex items-start gap-3">
            <CheckCircle2 className="text-brand h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium text-ink">Subaccount created.</div>
              <div className="text-sm text-muted-foreground">Payments will settle into your estate's Nomba subaccount.</div>
            </div>
          </div>
          <Button onClick={next} className="w-full">Continue</Button>
        </>
      )}
    </StepCard>
  );
}

// Derive the block from a unit label (e.g. "A1" → "A") since the backend stores
// block and unitName separately. Falls back to "A" when the label has no prefix.
function blockFromLabel(label: string) {
  const match = label.trim().match(/^[A-Za-z]+/);
  return (match ? match[0] : "A").toUpperCase();
}

function downloadUnitsTemplate() {
  const csv = "Unit Label,Occupant Name,Phone Number\nA1,Jane Doe,08012345678\nA2,John Smith,08087654321\n";
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "units-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface ManualRow {
  label: string;
  occupant: string;
  phone: string;
}

// Parse the units CSV (Unit Label, Occupant Name, Phone Number) into editable
// rows. Skips a header line if present; tolerant of blank lines and trailing cols.
function parseCsvToRows(text: string): ManualRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const startIdx = /label|occupant|phone|name/i.test(lines[0]) ? 1 : 0;
  const rows: ManualRow[] = [];
  for (const line of lines.slice(startIdx)) {
    const [label = "", occupant = "", phone = ""] = line.split(",").map((c) => c.trim());
    if (label || occupant || phone) rows.push({ label, occupant, phone });
  }
  return rows;
}

function StepUnits({ draft, setDraft, next }: { draft: Draft; setDraft: (d: Draft) => void; next: () => void }) {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<ManualRow[]>([{ label: "", occupant: "", phone: "" }]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const done = draft.accounts.length > 0;
  const validRows = rows.filter((r) => r.label.trim() && r.occupant.trim());

  function loadFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsvToRows(String(reader.result ?? ""));
      if (parsed.length === 0) {
        toast.error("No units found in that CSV");
        return;
      }
      setRows(parsed);
      toast.success(`Loaded ${parsed.length} unit${parsed.length === 1 ? "" : "s"} — review and edit below`);
    };
    reader.onerror = () => toast.error("Could not read that file");
    reader.readAsText(file);
  }

  async function provision(units: { label: string; block: string; occupantName: string; occupantPhone?: string }[]) {
    setBusy(true);
    try {
      const { succeeded, failed } = await provisionUnitsFn({ data: { units } });
      setDraft({
        ...draft,
        accounts: succeeded.map((p) => ({ label: p.label, accountNumber: p.accountNumber })),
      });
      toast.success(`${succeeded.length} unit account${succeeded.length === 1 ? "" : "s"} provisioned`);
      // Surface any units that failed (e.g. Nomba rejected the name) with the reason.
      if (failed.length > 0) {
        toast.error(`${failed.length} failed — ${failed.map((f) => `${f.unit}: ${f.reason}`).join("; ")}`);
      }
    } catch (err) {
      // Total failure: the backend returns the reasons in the error message.
      toast.error(err instanceof Error ? err.message : "Could not provision unit accounts");
    } finally {
      setBusy(false);
    }
  }

  function generate() {
    if (validRows.length === 0) return;
    void provision(
      validRows.map((r) => ({
        label: r.label.trim(),
        block: blockFromLabel(r.label),
        occupantName: r.occupant.trim(),
        occupantPhone: r.phone.trim() || undefined,
      })),
    );
  }

  return (
    <StepCard title="Add your units" sub="Each unit gets its own dedicated account number once added.">
      {!done ? (
        <>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
            className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragging ? "border-brand bg-brand-tint" : "border-border bg-secondary"}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ""; }}
            />
            <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
            <div className="mt-3 font-medium">Drop your CSV here, or click to browse</div>
            <div className="mt-1 text-sm text-muted-foreground">Columns: unit label, occupant name, phone number</div>
            <Button variant="outline" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); downloadUnitsTemplate(); }}>Download template</Button>
          </div>
          <div className="text-xs text-center text-muted-foreground">— or add one at a time —</div>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr_140px_auto] gap-2">
                <Input placeholder="A1" value={r.label} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                <Input placeholder="Occupant" value={r.occupant} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, occupant: e.target.value } : x))} />
                <Input placeholder="Phone" value={r.phone} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))} />
                {i === rows.length - 1 ? (
                  <Button type="button" variant="outline" size="icon" onClick={() => setRows([...rows, { label: "", occupant: "", phone: "" }])} aria-label="Add another unit">
                    <Plus size={16} />
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove unit">
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button onClick={generate} className="w-full" disabled={busy || validRows.length === 0}>
            {busy
              ? "Provisioning accounts…"
              : validRows.length === 0
                ? "Generate unit accounts"
                : `Generate ${validRows.length} unit account${validRows.length === 1 ? "" : "s"}`}
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
