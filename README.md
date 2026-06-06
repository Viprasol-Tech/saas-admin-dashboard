<div align="center">
  <img src="docs/assets/logo.png" alt="Viprasol Tech" width="120" />

  <h1>SaaS Admin Dashboard</h1>

  <p><strong>A clean, typed Next.js admin panel: users table, roles, and live SaaS metrics.</strong></p>

  <p><em>Built and maintained by Viprasol Tech</em></p>

  <p>
    <a href="https://github.com/Viprasol-Tech/saas-admin-dashboard/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" /></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" /></a>
  </p>
</div>

---

A production-style SaaS admin dashboard built with the Next.js App Router and TypeScript (strict). It ships a searchable, role-filterable users table, role badges, status pills, and headline metric cards (MRR, ARR, active users, ARPU, churn). The business logic lives in small, pure, fully-tested modules under `lib/`.

## Features

- **Users table** (`app/(admin)/users/page.tsx`) — live search by name/email and filter by role, with role badges and status pills.
- **Metric cards** — MRR, ARR, active users, ARPU and churn computed from the user store.
- **RBAC permission matrix** (`lib/rbac.ts`) — `can(role, action)` across `owner`/`admin`/`member`/`viewer`, plus `outranks()` hierarchy checks. Fully tested.
- **User store & helpers** (`lib/users.ts`) — deterministic seed data with pure `searchUsers`, `filterByRole`, `filterByStatus`, and `sortUsers`.
- **Metrics engine** (`lib/metrics.ts`) — `calcMrr`, `calcArr`, `countActiveUsers`, `calcArpu`, `calcChurnRate`, plus USD/percent formatters.
- **Typed components** — `<UserRow>`, `<RoleBadge>`, `<MetricCard>`.
- **Tailwind CSS** for styling, **strict TypeScript**, and a **vitest** suite (33 tests) including a component render test.

## Quickstart

```bash
npm install
npm run dev      # http://localhost:3000
```

Then open `/users` for the admin users table, or `/` for the overview.

### Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (strict)
npm run test       # vitest run
```

## What's included

```
app/
  layout.tsx              # shell + nav
  page.tsx                # overview with metric cards
  (admin)/users/page.tsx  # users table (search + role filter)
components/
  RoleBadge.tsx           # role pill
  UserRow.tsx             # one table row
  MetricCard.tsx          # headline metric card
lib/
  rbac.ts                 # can(role, action) permission matrix
  users.ts                # fake user store + search/filter/sort
  metrics.ts              # MRR / ARR / ARPU / churn calculations
tests/
  rbac.test.ts            # permissions per role
  users.test.ts           # search / filter / sort
  metrics.test.ts         # metric calculations + formatting
  RoleBadge.test.tsx      # component render test
```

## Contributing

Contributions are welcome. Fork the repo, create a feature branch, make sure `npm run typecheck` and `npm run test` both pass, and open a pull request.

## Contact — Viprasol Tech Private Limited

- Website: [viprasol.com](https://viprasol.com)
- Email: [support@viprasol.com](mailto:support@viprasol.com)
- Telegram: [t.me/viprasol_help](https://t.me/viprasol_help) | WhatsApp: +91 96336 52112
- GitHub: [@Viprasol-Tech](https://github.com/Viprasol-Tech) | [LinkedIn](https://www.linkedin.com/in/viprasol/) | X [@viprasol](https://twitter.com/viprasol)

## License

[MIT](LICENSE) (c) 2025 Viprasol Tech Private Limited
