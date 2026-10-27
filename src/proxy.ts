import { type NextRequest, NextResponse } from "next/server";
import { getRoleHome } from "@/lib/roles";
import type { UserRole } from "@/types/auth.type";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

// Must match the secret used by the backend to sign access tokens.
// Keep this variable server-only. Never use NEXT_PUBLIC_JWT_ACCESS_SECRET.
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const VALID_ROLES: UserRole[] = ["ADMIN", "STAFF", "CITIZEN"];

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

type AccessTokenPayload = {
  exp?: number;
  role?: UserRole;
};

const NO_SESSION: Session = {
  role: null,
  setCookies: [],
};

/**
 * Verify the JWT signature using Web Crypto.
 * This function does not trust any decoded payload until the signature
 * has been verified.
 */
async function validSignature(token: string): Promise<boolean> {
  if (!ACCESS_SECRET) {
    console.error("JWT_ACCESS_SECRET is not configured");
    return false;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;

    if (!header || !payload || !signature) return false;

    // Decode the signature from base64url.
    const normalizedSignature = signature.replace(/-/g, "+").replace(/_/g, "/");

    const paddedSignature =
      normalizedSignature +
      "=".repeat((4 - (normalizedSignature.length % 4)) % 4);

    const signatureBytes = Uint8Array.from(atob(paddedSignature), (char) =>
      char.charCodeAt(0),
    );

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(ACCESS_SECRET),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"],
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(`${header}.${payload}`),
    );
  } catch {
    return false;
  }
}

/**
 * Verify the signature first, then validate expiration and role.
 * Returns null when the token is missing, forged, expired, or malformed.
 */
async function roleFromToken(token?: string): Promise<UserRole | null> {
  if (!token || !(await validSignature(token))) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) return null;

    const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const paddedPayload =
      normalizedPayload + "=".repeat((4 - (normalizedPayload.length % 4)) % 4);

    const payload = JSON.parse(atob(paddedPayload)) as AccessTokenPayload;

    if (
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now() ||
      !VALID_ROLES.includes(payload.role as UserRole)
    ) {
      return null;
    }

    return payload.role as UserRole;
  } catch {
    return null;
  }
}

/**
 * Ask the backend to verify the current access token and account status.
 */
async function fetchRole(cookie: string): Promise<UserRole | null> {
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
	headers: { cookie },
	cache: "no-store",
	signal: AbortSignal.timeout(10_000),
});

  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      role?: UserRole;
      user?: {
        role?: UserRole;
      };
    };
  };

  // Supports either response shape:
  // data: { role: "ADMIN" }
  // data: { user: { role: "ADMIN" } }
  const role = json.data?.role ?? json.data?.user?.role;

  return role && VALID_ROLES.includes(role) ? role : null;
}

/**
 * Overlay freshly issued Set-Cookie values onto the request Cookie header.
 */
function mergeCookies(original: string, setCookies: string[]): string {
  const jar = new Map<string, string>();

  for (const part of original.split(/;\s*/).filter(Boolean)) {
    const i = part.indexOf("=");

    if (i > 0) {
      jar.set(part.slice(0, i), part.slice(i + 1));
    }
  }

  for (const setCookie of setCookies) {
    const pair = setCookie.split(";")[0];
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

  // Protected pages: validate the access token locally to avoid
  // a backend round trip when its signature, expiry, and role are valid.
  if (trustToken) {
    const role = await roleFromToken(accessToken);

    if (role) {
      return {
        role,
        setCookies: [],
      };
    }
  }

  const hasAccess = Boolean(accessToken);

  if (!hasAccess && !hasRefresh) {
    return NO_SESSION;
  }

  try {
    // Auth pages use backend verification, including account status checks.
    if (hasAccess) {
      const role = await fetchRole(cookie);

      if (role) {
        return {
          role,
          setCookies: [],
        };
      }
    }

    if (!hasRefresh) {
      return NO_SESSION;
    }

    // Attempt refresh when the access token is absent, expired,
    // or rejected by the backend.
    const refresh = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
	method: "POST",
	headers: { cookie, "content-type": "application/json" },
	body: "{}",
	cache: "no-store",
	signal: AbortSignal.timeout(10_000),
});

    if (!refresh.ok) {
      return NO_SESSION;
    }

    const setCookies = refresh.headers.getSetCookie();

    // Validate the newly issued access token against the backend.
    const role = await fetchRole(mergeCookies(cookie, setCookies));

    return role
      ? {
          role,
          setCookies,
        }
      : NO_SESSION;
  } catch {
    return NO_SESSION;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

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

  if (!rule) {
    return finish(NextResponse.next());
  }

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
