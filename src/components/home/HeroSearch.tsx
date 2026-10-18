"use client";

import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchSuggest } from "@/hook";
import { useDebounce } from "@/hook/useDebounce";

export function HeroSearch() {
  const router = useRouter();
  const listId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(value, 300);
  const { data } = useSearchSuggest(debounced);

  const items =
    value.trim().length >= 2 ? (data?.data.suggestions ?? []) : [];
  const showList = open && items.length > 0;

  return (
    <search className="mx-auto mt-6 w-full max-w-xl">
      <form
        className="relative flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const q = value.trim();
          setOpen(false);
          router.push(
            q ? `/services?search=${encodeURIComponent(q)}` : "/services",
          );
        }}
      >
        <div className="relative min-w-0 flex-1 text-left">
          <label htmlFor="hero-search" className="sr-only">
            Search city services
          </label>
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="hero-search"
            name="search"
            type="search"
            value={value}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            placeholder="Try: pothole, trade licence, dark street"
            className="h-11 bg-background pl-9"
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          />

          {showList && (
            <ul
              id={listId}
              className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg"
            >
              {data?.data.source === "ai" && (
                <li className="flex items-center gap-1.5 border-b px-3 py-1.5 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  AI suggestions
                </li>
              )}
              {items.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.id}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setOpen(false)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {s.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {s.department}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-primary">
                      {s.fee}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" size="xl" className="shrink-0">
          Search
        </Button>
      </form>
    </search>
  );
}