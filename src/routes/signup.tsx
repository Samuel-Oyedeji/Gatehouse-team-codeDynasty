import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="h-7 w-7 rounded-md bg-brand text-white grid place-items-center font-display font-bold">G</div>
          <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
        </Link>
        <Card className="p-8">
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up Gatehouse for your estate in under five minutes.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/onboarding" }); }}>
            <div><Label>Full name</Label><Input defaultValue="Adaeze Okafor" /></div>
            <div><Label>Work email</Label><Input type="email" defaultValue="adaeze@maplecourt.ng" /></div>
            <div><Label>Phone</Label><Input type="tel" defaultValue="+234 803 000 0000" /></div>
            <div><Label>Password</Label><Input type="password" defaultValue="••••••••" /></div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-brand font-medium">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}