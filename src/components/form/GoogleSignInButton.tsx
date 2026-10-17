"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { getSafeRedirect } from "@/lib/redirect";
import { getRoleHome } from "@/lib/roles";
import { useTheme } from "@/providers/theme.provider";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GoogleCredentialResponse = { credential: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const { mutate: googleLogin } = useGoogleLogin();

  // Google keeps the first callback it receives, so route it through a ref.
  const onCredential = useRef<(r: GoogleCredentialResponse) => void>(() => {});
  useEffect(() => {
    onCredential.current = (response) => {
      googleLogin(response.credential, {
        onSuccess: (user) => {
          toast.success("Welcome!", {
            description: "You signed in with Google.",
          });
          router.replace(
            getSafeRedirect(searchParams.get("redirect")) ??
              getRoleHome(user.role),
          );
          router.refresh();
        },
        onError: (error) =>
          toast.error("Google sign in failed", {
            description: getApiErrorMessage(error),
          }),
      });
    };
  }, [googleLogin, router, searchParams]);

  // Initialize once
  useEffect(() => {
    if (!scriptReady || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => onCredential.current(response),
    });
  }, [scriptReady]);

  // Render (and re-render on theme change) at the container's real width.
  // Google only accepts 200-400px.
  useEffect(() => {
    const el = containerRef.current;
    if (!scriptReady || !el || !window.google) return;
    el.innerHTML = "";
    const width = Math.min(Math.max(el.offsetWidth, 200), 400);
    window.google.accounts.id.renderButton(el, {
      theme: theme === "dark" ? "filled_black" : "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width,
    });
  }, [scriptReady, theme]);

  if (!CLIENT_ID) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div ref={containerRef} className="flex min-h-11 w-full justify-center" />
    </>
  );
}
