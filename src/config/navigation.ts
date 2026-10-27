import {
  Bell,
  Building2,
  ChartColumn,
  ClipboardList,
  CreditCard,
  FilePlus,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareText,
  ScrollText,
  Tags,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { UserRole } from "@/types/auth.type";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SiteNavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  CITIZEN: "Citizen",
  STAFF: "Staff",
  ADMIN: "Administrator",
};

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  CITIZEN: [
    { label: "Overview", href: "/citizen", icon: LayoutDashboard },
    { label: "My Requests", href: "/citizen/requests", icon: ClipboardList },
    { label: "New Request", href: "/citizen/requests/new", icon: FilePlus },
    { label: "Payments", href: "/citizen/payments", icon: CreditCard },
    { label: "Notifications", href: "/citizen/notifications", icon: Bell },
    {
      label: "My Feedback",
      href: "/citizen/feedbacks",
      icon: MessageSquareText,
    },
    { label: "Profile", href: "/citizen/profile", icon: UserRound },
  ],
  STAFF: [
    { label: "Overview", href: "/staff", icon: LayoutDashboard },
    { label: "Request Queue", href: "/staff/requests", icon: ClipboardList },
    { label: "Notifications", href: "/staff/notifications", icon: Bell },
    { label: "Performance", href: "/staff/performance", icon: ChartColumn },
    { label: "Reviews", href: "/staff/feedbacks", icon: MessageSquareText },
    { label: "Profile", href: "/staff/profile", icon: UserRound },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Requests", href: "/admin/requests", icon: ClipboardList },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Users & Staff", href: "/admin/users", icon: Users },
    { label: "Payments", href: "/admin/payments", icon: Wallet },
    { label: "Feedback", href: "/admin/feedbacks", icon: MessageSquareText },
    { label: "Reports", href: "/admin/reports", icon: ChartColumn },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Profile", href: "/admin/profile", icon: UserRound },
  ],
};

const HOME: SiteNavItem = {
  label: "Home",
  href: "/",
  exact: true,
};

const SERVICES: SiteNavItem = {
  label: "Services",
  href: "/services",
};

export const SITE_NAV_PUBLIC: SiteNavItem[] = [
  HOME,
  SERVICES,
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const SITE_NAV_BY_ROLE: Record<UserRole, SiteNavItem[]> = {
  CITIZEN: [
    HOME,
    SERVICES,
    { label: "Dashboard", href: "/citizen", exact: true },
    { label: "My Requests", href: "/citizen/requests" },
    { label: "New Request", href: "/citizen/requests/new" },
    { label: "Payments", href: "/citizen/payments" },
  ],
  STAFF: [
    HOME,
    SERVICES,
    { label: "Dashboard", href: "/staff", exact: true },
    { label: "Request Queue", href: "/staff/requests" },
    { label: "Performance", href: "/staff/performance" },
    { label: "Notifications", href: "/staff/notifications" },
  ],
  ADMIN: [
    HOME,
    SERVICES,
    { label: "Dashboard", href: "/admin", exact: true },
    { label: "Requests", href: "/admin/requests" },
    { label: "Users", href: "/admin/users" },
    { label: "Reports", href: "/admin/reports" },
  ],
};

/**
 * Returns the most specific matching route.
 * Exact items match only their own path.
 */
export function getActiveSiteHref(
  pathname: string,
  items: SiteNavItem[],
): string | undefined {
  return items
    .filter((item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/**
 * Returns the most specific matching dashboard route.
 * Nested routes take precedence over their parent routes.
 */
export function getActiveHref(
  pathname: string,
  items: NavItem[],
): string | undefined {
  return items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
