// ============================================================================
// Stratifit — Navigation Header Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";
import type { ServiceIconId } from "@/components/ui/icons";

/** A single navigation link */
export interface NavigationHeaderLink {
  id: string;
  label: string;
  href: string;
}

/** A language option displayed in the header / mobile menu */
export interface NavigationHeaderLanguage {
  id: CmsLanguage;
  flag: string;
  code: string;
  name: string;
}

/** A service card shown in the mobile menu */
export interface NavigationHeaderService {
  id: string;
  title: string;
  description: string;
  href: string;
  iconId: ServiceIconId;
}

/** A footer link shown in the mobile menu */
export interface NavigationHeaderFooterLink {
  id: string;
  label: string;
  href: string;
}

/** A quick action button in the chat overlay */
export interface NavigationHeaderQuickAction {
  id: string;
  label: string;
}

/** Chat-specific content */
export interface NavigationHeaderChat {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  userMessage: string;
  quickActions: NavigationHeaderQuickAction[];
}

/** A language option shown in the chat overlay */
export interface NavigationHeaderChatLanguage {
  flag: string;
  code: string;
  name: string;
}

/** Shape of the `content` JSONB column */
export interface NavigationHeaderContent {
  links: NavigationHeaderLink[];
  cta: NavigationHeaderLink;
  languages: NavigationHeaderLanguage[];
  services: NavigationHeaderService[];
  footerLinks: NavigationHeaderFooterLink[];
  chat: NavigationHeaderChat;
  chatLanguages: NavigationHeaderChatLanguage[];
  desktopChatPill: string;
  builtBy: string;
  copyright: string;
}

/** Translation overrides keyed by locale then flat dot-path */
export type NavigationHeaderTranslations = Record<
  CmsLanguage,
  Record<string, string>
>;

/** A navigation header row as stored in Supabase */
export interface CmsNavigationHeader {
  id: string;
  displayOrder: number;
  sticky: boolean;
  content: NavigationHeaderContent;
  translations: Partial<NavigationHeaderTranslations>;
  url: string;
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) before mapping */
export interface NavigationHeaderRow {
  id: string;
  display_order: number;
  sticky: boolean;
  content: NavigationHeaderContent;
  translations: Partial<NavigationHeaderTranslations>;
  url: string;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case row to camelCase domain type */
export function mapNavigationHeader(
  row: NavigationHeaderRow
): CmsNavigationHeader {
  return {
    id: row.id,
    displayOrder: row.display_order,
    sticky: row.sticky,
    content: row.content,
    translations: row.translations,
    url: row.url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
