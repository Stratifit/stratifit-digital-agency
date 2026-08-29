import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VercelAnalytics } from "@/components/analytics/vercel-tracker";
import "./globals.css";
import { getLocale } from "@/lib/i18n/get-locale";
import { getSiteUrl, organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Stratifit Digital Agency",
    template: "%s",
  },
  description: "Premium multilingual digital agency platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
