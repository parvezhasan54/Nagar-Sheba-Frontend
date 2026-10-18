"use client";

import { useForm } from "@tanstack/react-form";
import { CircleCheck, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TextField } from "@/components/shared/TextField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSubscribe } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { SubscribeZodSchema } from "@/validation";

export function Newsletter() {
  const { mutate: subscribe, isPending } = useSubscribe();
  const [done, setDone] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: {
      onChange: SubscribeZodSchema,
      onSubmit: SubscribeZodSchema,
    },
    onSubmit: ({ value }) => {
      subscribe(
        { email: value.email.trim() },
        {
          onSuccess: () => {
            toast.success("You're subscribed", {
              description: "Check your inbox for a confirmation.",
            });
            form.reset();
            setDone(true);
          },
          onError: (error) =>
            toast.error("Could not subscribe", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  return (
    <div className="grid items-center gap-8 rounded-2xl border bg-card p-6 sm:p-10 lg:grid-cols-2">
      <div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          Get service updates by email
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          New guides, service changes and fee updates from Nagar Sheba. No spam,
          and one email is all we send to confirm.
        </p>
      </div>

      {done ? (
        <output className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
          <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
          <span>
            You're on the list.{" "}
            <button
              type="button"
              onClick={() => setDone(false)}
              className="font-medium underline underline-offset-2"
            >
              Subscribe another email
            </button>
          </span>
        </output>
      ) : (
        <form
          noValidate
          className="flex flex-col gap-3 sm:flex-row sm:items-start"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex-1">
            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              )}
            </form.Field>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 gap-2 px-5 sm:mt-[1.625rem]"
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Subscribing...
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden="true" /> Subscribe
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
