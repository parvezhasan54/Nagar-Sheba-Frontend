import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { HOME_FAQS } from "@/lib/faq";

export function FaqPreview() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">
      <Reveal>
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions, answered"
          description="The basics of filing, paying, refunds and reopening."
        />
        <Link
          href="/faq"
          className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all FAQs
        </Link>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="divide-y rounded-xl border bg-card">
          {HOME_FAQS.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </div>
  );
}