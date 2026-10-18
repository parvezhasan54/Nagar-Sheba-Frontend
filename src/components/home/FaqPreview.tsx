
import Link from "next/link";
import { AnimatedFaq } from "@/components/home/AnimatedFaq";
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
        <AnimatedFaq items={HOME_FAQS} />
      </Reveal>
    </div>
  );
}
