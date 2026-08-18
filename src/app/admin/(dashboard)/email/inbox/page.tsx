import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailInboxView } from "@/components/admin/email-inbox-view";
import {
  getEmailSectionsWithCounts,
  getEmailThreads,
} from "@/features/email-inbox/queries";
import { THREAD_STATUSES, type ThreadStatus } from "@/features/email-inbox/schemas";

export const metadata = {
  title: "Email Inbox",
};

interface PageProps {
  searchParams: Promise<{ section?: string; status?: string }>;
}

function isValidStatus(value: string | undefined): value is ThreadStatus {
  return !!value && (THREAD_STATUSES as readonly string[]).includes(value);
}

export default async function AdminEmailInboxPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const sections = await getEmailSectionsWithCounts();

  const activeSlug =
    sections.find((s) => s.slug === params.section)?.slug ?? sections[0]?.slug ?? "other";
  const activeStatus = isValidStatus(params.status) ? params.status : undefined;
  const activeSection = sections.find((s) => s.slug === activeSlug);

  const threads = activeSection
    ? await getEmailThreads(activeSection.id, activeStatus)
    : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email Inbox"
        description="Customer emails, form enquiries, and reply-by-email conversations — grouped by section."
      />
      <Suspense fallback={<div className="text-sm text-text-muted">Loading…</div>}>
        <EmailInboxView
          sections={sections}
          activeSlug={activeSlug}
          activeStatus={activeStatus}
          threads={threads}
        />
      </Suspense>
    </div>
  );
}
