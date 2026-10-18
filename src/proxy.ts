import { type NextRequest, NextResponse } from "next/server";
import { getRoleHome } from "@/lib/roles";
import type { UserRole } from "@/types/auth.type";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

const PROTECTED: { prefix: string; role: UserRole }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/staff", role: "STAFF" },
  { prefix: "/citizen", role: "CITIZEN" },
];

const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

type Session = {
  role: UserRole | null;
  setCookies: string[];
};

const NO_SESSION: Session = { role: null, setCookies: [] };

function roleFromToken(token?: string): UserRole | null {
  if (!token) return null;

  try {
    const part = token.split(".")[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64)) as {
      exp?: number;
      role?: UserRole;
    };

    if (
      typeof json.exp !== "number" ||
      json.exp * 1000 <= Date.now() ||
      !["ADMIN", "STAFF", "CITIZEN"].includes(json.role ?? "")
    ) {
      return null;
    }

    return json.role ?? null;
  } catch {
    return null;
  }
}

async function fetchRole(cookie: string): Promise<UserRole | null> {
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { role?: UserRole };
  };

  const role = json.data?.role;

  return role && ["ADMIN", "STAFF", "CITIZEN"].includes(role) ? role : null;
}

/** Overlay freshly issued Set-Cookie values onto the request Cookie header. */
function mergeCookies(original: string, setCookies: string[]) {
  const jar = new Map<string, string>();

  for (const part of original.split(/;\s*/).filter(Boolean)) {
    const i = part.indexOf("=");
    if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
  }

  for (const sc of setCookies) {
    const pair = sc.split(";")[0];
    const i = pair.indexOf("=");

    if (i > 0) {
      jar.set(pair.slice(0, i).trim(), pair.slice(i + 1));
    }
  }

  return [...jar].map(([key, value]) => `${key}=${value}`).join("; ");
}

async function getSession(
  request: NextRequest,
  trustToken: boolean,
): Promise<Session> {
  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasRefresh = Boolean(request.cookies.get("refreshToken")?.value);

  // Protected pages: decode the JWT locally to avoid a backend round trip.
  if (trustToken) {
    const role = roleFromToken(accessToken);
    if (role) return { role, setCookies: [] };
  }

  const hasAccess = Boolean(accessToken);

  if (!hasAccess && !hasRefresh) return NO_SESSION;

  try {
    // Auth pages retain backend verification, including account status checks.
    if (hasAccess) {
      const role = await fetchRole(cookie);
      if (role) return { role, setCookies: [] };
    }

    if (!hasRefresh) return NO_SESSION;

    // Attempt refresh when the access token is absent, expired, or rejected.
    const refresh = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        cookie,
        "content-type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    });

    if (!refresh.ok) return NO_SESSION;

    const setCookies = refresh.headers.getSetCookie();
    const role = await fetchRole(mergeCookies(cookie, setCookies));

    return role ? { role, setCookies } : NO_SESSION;
  } catch {
    return NO_SESSION;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  const { role, setCookies } = await getSession(request, !isAuthPage);

  // Preserve rotated cookies on responses returned by this proxy.
  const finish = (response: NextResponse) => {
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
    return response;
  };

  if (isAuthPage) {
    return finish(
      role
        ? NextResponse.redirect(new URL(getRoleHome(role), request.url))
        : NextResponse.next(),
    );
  }

  const rule = PROTECTED.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!rule) return finish(NextResponse.next());

  if (!role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return finish(NextResponse.redirect(url));
  }

  if (role !== rule.role) {
    return finish(
      NextResponse.redirect(new URL(getRoleHome(role), request.url)),
    );
  }

  return finish(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/citizen/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
