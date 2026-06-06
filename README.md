<div align="center">
  <img src="docs/assets/logo.png" alt="Viprasol Tech" width="120" />

  <h1>SaaS Admin Dashboard</h1>

  <p><strong>A clean, strict-typed Next.js admin panel — users CRUD, RBAC permission matrix, audit log, and live SaaS metrics.</strong></p>

  <p><em>Built and maintained by Viprasol Tech</em></p>

  <p>
    <a href="https://github.com/Viprasol-Tech/saas-admin-dashboard/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" /></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" /></a>
    <a href="https://vitest.dev"><img alt="Tests" src="https://img.shields.io/badge/tests-118%20passing-brightgreen?logo=vitest" /></a>
    <img alt="Version" src="https://img.shields.io/badge/version-0.2.0-blue" />
  </p>
</div>

---

A production-style SaaS admin dashboard built with the **Next.js App Router** and **TypeScript (strict)**. The UI ships a searchable, filterable, paginated users table with bulk actions, a full **RBAC permission matrix**, an **audit-log** view, and headline **metric cards** (MRR, ARR, ARPU, churn, retention, LTV). All business logic lives in small, pure, fully-tested modules under `lib/` — so the interesting parts are unit-testable without a browser.

## ✨ Features

- 👥 **User CRUD** — an in-memory store with create / read / update / delete, email validation, duplicate detection, and deterministic ids.
- 🧰 **Bulk actions** — select rows and activate, suspend, or delete many users at once.
- 🔎 **Search, filter & paginate** — case-insensitive search plus role/status filters and a windowed pager, all backed by pure helpers.
- 🛡️ **RBAC permission matrix** — typed roles × actions grid with `can`, `canAll`, `canAny`, hierarchy guards, and a render-ready matrix builder.
- 📜 **Audit log** — append-only event log with severity, search, action/severity filters, and time-window queries.
- 📈 **SaaS metrics** — MRR, ARR, active users, ARPU, churn, retention, activation rate, LTV, and role/status breakdowns.
- 🌗 **Dark mode** — class-based theme with light / dark / system, persisted preference, and a no-flash inline script.
- 🧪 **118 tests** — lib unit tests and component render tests (jsdom), strict-typed throughout, zero `any`.

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. Other scripts:

```bash
npm run typecheck   # tsc --noEmit, strict
npm run test        # vitest run (118 tests)
npm run build       # next build (production)
```

## 📦 What's included

| Area | Module | Highlights |
| --- | --- | --- |
| Users | `lib/users.ts`, `lib/userStore.ts` | seed data, search/filter/sort, CRUD + bulk actions |
| RBAC | `lib/rbac.ts` | roles, actions, permission matrix, hierarchy guards |
| Audit | `lib/audit.ts` | append-only log, query/search/severity helpers |
| Metrics | `lib/metrics.ts` | MRR/ARR/ARPU/churn/retention/LTV, distributions |
| Pagination | `lib/pagination.ts` | `paginate`, `pageRange`, `clampPage`, `totalPages` |
| Theme | `lib/theme.ts` | resolve/cycle preference, system detection |

## 🗂️ Project structure

```
app/
  layout.tsx              # shell + no-flash theme script
  page.tsx                # Overview (metric cards)
  (admin)/users/page.tsx  # Users: search, filter, paginate, bulk actions
  (admin)/roles/page.tsx  # Roles & permission matrix
  (admin)/audit/page.tsx  # Audit-log view
components/               # MetricCard, RoleBadge, StatusBadge, UserRow,
                          # PermissionMatrix, AuditRow, Pagination, NavBar, ThemeToggle
lib/                      # users, userStore, rbac, audit, metrics, pagination, theme
tests/                    # 15 spec files, 118 tests (lib + component, jsdom)
```

## 🖼️ Screens

- **Overview** — eight metric cards (MRR, ARR, active, churn, retention, LTV, invited, suspended).
- **Users** — searchable, role/status filtered, paginated table with a bulk-action toolbar.
- **Roles** — per-role counts plus the full permission matrix.
- **Audit log** — severity-coded events with search and severity filter.

## 🗺️ Roadmap

- [x] User CRUD store with bulk actions
- [x] RBAC permission matrix + hierarchy guards
- [x] Audit-log view and query helpers
- [x] Filtering, search, and pagination
- [x] Dark mode with persisted preference
- [ ] Persist data to a real database (Prisma/Postgres)
- [ ] Server actions for CRUD mutations
- [ ] CSV export of users and audit events
- [ ] Charts for metric trends over time

## ❓ FAQ

**Is there a backend?**
No — data lives in deterministic in-memory stores so the dashboard runs with zero setup. The `lib/` modules are framework-agnostic, so swapping in a real database is a contained change.

**Why is the logic in `lib/` instead of components?**
So it can be unit-tested in isolation and reused on a server. Components stay thin and presentational.

**How do I add a permission?**
Add the action to the `Action` union and `ACTIONS` array in `lib/rbac.ts`, give it a label in `ACTION_LABELS`, and grant it to roles in `PERMISSIONS`. The matrix UI and tests update automatically.

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss substantial changes first. Before submitting a PR, make sure `npm run typecheck` and `npm run test` both pass. See [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md).

## Contact — Viprasol Tech Private Limited

- Website: [viprasol.com](https://viprasol.com)
- Email: [support@viprasol.com](mailto:support@viprasol.com)
- Telegram: [t.me/viprasol_help](https://t.me/viprasol_help) | WhatsApp: +91 96336 52112
- GitHub: [@Viprasol-Tech](https://github.com/Viprasol-Tech) | [LinkedIn](https://www.linkedin.com/in/viprasol/) | X [@viprasol](https://twitter.com/viprasol)

## License

[MIT](LICENSE) (c) 2025 Viprasol Tech Private Limited
