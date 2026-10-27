"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { getSafeRedirect } from "@/lib/redirect";
import { getRoleHome } from "@/lib/roles";
import type { LoginPayload } from "@/types/auth.type";
import { LoginZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import DemoLoginPanel from "./DemoLoginPanel";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending: loginPending } = useLogin();

  const submitLogin = (credentials: LoginPayload) => {
    login(credentials, {
      onSuccess: (user) => {
        toast.success("Welcome back!", {
          description: "You have successfully signed in to Nagar Sheba.",
        });
        router.replace(
          getSafeRedirect(searchParams.get("redirect")) ??
            getRoleHome(user.role),
        );
        router.refresh();
      },
      onError: (error) => {
        toast.error("Sign in failed", {
          description: getApiErrorMessage(
            error,
            "The credentials entered do not match our records.",
          ),
        });
      },
    });
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onBlur: LoginZodSchema, onSubmit: LoginZodSchema },
    onSubmit: ({ value }) => {
      submitLogin({ email: value.email, password: value.password });
    },
  });

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to track your requests. Staff and administrators use the same
          form.
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium"
                >
                  Email address
                </FieldLabel>
                <div className="relative">
                  <Mail
                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 pl-10"
                  />
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <LockKeyhole
                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 pr-11 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button
          disabled={loginPending}
          type="submit"
          className="group h-11 w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
        >
          {loginPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <GoogleSignInButton />

        <p className="text-center text-sm text-muted-foreground">
          New to Nagar Sheba?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create a citizen account
          </Link>
        </p>
      </form>

      <DemoLoginPanel
        pending={loginPending}
        onSelect={(credentials) => {
          form.setFieldValue("email", credentials.email);
          form.setFieldValue("password", credentials.password);
          submitLogin(credentials);
        }}
      />

      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
