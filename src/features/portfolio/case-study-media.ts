export const CASE_STUDY_MEDIA_SECTIONS = [
  "overview",
  "discovery",
  "concept",
  "identity-assets",
  "visual-applications",
  "launch",
  "launch-physical",
  "launch-guidelines",
  "brand-in-action",
] as const;

export type CaseStudyMediaSection = (typeof CASE_STUDY_MEDIA_SECTIONS)[number];

export interface CaseStudyMediaAsset {
  media_id: string;
  image_url: string;
}

export interface CaseStudySectionMedia {
  main: CaseStudyMediaAsset;
  thumbnails: CaseStudyMediaAsset[];
}

export type CaseStudySectionMediaMap = Record<CaseStudyMediaSection, CaseStudySectionMedia>;

const emptyAsset = (): CaseStudyMediaAsset => ({ media_id: "", image_url: "" });
const emptySection = (): CaseStudySectionMedia => ({ main: emptyAsset(), thumbnails: [] });

export function emptyCaseStudySectionMedia(): CaseStudySectionMediaMap {
  return Object.fromEntries(
    CASE_STUDY_MEDIA_SECTIONS.map((key) => [key, emptySection()])
  ) as CaseStudySectionMediaMap;
}

export function normalizeCaseStudySectionMedia(raw: unknown): CaseStudySectionMediaMap {
  const result = emptyCaseStudySectionMedia();
  if (!raw || typeof raw !== "object") return result;
  const source = raw as Record<string, unknown>;
  for (const key of CASE_STUDY_MEDIA_SECTIONS) {
    const section = source[key];
    if (!section || typeof section !== "object") continue;
    const data = section as Record<string, unknown>;
    const asset = (value: unknown): CaseStudyMediaAsset => {
      if (!value || typeof value !== "object") return emptyAsset();
      const item = value as Record<string, unknown>;
      return {
        media_id: typeof item.media_id === "string" ? item.media_id : "",
        image_url: typeof item.image_url === "string" ? item.image_url : "",
      };
    };
    result[key] = {
      main: asset(data.main),
      thumbnails: Array.isArray(data.thumbnails)
        ? data.thumbnails.map(asset).filter((item) => item.image_url || item.media_id).slice(0, 6)
        : [],
    };
  }
  return result;
}
