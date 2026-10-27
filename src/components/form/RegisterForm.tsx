"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useRegister } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { RegisterZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import GoogleSignInButton from "./GoogleSignInButton";
import { PasswordChecklist } from "./PasswordChecklist";

const FIELDS = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Your full name",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "citizen@example.com",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "01XXXXXXXXX",
    autoComplete: "tel",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "House, Road, Area",
    autoComplete: "street-address",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••••••",
    autoComplete: "new-password",
  },
] as const;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
    validators: {
      onChange: RegisterZodSchema,
      onSubmit: RegisterZodSchema,
    },
    onSubmit: ({ value }) => {
      register(
        {
          ...value,
          address: value.address.trim() || undefined,
        } as typeof value,
        {
          onSuccess: () => {
            toast.success("Check your email", {
              description: "We sent a 6-digit verification code.",
            });

            router.push(
              `/verify-email?email=${encodeURIComponent(value.email)}`,
            );
          },
          onError: (error) => {
            toast.error("Registration failed", {
              description: getApiErrorMessage(error),
            });
          },
        },
      );
    },
  });

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join Nagar Sheba to report issues, pay fees and track every request.
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {FIELDS.map((item) => (
          <form.Field key={item.name} name={item.name}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const isPassword = item.name === "password";

              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    {item.label}{" "}
                    {item.name !== "address" && (
                      <span className="text-primary">*</span>
                    )}
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={isPassword && showPassword ? "text" : item.type}
                      autoComplete={item.autoComplete}
                      placeholder={item.placeholder}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={isPassword ? "h-11 pr-11" : "h-11"}
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {isPassword && field.state.value && (
                    <PasswordChecklist value={field.state.value} />
                  )}
                </Field>
              );
            }}
          </form.Field>
        ))}

        <Button
          type="submit"
          disabled={isPending}
          className="group mt-1 h-11 w-full gap-2 text-sm font-semibold"
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
        <GoogleSignInButton />

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By creating an account, you agree to our{" "}
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
      </form>
    </div>
  );
}
