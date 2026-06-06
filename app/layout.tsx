import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "SaaS Admin Dashboard — Viprasol Tech",
  description: "Users, RBAC, audit log, and metrics for your SaaS.",
};

/**
 * Inline script that applies the persisted theme before first paint to avoid a
 * flash of the wrong theme. Mirrors the logic in `lib/theme.ts`.
 */
const NO_FLASH_THEME = `
(function () {
  try {
    var pref = localStorage.getItem('vp-theme') || 'system';
    var dark =
      pref === 'dark' ||
      (pref === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME }} />
      </head>
      <body>
        <div className="min-h-screen">
          <NavBar />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
