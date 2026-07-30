// ============================================================================
// Stratifit — Navigation Header Section
// Client component: fetches global header data and renders desktop nav,
// mobile nav, and chat overlay. All content comes from Supabase.
// ============================================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setLocaleCookie } from "@/lib/locale.client";
import type { CmsLanguage } from "@/lib/types/cms";
import type { ResolvedBlock } from "@/lib/types/cms";
import type {
  CmsNavigationHeader,
  NavigationHeaderContent,
  NavigationHeaderTranslations,
} from "@/lib/types/navigationHeader";
import {
  MenuIcon,
  ChevronDown,
  CloseIcon,
  ArrowUpRight,
  DoubleChatBubbleIcon,
  BrandIcon,
  HeartIcon,
  LockIcon,
  EditIcon,
  AttachIcon,
  SendIcon,
  SERVICE_ICONS,
} from "@/components/ui/icons";

function getIconForService(iconId: string) {
  return (SERVICE_ICONS as Record<string, typeof BrandIcon>)[iconId] ?? BrandIcon;
}

/** Build the language-switch URL for a given locale from the current path. */
function getLocalePath(currentPath: string, locale: CmsLanguage): string {
  return `${currentPath}?lang=${locale}`;
}

function resolveTranslation(
  content: NavigationHeaderContent,
  translations: Partial<NavigationHeaderTranslations>,
  locale: CmsLanguage,
  path: string,
  fallback: string
): string {
  if (locale === "en") return fallback;
  const value = translations[locale]?.[path];
  return value ?? fallback;
}

interface NavigationHeaderSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
  initialData?: CmsNavigationHeader;
}

export function NavigationHeaderSection({
  locale: initialLocale,
  initialData,
}: NavigationHeaderSectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>(initialLocale);
  const [data, setData] = useState<CmsNavigationHeader | null>(
    initialData ?? null
  );
  const [loading, setLoading] = useState(!initialData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [chatLangOpen, setChatLangOpen] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Client-side fallback: fetch the header if it wasn't provided by a
  // server component parent. This keeps the section reusable inside
  // dynamic CMS pages without requiring them to pre-fetch it.
  useEffect(() => {
    if (initialData) return;

    async function fetchData() {
      try {
        const res = await fetch("/api/cms/navigation-header");
        if (!res.ok) throw new Error("Failed to fetch navigation header");
        const json = (await res.json()) as CmsNavigationHeader;
        setData(json);
      } catch (err) {
        console.error("[NavigationHeaderSection]", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [initialData]);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const track = carouselRef.current;
    const card = track.querySelector(".service-card");
    if (!card) return;
    const cardWidth = (card as HTMLElement).offsetWidth + 12;
    const activeIndex = Math.round(track.scrollLeft / cardWidth);
    setActiveDot(activeIndex);
  }, []);

  if (loading || !data) return null;

  const { content, translations } = data;

  const t = (path: string, fallback: string) =>
    resolveTranslation(content, translations, activeLocale, path, fallback);

  const currentLang =
    content.languages.find((l) => l.id === activeLocale) ?? content.languages[0];

  const handleLanguageChange = useCallback(
    (newLocale: CmsLanguage) => {
      setActiveLocale(newLocale);
      setLocaleCookie(newLocale);
      setLangOpen(false);
      router.refresh();
    },
    [router]
  );

  const chatLangs = content.chatLanguages;

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-surface-dark border-b border-surface-darkBorder [.has-sticky-bar_&]:top-8 sm:[.has-sticky-bar_&]:top-9">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-md text-white hover:bg-surface-darkCard active:bg-surface-darkAlt transition-colors"
          >
            <MenuIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          <div className="flex-1 flex justify-center">
            <Logo href={getLocalePath("/", activeLocale)} />
          </div>

          <button
            onClick={() => setChatOpen(true)}
            className="w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-gold-glow"
            aria-label="Open chat"
          >
            <DoubleChatBubbleIcon className="text-surface-dark w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Desktop top bar */}
      <header className="hidden lg:flex sticky top-0 z-40 w-full bg-surface-dark border-b border-surface-darkBorder [.has-sticky-bar_&]:top-8 sm:[.has-sticky-bar_&]:top-9">
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          <Logo href={getLocalePath("/", activeLocale)} />

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link
                href={getLocalePath("/", activeLocale)}
                className="text-white text-sm font-medium hover:text-brand-gold transition-colors font-body"
              >
                {t("links.home.label", "Home")}
              </Link>
              {content.links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-white text-sm font-medium hover:text-brand-gold transition-colors font-body"
                >
                  {t(`links.${link.id}.label`, link.label)}
                </Link>
              ))}
            </nav>

            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`border rounded-2xl px-3 py-1.5 text-body-sm font-semibold flex items-center gap-1.5 transition-all ${
                  langOpen
                    ? "bg-surface-darkHover border-brand-gold text-brand-gold"
                    : "border-surface-darkBorder text-white hover:bg-surface-darkCard hover:border-neutral-700"
                }`}
              >
                <span className="font-body">
                  {currentLang.flag} {currentLang.code.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-surface-darkCard border border-surface-darkBorder rounded-xl p-1.5 min-w-[130px] z-20 shadow-card animate-slide-in">
                  {content.languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleLanguageChange(l.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-body-sm font-medium rounded-md transition-all text-left ${
                        currentLang.id === l.id
                          ? "bg-brand-gold/10 text-brand-gold"
                          : "text-neutral-400 hover:bg-surface-darkHover hover:text-white"
                      }`}
                    >
                      <span className="font-body">
                        {l.flag} {t(`languages.${l.id}.name`, l.name)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={content.cta.href}
              className="bg-brand-gold text-surface-dark font-bold text-body-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand-gold-600 transition-colors font-body"
            >
              {t("cta.label", content.cta.label)}
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop chat pill */}
      <DesktopChatPill
        label={t("desktopChatPill", content.desktopChatPill)}
        onClick={() => setChatOpen(true)}
      />

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={menuOpen}
        content={content}
        translations={translations}
        locale={activeLocale}
        onLanguageChange={handleLanguageChange}
        activeDot={activeDot}
        onDotChange={setActiveDot}
        onClose={() => setMenuOpen(false)}
        onChatOpen={() => {
          setMenuOpen(false);
          setChatOpen(true);
        }}
        carouselRef={carouselRef}
        onScroll={handleScroll}
      />

      {/* Chat overlay */}
      {chatOpen && (
        <ChatOverlay
          content={content}
          translations={translations}
          locale={activeLocale}
          chatLangs={chatLangs}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}

// ---- Logo ----
function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="select-none">
      <Image
        src="/stratifit-logo.png"
        alt="Stratifit"
        width={40}
        height={40}
        className="h-10 w-auto rounded-md shadow-gold-glow object-contain"
        priority
      />
    </Link>
  );
}

// ---- Desktop Chat Pill ----
function DesktopChatPill({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="hidden lg:flex items-center gap-3 fixed bottom-6 right-6 z-40 bg-surface-darkAlt rounded-full pl-4 pr-2 py-2 border border-surface-darkBorder shadow-elevated">
      <span className="text-white text-xs font-medium whitespace-nowrap flex items-center font-body">
        <DoubleChatBubbleIcon className="inline text-brand-gold mr-1.5 w-4 h-4" />
        {label}
      </span>
      <button
        onClick={onClick}
        className="relative w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-gold-glow"
        aria-label="Open chat"
      >
        <DoubleChatBubbleIcon className="text-surface-dark w-5 h-5" />
      </button>
    </div>
  );
}

// ---- Mobile Menu ----
function MobileMenu({
  isOpen,
  content,
  translations,
  locale,
  onLanguageChange,
  activeDot,
  onDotChange,
  onClose,
  onChatOpen,
  carouselRef,
  onScroll,
}: {
  isOpen: boolean;
  content: NavigationHeaderContent;
  translations: Partial<NavigationHeaderTranslations>;
  locale: CmsLanguage;
  onLanguageChange: (locale: CmsLanguage) => void;
  activeDot: number;
  onDotChange: (index: number) => void;
  onClose: () => void;
  onChatOpen: () => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}) {
  const [langOpen, setLangOpen] = useState(false);

  // Close on escape and lock body scroll while the menu is open.
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = (path: string, fallback: string) =>
    resolveTranslation(content, translations, locale, path, fallback);

  const currentLang =
    content.languages.find((l) => l.id === locale) ?? content.languages[0];

  return (
    <div className="fixed inset-0 z-[90] flex justify-center bg-surface-dark h-screen overflow-hidden animate-menu-in pointer-events-auto">
      <div className="w-full max-w-[430px] bg-surface-dark h-[100dvh] relative flex flex-col border-l border-r border-surface-darkBorder overflow-hidden">
        <header className="flex justify-between items-center px-6 py-5 border-b border-surface-darkBorder flex-shrink-0 relative z-10 bg-surface-dark">
          <Link href={getLocalePath("/", locale)} className="select-none">
            <Image
              src="/stratifit-logo.png"
              alt="Stratifit"
              width={40}
              height={40}
              className="h-10 w-auto rounded-md object-contain"
            />
          </Link>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`border rounded-2xl px-3 py-1.5 text-body-sm font-semibold flex items-center gap-1.5 transition-all ${
                langOpen
                  ? "bg-surface-darkHover border-brand-gold text-brand-gold"
                  : "border-surface-darkBorder text-white hover:bg-surface-darkCard hover:border-neutral-700"
              }`}
            >
              <span className="font-body">
                {currentLang.flag} {currentLang.code.toUpperCase()}
              </span>
            </button>

            {langOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-surface-darkCard border border-surface-darkBorder rounded-xl p-1.5 min-w-[130px] z-20 shadow-card animate-slide-in">
                {content.languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onLanguageChange(l.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-body-sm font-medium rounded-md transition-all text-left ${
                      currentLang.id === l.id
                        ? "bg-brand-gold/10 text-brand-gold"
                        : "text-neutral-400 hover:bg-surface-darkHover hover:text-white"
                    }`}
                  >
                    <span className="font-body">
                      {l.flag} {t(`languages.${l.id}.name`, l.name)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="text-white text-xl opacity-80 hover:opacity-100 hover:rotate-90 transition-all duration-200 p-1"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <nav className="flex-1 overflow-y-auto scrollbar-hide">
          <Link
            href={getLocalePath("/", locale)}
            onClick={onClose}
            className="flex justify-between items-center px-6 py-3.5 text-white text-lg font-medium border-b border-surface-darkBorder hover:bg-surface-darkCard hover:pl-7 active:bg-surface-darkHover transition-all font-display"
          >
            {t("links.home.label", "Home")}{" "}
            <span className="text-lg opacity-40 hover:text-brand-gold">›</span>
          </Link>

          <div className="border-b border-surface-darkBorder">
            <Link
              href={content.services[0]?.href ?? "#"}
              className="flex justify-between items-center px-6 py-3.5 text-white text-lg font-medium hover:bg-surface-darkCard hover:pl-7 active:bg-surface-darkHover transition-all font-display"
              onClick={onClose}
            >
              {t("links.services.label", "Services")}{" "}
              <span className="text-lg opacity-40 hover:text-brand-gold">›</span>
            </Link>

            <div className="relative overflow-hidden">
              <div
                ref={carouselRef}
                onScroll={onScroll}
                className="flex gap-3 overflow-x-auto snap-x scrollbar-hide px-6 pb-2.5"
              >
                {content.services.map((service) => {
                  const Icon = getIconForService(service.iconId);
                  return (
                    <Link
                      key={service.id}
                      href={service.href}
                      onClick={onClose}
                      className="service-card flex-[0_0_70%] bg-surface-darkCard border border-surface-darkBorder rounded-xl p-3.5 snap-start flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-surface-dark flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-body-md font-semibold text-white font-display">
                            {t(
                              `services.${service.id}.title`,
                              service.title
                            )}
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-brand-gold opacity-70 flex-shrink-0" />
                      </div>
                      <div className="text-caption text-neutral-400 leading-[1.3] min-h-[31.2px] overflow-hidden font-body">
                        {t(
                          `services.${service.id}.description`,
                          service.description
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="absolute top-0 right-0 bottom-2.5 w-10 bg-gradient-to-r from-transparent to-surface-dark pointer-events-none z-[2]" />
            </div>

            <div className="flex justify-center gap-2 pb-3.5">
              {content.services.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    activeDot === i ? "bg-brand-gold" : "bg-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {content.links.slice(1).map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
              className="flex justify-between items-center px-6 py-3.5 text-white text-lg font-medium border-b border-surface-darkBorder hover:bg-surface-darkCard hover:pl-7 active:bg-surface-darkHover transition-all font-display"
            >
              {t(`links.${link.id}.label`, link.label)}{" "}
              <span className="text-lg opacity-40 hover:text-brand-gold">›</span>
            </Link>
          ))}
        </nav>

        <footer className="px-6 py-5 flex-shrink-0 bg-surface-dark z-[5] sticky bottom-0 border-t border-surface-darkBorder">
          <div className="flex justify-center gap-6 mb-3">
            {content.footerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-neutral-500 text-caption hover:text-white active:scale-95 transition-all font-body"
              >
                {t(`footerLinks.${link.id}.label`, link.label)}
              </Link>
            ))}
          </div>
          <p className="text-center text-neutral-600 text-xs font-body">
            {t("copyright", content.copyright)}
          </p>
        </footer>
      </div>
    </div>
  );
}

// ---- Chat Overlay ----
function ChatOverlay({
  content,
  translations,
  locale,
  chatLangs,
  onClose,
}: {
  content: NavigationHeaderContent;
  translations: Partial<NavigationHeaderTranslations>;
  locale: CmsLanguage;
  chatLangs: { flag: string; code: string; name: string }[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Chat");
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(chatLangs[0]);
  const [userName, setUserName] = useState("001 username");
  const [editingName, setEditingName] = useState(false);
  const t = (path: string, fallback: string) =>
    resolveTranslation(content, translations, locale, path, fallback);

  const navTabs = ["Chat", "FAQ", "Services", "Pricing", "About", "Support", "Contact"];

  function handleSaveName(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setEditingName(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-col bg-surface-darkCard animate-slide-in h-[85vh] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] sm:rounded-xl shadow-modal border border-surface-darkBorder overflow-hidden">
      <header className="flex items-center justify-between p-2 px-3 bg-white/[0.01] border-b border-surface-darkBorder backdrop-blur-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold text-surface-dark flex justify-center items-center font-extrabold text-xs relative">
            S
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-surface-darkCard" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white font-body">
              {t("chat.title", content.chat.title)}
            </h2>
            <div className="text-[9px] text-green-400 flex items-center gap-1 font-medium font-body">
              {t("chat.subtitle", content.chat.subtitle)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1 border px-1.5 py-0.5 rounded-2xl text-caption font-medium transition-all outline-none ${
                langOpen
                  ? "border-brand-gold text-white bg-brand-gold/5"
                  : "border-surface-darkBorder text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
              aria-label="Select Language"
            >
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.code}</span>
              <ChevronDown className="w-2 h-2" />
            </button>

            {langOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 bg-surface-darkCard border border-surface-darkBorder rounded-xl overflow-hidden min-w-[120px] shadow-lg z-20">
                {chatLangs.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l);
                      setLangOpen(false);
                    }}
                    className={`p-1.5 px-2.5 text-caption cursor-pointer flex items-center gap-1.5 transition-colors border-b border-surface-darkBorder last:border-b-none ${
                      selectedLang.code === l.code
                        ? "text-brand-gold font-semibold"
                        : "text-neutral-400 hover:bg-surface-darkHover hover:text-white"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 p-1 rounded-full transition-colors hover:bg-white/5 hover:text-white flex items-center"
            aria-label="Close chat"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <nav className="flex p-1.5 px-2 gap-1 border-b border-surface-darkBorder overflow-x-auto scrollbar-hide flex-shrink-0">
        {navTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-1 px-2 text-caption font-medium rounded-2xl transition-all outline-none whitespace-nowrap flex-shrink-0 font-body ${
              activeTab === tab
                ? "text-surface-dark bg-brand-gold font-semibold"
                : "text-neutral-500 border border-surface-darkBorder hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-3 flex-1 overflow-y-auto flex flex-col justify-end gap-3 relative z-1 min-h-0 scrollbar-hide">
        <div className="flex flex-col max-w-[85%] animate-slide-in self-start">
          <div className="bg-surface-darkCard p-2.5 rounded-[4px_12px_12px_12px] text-caption leading-[1.4] text-neutral-400 border border-surface-darkBorder font-body">
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-surface-darkBorder">
              <span className="text-brand-gold opacity-80 text-[10px] font-bold tracking-wide">
                {t("chat.title", content.chat.title)}
              </span>
            </div>
            {t("chat.welcomeMessage", content.chat.welcomeMessage)}
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-surface-darkBorder text-[8px] text-brand-gold opacity-75 tracking-wide uppercase font-medium font-body">
              <div className="flex items-center gap-1">
                <LockIcon className="w-2 h-2 opacity-75" />
                <span>Your data is safe</span>
              </div>
              <button className="text-brand-gold opacity-75 font-medium underline underline-offset-2 hover:opacity-100 bg-transparent border-none p-0">
                Read more
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[85%] animate-slide-in self-end items-end">
          <div className="bg-surface-darkHover p-2.5 rounded-[12px_12px_4px_12px] text-caption leading-[1.4] text-neutral-400 border border-surface-darkBorder font-body">
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-surface-darkBorder justify-end">
              {editingName ? (
                <input
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={handleSaveName}
                  onBlur={() => setEditingName(false)}
                  className="bg-transparent border border-surface-darkBorder rounded px-1 text-brand-gold text-[10px] font-bold w-24 outline-none focus:border-brand-gold"
                />
              ) : (
                <>
                  <span className="text-brand-gold opacity-80 text-[10px] font-bold tracking-wide">
                    {userName}
                  </span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-neutral-400 hover:text-brand-gold bg-transparent border-none p-0"
                    aria-label="Edit Name"
                  >
                    <EditIcon className="w-2.5 h-2.5" />
                  </button>
                </>
              )}
            </div>
            {t("chat.userMessage", content.chat.userMessage)}
          </div>
        </div>
      </main>

      <footer className="p-2 px-3 border-t border-surface-darkBorder bg-black/20 relative z-1 flex-shrink-0">
        <div className="flex items-center bg-surface-darkCard border border-surface-darkBorder rounded-lg p-1 pl-2.5 transition-colors focus-within:border-brand-gold">
          <input
            type="text"
            placeholder={t(
              "chat.inputPlaceholder",
              content.chat.inputPlaceholder
            )}
            className="flex-1 bg-transparent border-none outline-none text-white text-caption font-body py-1 placeholder:text-neutral-600"
          />
          <div className="flex items-center gap-0.5">
            <button
              className="text-neutral-400 p-1 rounded-md flex items-center justify-center hover:text-white bg-transparent border-none"
              aria-label="Upload File"
            >
              <AttachIcon className="w-3.5 h-3.5" />
            </button>
            <button
              className="bg-brand-gold border-none w-7 h-7 rounded-md text-surface-dark flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              aria-label="Send Message"
            >
              <SendIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 mt-2">
          {content.chat.quickActions.map((action) => (
            <button
              key={action.id}
              className="flex-1 flex items-center justify-center gap-1 bg-transparent border border-surface-darkBorder text-neutral-500 py-1 px-1 rounded-md text-[9px] font-semibold transition-all hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/5 whitespace-nowrap font-body"
            >
              {t(`chat.quickActions.${action.id}.label`, action.label)}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-1.5 text-center text-[9px] text-neutral-600 mt-2 tracking-wide uppercase font-medium opacity-60 font-body">
          <HeartIcon className="text-brand-gold opacity-60 flex-shrink-0" />
          <span>{t("builtBy", content.builtBy)}</span>
        </div>
      </footer>
    </div>
  );
}
