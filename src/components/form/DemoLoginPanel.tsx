"use client";

import { Rocket, ShieldCheck, UserRound, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/config/demo";
import type { LoginPayload, UserRole } from "@/types/auth.type";

const ICONS: Record<UserRole, ReactNode> = {
  ADMIN: <ShieldCheck className="size-5" />,
  STAFF: <Wrench className="size-5" />,
  CITIZEN: <UserRound className="size-5" />,
};

type Props = {
  pending: boolean;
  onSelect: (credentials: LoginPayload) => void;
};

export default function DemoLoginPanel({ pending, onSelect }: Props) {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  const handleClick = (account: DemoAccount) => {
    setActiveRole(account.role);
    onSelect({ email: account.email, password: account.password });
  };

  return (
    <section
      aria-labelledby="demo-login-title"
      className="mt-6 rounded-xl border border-dashed bg-muted/40 p-4"
    >
      <h2
        id="demo-login-title"
        className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase"
      >
        <Rocket className="size-3.5 text-primary" aria-hidden="true" />
        Try a demo account
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const missing = !account.email || !account.password;
          const loading = pending && activeRole === account.role;

          return (
            <button
              key={account.role}
              type="button"
              disabled={pending || missing}
              title={
                missing
                  ? "Demo credentials not configured"
                  : account.description
              }
              aria-label={`Demo login as ${account.label}. ${account.description}`}
              onClick={() => handleClick(account)}
              className="flex flex-col items-center gap-1.5 rounded-lg border bg-background px-2 py-3 text-xs font-medium outline-none transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="text-primary">
                {loading ? <Spinner /> : ICONS[account.role]}
              </span>
              {loading ? "Signing in..." : account.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
