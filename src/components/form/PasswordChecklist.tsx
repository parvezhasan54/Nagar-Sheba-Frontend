import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "At least 6 characters", test: (v: string) => v.length >= 8},
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One digit", test: (v: string) => /\d/.test(v) },
  {
    label: "One special character (@ $ ! % * ? &)",
    test: (v: string) => /[@$!%*?&]/.test(v),
  },
];

const LEVELS = [
  { label: "Too weak", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-primary" },
  { label: "Good", bar: "bg-primary" },
  { label: "Strong", bar: "bg-green-600" },
];

export function PasswordChecklist({ value }: { value: string }) {
  const score = RULES.filter((r) => r.test(value)).length;
  const level = LEVELS[score];

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {RULES.map((rule, i) => (
            <span
              key={rule.label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i < score ? level.bar : "bg-muted",
              )}
            />
          ))}
        </div>
        <span className="w-14 text-right text-xs font-medium text-muted-foreground">
          {value ? level.label : ""}
        </span>
      </div>

      <ul
        aria-label="Password requirements"
        className="grid gap-1 sm:grid-cols-2"
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
    </div>
  );
}
