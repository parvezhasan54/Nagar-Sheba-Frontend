"use client";

import { useForm } from "@tanstack/react-form";
import {
  BadgeCheck,
  Building2,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { PasswordChecklist } from "@/components/form/PasswordChecklist";
import { Reveal } from "@/components/motion/Reveal";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_LABEL } from "@/config/navigation";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  useUpdateProfileImage,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import { getDisplayName, getInitials } from "@/lib/user";
import type { UserRole } from "@/types/auth.type";
import type { AuthUser } from "@/types/user.type";
import { ChangePasswordZodSchema, UpdateProfileZodSchema } from "@/validation";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const DETAIL_FIELDS = [
  {
    name: "fullName",
    label: "Full name",
    autoComplete: "name",
    roles: ["CITIZEN", "STAFF", "ADMIN"],
  },
  {
    name: "phone",
    label: "Phone number",
    autoComplete: "tel",
    roles: ["CITIZEN"],
  },
  {
    name: "address",
    label: "Address",
    autoComplete: "street-address",
    roles: ["CITIZEN"],
  },
  {
    name: "title",
    label: "Job title",
    autoComplete: "organization-title",
    roles: ["STAFF"],
  },
] as const;

const PASSWORD_FIELDS = [
  {
    name: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  { name: "newPassword", label: "New password", autoComplete: "new-password" },
] as const;

function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProfileView() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Reveal y={12}>
        <ProfileHeader profile={profile} />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-start">
        <Reveal delay={0.05}>
          <AccountCard profile={profile} />
        </Reveal>
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <DetailsForm profile={profile} />
          </Reveal>
          <Reveal delay={0.15}>
            <PasswordForm profile={profile} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({ profile }: { profile: AuthUser }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUpdateProfileImage();
  const name = getDisplayName(profile);
  const department = profile.staffProfile?.department?.name;

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGES.includes(file.type)) {
      toast.error("Use a JPEG, PNG or WEBP image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file); // field name required by the API

    upload(formData, {
      onSuccess: () => toast.success("Profile photo updated"),
      onError: (error) =>
        toast.error("Upload failed", {
          description: getApiErrorMessage(error),
        }),
    });
  };

  return (
    <Card className="gap-0 py-0">
      <div className="relative h-28 overflow-hidden bg-primary sm:h-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="animate-float absolute -top-10 -right-6 size-44 rounded-full bg-white/10 blur-2xl" />
          <div className="animate-float-slow absolute -bottom-14 left-1/4 size-52 rounded-full bg-white/10 blur-2xl" />
        </div>
      </div>

      <CardContent className="px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
          <div className="relative w-fit">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              aria-label="Change profile photo"
              className="group relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Avatar className="size-24 ring-4 ring-card sm:size-28">
                <AvatarImage
                  src={profile.profileImage ?? undefined}
                  alt={name}
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white transition-opacity ${
                  isPending
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-0"
                }`}
              >
                {isPending ? (
                  <Spinner className="size-6" />
                ) : (
                  <Camera className="size-6" aria-hidden="true" />
                )}
              </span>
            </button>

            {/* Touch screens have no hover, so keep a visible camera badge */}
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm"
            >
              <Camera className="size-4" />
            </span>

            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_IMAGES.join(",")}
              onChange={handleSelect}
              className="sr-only"
              aria-label="Upload profile photo"
            />
          </div>

          <div className="min-w-0 flex-1 sm:pb-1">
            <h2 className="truncate font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              {name}
            </h2>
            <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              {profile.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck aria-hidden="true" />
                {ROLE_LABEL[profile.role]}
              </Badge>
              {department && (
                <Badge variant="outline" className="gap-1">
                  <Building2 aria-hidden="true" />
                  {department}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          JPEG, PNG or WEBP, up to 5 MB. Click your photo to change it.
        </p>
      </CardContent>
    </Card>
  );
}

function AccountCard({ profile }: { profile: AuthUser }) {
  const google = profile.authProvider === "GOOGLE";

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Account status",
      value: <StatusBadge status={profile.status ?? "ACTIVE"} />,
    },
    {
      label: "Sign-in method",
      value: google ? "Google" : "Email and password",
    },
    {
      label: "Email",
      value: profile.isEmailVerified ? (
        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
          <BadgeCheck className="size-4" aria-hidden="true" /> Verified
        </span>
      ) : (
        "Not verified"
      ),
    },
    { label: "Member since", value: formatDate(profile.createdAt) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your sign-in and security status.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y text-sm">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="text-right font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function DetailsForm({ profile }: { profile: AuthUser }) {
  const role = profile.role;
  const { mutate: save, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      fullName:
        profile.citizenProfile?.fullName ??
        profile.staffProfile?.fullName ??
        profile.adminProfile?.fullName ??
        "",
      phone: profile.citizenProfile?.phone ?? "",
      address: profile.citizenProfile?.address ?? "",
      title: profile.staffProfile?.title ?? "",
    },
    validators: {
      onChange: UpdateProfileZodSchema,
      onSubmit: UpdateProfileZodSchema,
    },
    onSubmit: ({ value }) => {
      const payload: Record<string, string> = {
        fullName: value.fullName.trim(),
      };
      if (role === "CITIZEN") {
        if (value.phone.trim()) payload.phone = value.phone.trim();
        if (value.address.trim()) payload.address = value.address.trim();
      }
      if (role === "STAFF" && value.title.trim()) {
        payload.title = value.title.trim();
      }

      save(payload, {
        onSuccess: () => {
          toast.success("Profile updated");
          form.reset(value); // saved values become the new baseline
        },
        onError: (error) =>
          toast.error("Could not update profile", {
            description: getApiErrorMessage(error),
          }),
      });
    },
  });

  const visible = DETAIL_FIELDS.filter((f) =>
    (f.roles as readonly UserRole[]).includes(role),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Your email is your login and can't be changed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Field className="space-y-1.5">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" value={profile.email} disabled className="h-10" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((item) => (
              <form.Field key={item.name} name={item.name}>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className={`space-y-1.5 ${item.name === "address" ? "sm:col-span-2" : ""}`}
                    >
                      <FieldLabel htmlFor={field.name}>{item.label}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        autoComplete={item.autoComplete}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            ))}
          </div>

          <form.Subscribe selector={(s) => s.isDirty}>
            {(dirty) => (
              <div className="flex flex-wrap items-center gap-3 border-t pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !dirty}
                  className="h-10 px-5"
                >
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" /> Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isPending || !dirty}
                  onClick={() => form.reset()}
                  className="h-10 gap-1.5"
                >
                  <Undo2 className="size-4" /> Reset
                </Button>
                {dirty && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Unsaved changes
                  </span>
                )}
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm({ profile }: { profile: AuthUser }) {
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
  });
  const { mutate: change, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "" },
    validators: {
      onChange: ChangePasswordZodSchema,
      onSubmit: ChangePasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      change(value, {
        onSuccess: () => {
          toast.success("Password changed");
          form.reset();
        },
        onError: (error) =>
          toast.error("Could not change password", {
            description: getApiErrorMessage(error),
          }),
      });
    },
  });

  if (profile.authProvider === "GOOGLE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            You sign in with Google, so there is no password to manage here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4 text-primary" aria-hidden="true" />
          Change password
        </CardTitle>
        <CardDescription>
          {profile.mustChangePassword
            ? "You are using a temporary password. Please choose your own."
            : "Choose a strong password you don't use anywhere else."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {PASSWORD_FIELDS.map((item) => (
            <form.Field key={item.name} name={item.name}>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const visible = show[item.name];
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name}>{item.label}</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={visible ? "text" : "password"}
                        autoComplete={item.autoComplete}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((s) => ({ ...s, [item.name]: !s[item.name] }))
                        }
                        aria-label={`${visible ? "Hide" : "Show"} ${item.label.toLowerCase()}`}
                        className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {visible ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    {item.name === "newPassword" && field.state.value && (
                      <PasswordChecklist value={field.state.value} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          ))}

          <Button type="submit" disabled={isPending} className="h-10 px-5">
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Updating...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
