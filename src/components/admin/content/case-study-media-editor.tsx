"use client";

import * as React from "react";
import { useWatch, type Control, type FieldValues, type UseFormSetValue } from "react-hook-form";
import { uploadMediaAsset } from "@/features/media/mutations";
import {
  aspectMatches,
  formatAspect,
  readImageSize,
  recommendedSizeLabel,
  type AspectTarget,
} from "@/lib/image-dimensions";
import { Label } from "@/components/ui/label";
import {
  CASE_STUDY_MEDIA_SECTIONS,
  emptyCaseStudySectionMedia,
  type CaseStudyMediaAsset,
  type CaseStudySectionMediaMap,
} from "@/features/portfolio/case-study-media";

const LABELS: Record<string, string> = {
  overview: "Project overview",
  discovery: "Discovery & strategy",
  concept: "Visual identity concept",
  "identity-assets": "Identity assets",
  "visual-applications": "Visual applications",
  launch: "Launch & activation",
  "launch-physical": "Physical touchpoints",
  "launch-guidelines": "Brand guidelines",
  "brand-in-action": "Brand in action",
};

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif";

// Render targets for each asset type — the main image and every thumbnail
// display as full-size slides in the same 4:3 frame on the public
// case-study page (the small square strip below is just navigation).
const MAIN_IMAGE_TARGET: AspectTarget = { width: 4, height: 3 };
const THUMBNAIL_TARGET: AspectTarget = { width: 4, height: 3 };

function AssetPicker({
  value,
  onChange,
  target,
  recommended,
}: {
  value: CaseStudyMediaAsset;
  onChange: (value: CaseStudyMediaAsset) => void;
  target: AspectTarget;
  recommended: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [warning, setWarning] = React.useState<string | null>(null);
  async function upload(file: File) {
    setUploading(true);
    setError(null);
    setWarning(null);
    try {
      const size = await readImageSize(file);
      if (size && !aspectMatches(size, target)) {
        setWarning(
          `This image is ${formatAspect(size.width, size.height)} — it will be cropped to ${formatAspect(target.width, target.height)} in the section. Recommended: ${recommended}.`
        );
      }
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "portfolio-images");
      formData.set("alt_text", file.name);
      const result = await uploadMediaAsset(formData);
      if (result.success) onChange({ media_id: result.data.id, image_url: result.data.url });
      else setError(result.error);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-input border border-card-border bg-background">
        {value.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
            <img src={value.image_url} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange({ media_id: "", image_url: "" })} className="absolute right-2 top-2 rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-error">Remove</button>
          </>
        ) : (
          <label className="flex h-full cursor-pointer items-center justify-center text-xs text-text-muted hover:bg-surface-hover">
            Add image<input className="sr-only" type="file" accept={ACCEPT} disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); }} />
          </label>
        )}
        {uploading ? <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">Uploading…</span> : null}
      </div>
      {warning ? <p className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-1.5 text-xs text-primary">{warning}</p> : null}
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}

export function CaseStudyMediaEditor({ control, setValue }: { control: Control<FieldValues>; setValue: UseFormSetValue<FieldValues> }) {
  const raw = useWatch({ control, name: "case_study_section_media" });
  const media = (raw ?? emptyCaseStudySectionMedia()) as CaseStudySectionMediaMap;
  function patch(section: keyof CaseStudySectionMediaMap, next: Partial<CaseStudySectionMediaMap[keyof CaseStudySectionMediaMap]>) {
    setValue("case_study_section_media", { ...media, [section]: { ...media[section], ...next } });
  }
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-primary/20 bg-primary/5 p-4 text-sm text-text-secondary">
        Each public case-study section has its own main image and up to six thumbnails. Uploads are saved with the project when you select <strong className="text-primary">Save Changes</strong>.
      </div>
      {CASE_STUDY_MEDIA_SECTIONS.map((section) => {
        const value = media[section] ?? { main: { media_id: "", image_url: "" }, thumbnails: [] };
        return (
          <div key={section} className="rounded-card border border-white/5 bg-background p-4 space-y-4">
            <div><h3 className="font-display text-lg font-bold text-text-primary">{LABELS[section]}</h3><p className="mt-1 text-xs text-text-muted">Main visual and supporting thumbnail images shown in this section.</p></div>
            <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_minmax(0,1.4fr)]">
              <div className="space-y-2">
                <Label>Main image</Label>
                <p className="text-[11px] text-text-muted">Recommended: <span className="font-semibold text-primary">{recommendedSizeLabel(1600, 1200)}</span> — fits the 4:3 section frame without cutting.</p>
                <AssetPicker value={value.main} target={MAIN_IMAGE_TARGET} recommended={recommendedSizeLabel(1600, 1200)} onChange={(main) => patch(section, { main })} />
              </div>
              <div className="space-y-2">
                <Label>Thumbnails</Label>
                <p className="text-[11px] text-text-muted">Recommended: same as the main image, <span className="font-semibold text-primary">{recommendedSizeLabel(1600, 1200)}</span> — thumbnails also fill the 4:3 frame as full slides.</p>
                <div className="grid grid-cols-3 gap-2">{Array.from({ length: 6 }, (_, index) => {
                  const thumb = value.thumbnails[index] ?? { media_id: "", image_url: "" };
                  return <AssetPicker key={index} value={thumb} target={THUMBNAIL_TARGET} recommended={recommendedSizeLabel(1600, 1200)} onChange={(next) => { const thumbnails = [...value.thumbnails]; thumbnails[index] = next; patch(section, { thumbnails }); }} />;
                })}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
