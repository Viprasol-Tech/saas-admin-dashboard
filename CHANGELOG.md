# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/); versioning
follows [SemVer](https://semver.org/).

## [0.2.0] - 2025

### Added
- **User CRUD store** (`lib/userStore.ts`): create / read / update / delete with
  email validation, duplicate detection, deterministic id generation, and
  status helpers.
- **Bulk actions**: bulk remove, bulk set-status, and bulk set-role on the user
  store, surfaced as a selection toolbar on the Users page.
- **Richer RBAC** (`lib/rbac.ts`): new actions (`user:create`, `user:suspend`,
  `audit:read`), `canAll` / `canAny`, `canManageUser` hierarchy guard,
  `permissionMatrix()` grid builder, and role/action label maps.
- **Audit log** (`lib/audit.ts`): append-only `AuditLog` plus pure query
  helpers (filter by action/severity, search, time-window, severity counts) and
  a deterministic seed.
- **Advanced metrics** (`lib/metrics.ts`): role distribution, status breakdown,
  activation rate, retention rate, and an LTV estimate.
- **Pagination** (`lib/pagination.ts`): pure `paginate`, `pageRange`,
  `clampPage`, and `totalPages` helpers with a `<Pagination>` component.
- **New pages**: `/roles` (permission matrix) and `/audit` (audit-log view);
  Users page gains status filter, pagination, search, and bulk actions.
- **New components**: `PermissionMatrix`, `AuditRow`, `Pagination`,
  `StatusBadge`, `NavBar`, and a `ThemeToggle`.
- **Dark mode**: class-based theme with persisted preference, system support,
  and a no-flash inline script (`lib/theme.ts` + `ThemeToggle`).

### Changed
- Doubled the test suite from 33 to 118 tests across rbac, users, metrics,
  audit, pagination, theme, and component render tests.
- Reworked `UserRow` to use `StatusBadge` and support row selection.

## [0.1.0] - 2025

### Added
- Initial release of saas-admin-dashboard: SaaS admin dashboard (Next.js) — users table, roles, and metrics.
