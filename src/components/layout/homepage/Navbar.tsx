"use client";

import { Bell, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { NotificationBell } from "@/components/layout/dashboard/NotificationBell";
import { UserMenu } from "@/components/layout/dashboard/UserMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getActiveSiteHref,
  ROLE_LABEL,
  SITE_NAV_BY_ROLE,
  SITE_NAV_PUBLIC,
} from "@/config/navigation";
import { useLogOut, useProfile } from "@/hook";
import { getRoleHome } from "@/lib/roles";
import { getDisplayName, getInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const pillId = useId();
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: profile, isLoading } = useProfile();
  const { mutate: logout, isPending: loggingOut } = useLogOut();

  const items = profile ? SITE_NAV_BY_ROLE[profile.role] : SITE_NAV_PUBLIC;
  const activeHref = getActiveSiteHref(pathname, items);
  const home = profile ? getRoleHome(profile.role) : null;
  const name = getDisplayName(profile);

  const close = () => setOpen(false);

  // Close the mobile menu whenever the route changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => setOpen(false), [pathname]);

  // Subtle shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape and outside click close the menu; Escape returns focus to the toggle
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Never leave the mobile menu open after growing to the desktop layout
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        setOpen(false);
        router.push("/");
        router.refresh();
      },
      onError: () =>
        toast.error("Logout failed", { description: "Please try again." }),
    });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow supports-[backdrop-filter]:bg-background/80",
        scrolled && "shadow-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={close}
          className={cn("group flex items-center gap-2.5 rounded-lg", FOCUS)}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="size-5" />
          </div>
          <div className="hidden leading-none sm:block">
            <p className="text-base font-bold tracking-tight">Nagar Sheba</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Smart City Services
            </p>
          </div>
          <span className="text-base font-bold sm:hidden">Nagar Sheba</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-8 w-20" />
              ))
            : items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative isolate rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      FOCUS,
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`nav-pill-${pillId}`}
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isLoading ? (
            <Skeleton className="h-9 w-24 rounded-lg" />
          ) : profile ? (
            <>
              <NotificationBell role={profile.role} />
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  FOCUS,
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90",
                  FOCUS,
                )}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile / tablet actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          {profile && <NotificationBell role={profile.role} />}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              FOCUS,
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {open && (
        <div
          id={menuId}
          className="animate-page-in max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-background lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {profile && home && (
              <div className="mb-3 flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                <Avatar size="lg">
                  <AvatarImage
                    src={profile.profileImage ?? undefined}
                    alt={name}
                  />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {profile.email}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-widest text-primary uppercase">
                    {ROLE_LABEL[profile.role]}
                  </p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      FOCUS,
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t pt-4">
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : profile && home ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`${home}/profile`}
                    onClick={close}
                    className={cn(
                      "flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-muted",
                      FOCUS,
                    )}
                  >
                    <UserRound className="size-4" /> Profile &amp; settings
                  </Link>
                  <Link
                    href={`${home}/notifications`}
                    onClick={close}
                    className={cn(
                      "flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-muted",
                      FOCUS,
                    )}
                  >
                    <Bell className="size-4" /> Notifications
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="h-10 w-full gap-2"
                  >
                    <LogOut className="size-4" />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={close}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors hover:bg-muted",
                      FOCUS,
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={close}
                    className={cn(
                      "flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                      FOCUS,
                    )}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
