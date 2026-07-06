import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Receipt, AlertTriangle, Wrench, Eye, ShieldCheck } from "lucide-react";
import { StatusPill } from "@/components/gatehouse/status-pill";
import { Money } from "@/components/gatehouse/money";
import { AccountNumber } from "@/components/gatehouse/account-number";
import markAsset from "@/assets/gatehouse-mark.jpeg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gatehouse — Estate dues that reconcile themselves" },
      { name: "description", content: "Gatehouse collects service charges into your estate's own bank account, attributes every payment automatically, and shows residents where the money goes." },
      { property: "og:title", content: "Gatehouse — Estate dues that reconcile themselves" },
      { property: "og:description", content: "Every unit gets its own account number. Every payment reconciles itself." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <Hero />
      <Problem />
      <How />
      <Features />
      <Trust />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* <div className="h-7 w-7 rounded-md bg-brand text-white grid place-items-center font-display font-bold">G</div> */}
          <img src={markAsset} alt="HireFlow logo" className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <Link to="/login" className="hover:text-ink">Sign in</Link>
        </nav>
        <Link to="/signup"><Button size="sm">Start collecting</Button></Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand">
          For Nigerian estate managers
        </div>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          Every unit gets its own account number. Every payment reconciles itself.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Gatehouse collects service charges into your estate's own bank account, attributes every payment automatically, and shows residents exactly where their money goes. End the WhatsApp-and-spreadsheet chaos.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/signup"><Button size="lg">Start collecting <ArrowRight size={16} className="ml-1.5" /></Button></Link>
          <a href="#how"><Button size="lg" variant="outline">See how it works</Button></a>
        </div>
      </div>
      <HeroPreview />
    </section>
  );
}

function HeroPreview() {
  const tiles = [
    { label: "A1", name: "Adaeze", status: "paid" as const, val: 0 },
    { label: "A2", name: "Tunde", status: "partial" as const, val: 20000 },
    { label: "A3", name: "Aisha", status: "paid" as const, val: 0 },
    { label: "A4", name: "Femi", status: "paid" as const, val: 0 },
    { label: "B1", name: "Yetunde", status: "paid" as const, val: 0 },
    { label: "B2", name: "Ifeanyi", status: "overdue" as const, val: 45000 },
    { label: "B3", name: "Bukola", status: "paid" as const, val: 0 },
    { label: "B4", name: "Obinna", status: "credit" as const, val: 10000 },
  ];
  return (
    <div className="relative">
      <Card className="p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Maple Court</div>
            <div className="font-display text-lg font-semibold">Block A & B</div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] tabular font-medium">Unmatched: 0</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((t) => {
            const tone = {
              paid: "border-[#A7F3D0] bg-[#ECFDF5]",
              partial: "border-[#FDE68A] bg-[#FFFBEB]",
              overdue: "border-[#FECDD3] bg-[#FFF1F2]",
              credit: "border-[#C7D2FE] bg-[#EEF2FF]",
              unbilled: "border-border bg-secondary",
            }[t.status];
            return (
              <div key={t.label} className={`rounded-xl border p-3 ${tone}`}>
                <div className="flex items-center justify-between">
                  <div className="font-display text-base font-semibold">{t.label}</div>
                  <StatusPill kind={t.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground truncate">{t.name}</div>
                <div className="mt-1 text-sm font-medium tabular">
                  {t.val === 0 ? <span className="text-[#047857]">settled</span> :
                    t.status === "credit" ? <span className="text-[#4338CA]">+<Money value={t.val} /></span> :
                    <><Money value={t.val} /></>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-border flex items-center gap-3 text-sm">
          <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <div className="text-ink">Block B Flat 4 paid <span className="tabular font-medium">₦55,000</span>, ₦10,000 credit</div>
          <span className="ml-auto text-xs text-muted-foreground tabular">just now</span>
        </div>
      </Card>
    </div>
  );
}

function Problem() {
  const items = [
    { title: "Chasing payments on WhatsApp", body: "Endless reminders in the estate group. No one knows who has actually paid." },
    { title: "A spreadsheet that's always wrong", body: "Bank statements don't say who paid. Names don't match units. Reconciliation eats your weekend." },
    { title: "Residents distrust the books", body: '"Where did our money go?" becomes the question at every AGM.' },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="font-display text-3xl font-semibold text-ink">The treasurer's job, before Gatehouse</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.title} className="p-6">
            <div className="font-display text-lg font-semibold">{it.title}</div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { n: 1, title: "Add your units", body: "Bulk upload your block list. Each unit gets its own dedicated 10-digit account number, in the estate's own bank account." },
    { n: 2, title: "Residents pay by transfer", body: "Service charges and levies land in the right unit's account. Payments reconcile instantly — no notes, no names, no guesswork." },
    { n: 3, title: "Pay vendors and publish", body: "Pay security, waste, and diesel from inside Gatehouse. Residents see exactly where every naira went, in plain language." },
  ];
  return (
    <section id="how" className="bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-semibold text-ink">How it works</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="font-display text-5xl font-bold text-brand tabular">{s.n.toString().padStart(2, "0")}</div>
              <div className="mt-3 font-display text-xl font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-md">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Your residents will see</div>
          <Card className="p-5">
            <div className="text-xs text-muted-foreground">Maple Court · Block B Flat 4</div>
            <div className="mt-2 text-sm">Transfer to</div>
            <div className="mt-1"><AccountNumber value="8021449320" size="lg" /></div>
            <div className="mt-2 text-xs text-muted-foreground">From any bank app. Your payment is recorded automatically.</div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const f = [
    { i: CheckCircle2, t: "Automatic reconciliation", d: "Per-unit account numbers mean every payment knows where it belongs." },
    { i: Receipt, t: "Partial and overpayment handling", d: "Underpaid? It shows. Overpaid? It moves to credit. Always tidy." },
    { i: AlertTriangle, t: "Arrears tracking and reminders", d: "See who is behind by 30, 60, 90+ days. Nudge them by SMS or WhatsApp in one click." },
    { i: Eye, t: "Per-unit statements", d: "Every resident gets a no-login link to their own statement and history." },
    { i: Wrench, t: "Vendor payouts", d: "Pay security, waste, diesel, and repairs from inside the app. Every payout is logged." },
    { i: ShieldCheck, t: "Public transparency report", d: "A shareable, plain-language view of where the dues went this cycle." },
  ];
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="font-display text-3xl font-semibold">Everything a treasurer actually needs</h2>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {f.map((x) => (
          <Card key={x.t} className="p-5">
            <x.i className="text-brand h-5 w-5" />
            <div className="mt-3 font-display text-base font-semibold">{x.t}</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{x.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-sm">
        <Trustline title="Funds settle into the estate's account">Money never sits with Gatehouse. It moves directly to your estate's own bank.</Trustline>
        <Trustline title="Gatehouse never holds funds">We're the ledger, not the wallet. Your committee always controls the money.</Trustline>
        <Trustline title="Powered by Nomba">Built on CBN-licensed payment rails used by thousands of Nigerian businesses.</Trustline>
      </div>
    </section>
  );
}

function Trustline({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <ShieldCheck className="text-brand h-5 w-5" />
      <div className="mt-2 font-display text-base font-semibold">{title}</div>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-brand text-white grid place-items-center font-display font-bold text-xs">G</div>
            <span className="font-display font-semibold">Gatehouse</span>
          </div>
          <p className="mt-3 text-muted-foreground">Estate dues that reconcile themselves.</p>
        </div>
        <FooterCol title="Product" items={["How it works", "Features", "Pricing"]} />
        <FooterCol title="Legal" items={["Terms", "Privacy", "Security"]} />
        <FooterCol title="Contact" items={["hello@gatehouse.ng", "+234 800 000 0000"]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© 2026 Gatehouse</div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-medium text-ink">{title}</div>
      <ul className="mt-2 space-y-1.5 text-muted-foreground">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
