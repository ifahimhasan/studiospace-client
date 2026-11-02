import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "StudioSpace — Book creative studios by the hour", template: "%s · StudioSpace" },
  description:
    "Peer-to-peer marketplace for photo studios, sound stages, podcast lounges, music suites and art workshops. Find a space, pick your hours and book instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="studiodark" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col overflow-x-hidden`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
