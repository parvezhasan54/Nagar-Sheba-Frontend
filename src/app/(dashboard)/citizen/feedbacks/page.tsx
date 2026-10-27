import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackList } from "@/components/admin/FeedbackList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Feedback" };

export default function CitizenFeedbackPage() {
  return (
    <>
      <PageHeader
        title="My feedback"
        description="Ratings you have left on resolved requests."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <FeedbackList requestBasePath="/citizen/requests" />
      </Suspense>
    </>
  );
}
