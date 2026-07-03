import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signupFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("Adaeze Okafor");
  const [email, setEmail] = useState("adaeze@maplecourt.ng");
  const [phone, setPhone] = useState("+234 803 000 0000");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    try {
      await signupFn({ data: { name, email, phone, password } });
      await getQueryClient().invalidateQueries();
      nav({ to: "/onboarding" });
    } catch (err) {
      toast.error(err instanceof Error && err.message.includes("EMAIL_TAKEN") ? "That email is already registered" : "Could not create account");
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
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Work email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Phone</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
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
