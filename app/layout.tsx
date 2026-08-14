import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { TopNav } from "@/components/layout/top-nav";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE } from "@/lib/constants/site";
import { getDirectoryStats } from "@/lib/data";

import "./globals.css";

/** Editorial display. One weight, used large and quiet. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Verification status is global while records are unverified — it belongs in
  // the chrome, not on whichever page happens to render the records.
  const { needsReview } = await getDirectoryStats();

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-void">
        <SmoothScroll>
          <TooltipProvider delayDuration={150}>
            <a
              href="#main"
              className="sr-only bg-bone px-4 py-2 text-micro text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100"
            >
              Skip to content
            </a>

            {/* The only ambient texture. No grids, no scanlines. */}
            <div
              aria-hidden="true"
              className="grain pointer-events-none fixed inset-0 z-50"
            />

            <div className="flex min-h-dvh flex-col">
              <TopNav unverifiedCount={needsReview} />
              <MobileHeader unverifiedCount={needsReview} />

              {/* Bottom padding clears the mobile nav; `env()` handles the
                  iOS home indicator on top of that. */}
              <main
                id="main"
                className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0"
              >
                {children}
              </main>

              <BottomNav />
            </div>
          </TooltipProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
