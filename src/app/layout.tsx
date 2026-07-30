// ============================================================================
// Stratifit — Root Layout
// Sets up fonts, metadata, and the global HTML shell.
// No hardcoded content — that is the CMS's job.
// ============================================================================

import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { getServerLocale } from "@/lib/locale.server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Stratifit — Digital Agency",
    template: "%s | Stratifit",
  },
  description:
    "Stratifit helps brands scale with modern design, engineering, and strategy.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} font-body antialiased`}>
        <AnnouncementBar locale={locale} />
        <Suspense fallback={null}>
          <GlobalNavigation locale={locale} />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
