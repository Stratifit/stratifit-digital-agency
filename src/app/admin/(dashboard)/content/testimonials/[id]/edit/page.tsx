import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content/content-form";
import { getContentItem } from "@/features/content/get-admin-item";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getContentItem("testimonials", id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Edit Testimonial</h1>
      </div>
      <div className="rounded-md border border-border bg-surface p-6">
        <ContentForm type="testimonials" id={id} initial={item} />
      </div>
    </div>
  );
}
