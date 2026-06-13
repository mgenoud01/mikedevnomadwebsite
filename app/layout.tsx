import type { Metadata } from "next";
import { Inter, Chakra_Petch, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Mike Dev Nomad — Pro & Adventurer",
  description:
    "Mike's portfolio and nomad universe: developer, cybersecurity enthusiast and avid traveler.",
  keywords: ["developer", "nomad", "portfolio", "cybersecurity", "travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${chakraPetch.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
