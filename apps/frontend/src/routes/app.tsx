import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Home, Receipt, ArrowLeftRight, AlertTriangle, Wrench, FileBarChart, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useGatehouse } from "@/lib/store";
import { fetchCurrentUser, logoutFn } from "@/lib/api";
import { useLiveUpdates } from "@/lib/use-live-updates";
import { SimulatePayment } from "@/components/gatehouse/simulate-payment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import markAsset from "@/assets/gatehouse-mark.jpeg";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    // Auth is a client-side JWT (localStorage), so gate on the client only; the
    // server render falls through and the client re-checks on hydration.
    if (typeof window === "undefined") return;
    const user = await fetchCurrentUser();
    if (!user) throw redirect({ to: "/login" });
    if (!user.onboarded) throw redirect({ to: "/onboarding" });
  },
  component: AppShell,
});

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/units", label: "Units", icon: Home },
  { to: "/app/billing", label: "Billing", icon: Receipt },
  { to: "/app/payments", label: "Payments", icon: ArrowLeftRight },
  { to: "/app/exceptions", label: "Exceptions", icon: AlertTriangle },
  { to: "/app/vendors", label: "Vendors", icon: Wrench },
  { to: "/app/reports", label: "Reports", icon: FileBarChart },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
] as const;

function AppShell() {
  useLiveUpdates();
  const nav = useNavigate();
  const { estate, cycle, exceptions } = useGatehouse();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    // Tears down the JWT, estate id, cached queries and (on unmount) the SSE
    // stream, then sends the user back to the login screen.
    await logoutFn();
    nav({ to: "/login" });
  }

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            {/* <div className="h-7 w-7 rounded-md bg-brand text-white grid place-items-center font-display font-bold">G</div> */}
            <img src={markAsset} alt="HireFlow logo" className="h-7 w-7 object-contain" />
            <span className="font-display text-lg font-semibold tracking-tight">Gatehouse</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => {
            const active = path.startsWith(n.to);
            const Icon = n.icon;
            const isExc = n.to === "/app/exceptions";
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-brand-tint text-brand font-medium" : "text-muted-foreground hover:bg-secondary hover:text-ink"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{n.label}</span>
                {isExc && exceptions.length > 0 && (
                  <span className="rounded-full bg-[#FFF1F2] text-[#BE123C] px-1.5 text-[10px] font-semibold tabular min-w-[18px] text-center">
                    {exceptions.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-ink disabled:opacity-60"
          >
            <LogOut size={16} />
            <span className="flex-1 text-left">{loggingOut ? "Signing out…" : "Log out"}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-ink">{estate.name}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-sm text-muted-foreground">{estate.city}</span>
          </div>
          <div className="text-sm text-muted-foreground rounded-md border border-border px-2.5 py-1 tabular">{cycle}</div>
          <div className="flex-1" />
          <div className={`text-xs px-2.5 py-1 rounded-full tabular font-medium ${
            exceptions.length > 0 ? "bg-[#FFF1F2] text-[#BE123C]" : "bg-[#ECFDF5] text-[#047857]"
          }`}>
            Unmatched: {exceptions.length}
          </div>
          <SimulatePayment />
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand text-white text-xs">AO</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}