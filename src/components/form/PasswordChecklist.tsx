import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One digit", test: (v: string) => /\d/.test(v) },
  {
    label: "One special character (@ $ ! % * ? &)",
    test: (v: string) => /[@$!%*?&]/.test(v),
  },
];

export function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul
      aria-label="Password requirements"
      className="grid gap-1 pt-1 sm:grid-cols-2"
    >
      {RULES.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              met
                ? "text-green-700 dark:text-green-400"
                : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {rule.label}
              <span className="sr-only">
                {met ? " (met)" : " (not met yet)"}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
