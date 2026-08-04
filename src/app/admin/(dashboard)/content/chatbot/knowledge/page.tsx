import Link from "next/link";
import { getAdminKnowledgeEntries } from "@/features/chat/chat-admin-queries";
import { deleteKnowledgeEntry } from "@/features/chat/chat-admin-actions";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  services: "Services",
  pricing: "Pricing",
  process: "Process",
  support: "Support",
  about: "About",
};

export default async function AdminKnowledgePage() {
  const rows = await getAdminKnowledgeEntries();

  return (
    <AdminList
      title="Knowledge Base"
      description="Facts the AI chatbot can answer from."
      createHref="/admin/content/chatbot/knowledge/new"
      createLabel="New Entry"
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        {
          header: "Title",
          render: (r) => (
            <span className="font-medium">
              {resolveTranslation(r.title_translations, "en") || "—"}
            </span>
          ),
        },
        {
          header: "Slug",
          render: (r) => <span className="font-mono text-xs text-text-muted">{r.slug}</span>,
        },
        {
          header: "Category",
          render: (r) => (
            <Badge variant="neutral">{CATEGORY_LABELS[r.category] ?? r.category}</Badge>
          ),
        },
        {
          header: "Priority",
          render: (r) => <span className="text-text-secondary">{r.priority}</span>,
        },
        {
          header: "Status",
          render: (r) =>
            r.is_enabled ? (
              <Badge variant="success">Enabled</Badge>
            ) : (
              <Badge variant="warning">Disabled</Badge>
            ),
        },
        {
          header: "AI",
          render: (r) =>
            r.is_ai_eligible ? (
              <Badge variant="information">Available</Badge>
            ) : (
              <Badge variant="neutral">Hidden</Badge>
            ),
        },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/chatbot/knowledge/${r.id}/edit`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteKnowledgeEntry.bind(null, r.id)}
            title="Delete knowledge entry"
            description="This will permanently remove this entry from the AI chatbot's knowledge."
          />
        </div>
      )}
    />
  );
}
