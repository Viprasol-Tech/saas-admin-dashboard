import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Admin Dashboard — Viprasol Tech",
  description: "Users table, roles, and metrics for your SaaS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <span className="text-lg font-semibold text-gray-900">
                SaaS Admin
              </span>
              <nav className="flex gap-4 text-sm text-gray-600">
                <a className="hover:text-brand" href="/">
                  Overview
                </a>
                <a className="hover:text-brand" href="/users">
                  Users
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
