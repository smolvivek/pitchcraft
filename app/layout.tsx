import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pitchcraft — Present, fund, and version your creative work",
  description:
    "One link for your entire project. Structure your pitch, share it with producers and collaborators, raise funding, and track versions — built for filmmakers, writers, and creators.",
  openGraph: {
    title: "Pitchcraft",
    description:
      "One link for your entire project. Structure, share, fund, and version your creative work.",
    type: "website",
    siteName: "Pitchcraft",
  },
  twitter: {
    card: "summary",
    title: "Pitchcraft",
    description:
      "One link for your entire project. Structure, share, fund, and version your creative work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pitchcraft",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitchcraft.app",
    description: "Present, fund, and evolve your creative work.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-pop focus:px-3 focus:py-2 focus:text-white focus:text-sm"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
