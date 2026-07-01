import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="h-7 w-7 rounded-md bg-brand text-white grid place-items-center font-display font-bold">G</div>
          <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
        </Link>
        <Card className="p-8">
          <h1 className="font-display text-2xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back to your estate.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/app/dashboard" }); }}>
            <div><Label htmlFor="e">Email</Label><Input id="e" type="email" defaultValue="treasurer@maplecourt.ng" /></div>
            <div><Label htmlFor="p">Password</Label><Input id="p" type="password" defaultValue="••••••••" /></div>
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            No account yet? <Link to="/signup" className="text-brand font-medium">Create one</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}