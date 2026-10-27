import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackList } from "@/components/admin/FeedbackList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Reviews" };

export default function StaffFeedbackPage() {
  return (
    <>
      <PageHeader
        title="Reviews"
        description="Citizen ratings on your department's resolved requests."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <FeedbackList requestBasePath="/staff/requests" />
      </Suspense>
    </>
  );
}
