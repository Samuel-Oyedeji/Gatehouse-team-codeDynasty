import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signupFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

// Mirrors the backend RegisterDto rule: min 8 chars with an uppercase, lowercase,
// number, and special character. Kept in sync so the form fails loud client-side
// instead of bouncing off a 400 from the API.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{};:,<.>])[A-Za-z\d@$!%*?&#^()\-_=+{};:,<.>]{8,}$/;

// Individual checks drive the live checklist under the password field. They stay a
// strict subset of PASSWORD_RE, so a fully-ticked list also satisfies the gate.
const PASSWORD_RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  { label: "One special character", test: (v) => /[@$!%*?&#^()\-_=+{};:,<.>]/.test(v) },
];

// E.164: a leading + then 1–15 digits, first digit non-zero.
const PHONE_RE = /^\+[1-9]\d{1,14}$/;

// Keep a strictly-numeric field: digits plus a single leading +.
function sanitizePhone(v: string): string {
  return v.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

// Normalize to E.164, defaulting local/bare numbers to Nigeria (+234). A local
// "0803..." becomes "+234803..."; a "234803..." gains its missing +.
function normalizePhone(v: string): string {
  const cleaned = sanitizePhone(v);
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0")) return "+234" + cleaned.slice(1);
  if (cleaned.startsWith("234")) return "+" + cleaned;
  return cleaned ? "+" + cleaned : "";
}

// Password field with a show/hide toggle. Shared by both password inputs.
function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanedPhone = normalizePhone(phone);
    if (!PHONE_RE.test(cleanedPhone)) return toast.error("Enter a valid phone number, e.g. 08030000000 or +2348030000000");
    if (!PASSWORD_RE.test(password)) return toast.error("Password doesn't meet all the requirements below");
    if (password !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    try {
      await signupFn({ data: { name, email, phone: cleanedPhone, password } });
      await getQueryClient().invalidateQueries();
      nav({ to: "/onboarding" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg && !msg.startsWith("[") ? msg : "Could not create account");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <img src={markAsset} alt="Gatehouse logo" className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
        </Link>
        <Card className="p-8">
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up Gatehouse for your estate in under five minutes.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okafor" /></div>
            <div><Label>Work email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" /></div>
            <div><Label>Phone</Label><Input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(sanitizePhone(e.target.value))} onBlur={() => setPhone((p) => normalizePhone(p))} placeholder="+2348030000000" /></div>
            <div>
              <Label>Password</Label>
              <PasswordInput value={password} onChange={setPassword} placeholder="Enter password" />
              {password && (
                <ul className="mt-2 space-y-1">
                  {PASSWORD_RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li key={r.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-green-600" : "text-muted-foreground")}>
                        {ok ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                        {r.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div>
              <Label>Confirm password</Label>
              <PasswordInput value={confirm} onChange={setConfirm} placeholder="Confirm password" />
              {confirm && (
                <p className={cn("mt-2 flex items-center gap-1.5 text-xs", password === confirm ? "text-green-600" : "text-muted-foreground")}>
                  {password === confirm ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  Passwords match
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-brand font-medium">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
