import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailInboxView } from "@/components/admin/email-inbox-view";
import { ImapStatusPanel } from "@/components/admin/imap-status-panel";
import { getImapStatus } from "@/features/email-imap/status";
import {
  getEmailSectionsWithCounts,
  getEmailThreadsPage,
} from "@/features/email-inbox/queries";
import { THREAD_STATUSES, type ThreadStatus } from "@/features/email-inbox/schemas";
import {
  SUPPORTED_EMAIL_LANGUAGES,
  type EmailLanguage,
} from "@/features/email-inbox/language";

export const metadata = {
  title: "Email Inbox",
};

interface PageProps {
  searchParams: Promise<{
    section?: string;
    status?: string;
    language?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 25;

function isValidStatus(value: string | undefined): value is ThreadStatus {
  return !!value && (THREAD_STATUSES as readonly string[]).includes(value);
}

function isValidLanguage(value: string | undefined): value is EmailLanguage {
  return !!value && (SUPPORTED_EMAIL_LANGUAGES as readonly string[]).includes(value);
}

export default async function AdminEmailInboxPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const sections = await getEmailSectionsWithCounts();

  const activeSlug =
    sections.find((s) => s.slug === params.section)?.slug ?? sections[0]?.slug ?? "other";
  const activeStatus = isValidStatus(params.status) ? params.status : undefined;
  const activeLanguage = isValidLanguage(params.language)
    ? params.language
    : undefined;
  const activeSection = sections.find((s) => s.slug === activeSlug);
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const { threads, total } = activeSection
    ? await getEmailThreadsPage(activeSection.id, activeStatus, activeLanguage, {
        page,
        pageSize: PAGE_SIZE,
      })
    : { threads: [], total: 0 };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email Inbox"
        description="Customer emails, form enquiries, and reply-by-email conversations — grouped by section."
      />
      <Suspense
        fallback={
          <div className="rounded-card border border-card-border bg-card-dark p-4 text-sm text-text-muted shadow-sm">
            Checking IMAP connection…
          </div>
        }
      >
        <ImapStatusPanel status={await getImapStatus()} />
      </Suspense>
      <Suspense fallback={<div className="text-sm text-text-muted">Loading…</div>}>
        <EmailInboxView
          sections={sections}
          activeSlug={activeSlug}
          activeStatus={activeStatus}
          activeLanguage={activeLanguage}
          threads={threads}
          total={total}
          page={Math.min(page, totalPages)}
          pageSize={PAGE_SIZE}
        />
      </Suspense>
    </div>
  );
}
