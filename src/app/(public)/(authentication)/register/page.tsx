import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/form/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Nagar Sheba citizen account.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[680px] w-full rounded-xl" />}>
      <RegisterForm />
    </Suspense>
  );
}
