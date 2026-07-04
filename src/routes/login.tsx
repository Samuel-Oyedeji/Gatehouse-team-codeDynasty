import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginFn } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await loginFn({ data: { email, password } });
      await getQueryClient().invalidateQueries();
      nav({ to: "/app/dashboard" });
    } catch {
      toast.error("Invalid email or password");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <img src={markAsset} alt="Gatehouse logo" className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
        </Link>
        <Card className="p-8">
          <h1 className="font-display text-2xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back to your estate.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div><Label htmlFor="e">Email</Label><Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="adaeze@maplecourt.ng" /></div>
            <div><Label htmlFor="p">Password</Label><Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            No account yet? <Link to="/signup" className="text-brand font-medium">Create one</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
