"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/users", label: "Users" },
  { href: "/roles", label: "Roles" },
  { href: "/audit", label: "Audit log" },
] as const;

/** Top navigation bar with active-link highlighting and a theme toggle. */
export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-900 dark:text-gray-50"
        >
          SaaS Admin
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "font-medium text-brand"
                      : "text-gray-600 hover:text-brand dark:text-gray-300"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default NavBar;
