/**
 * Audit log.
 *
 * An append-only log of administrative events plus pure query helpers
 * (filtering, search, time-window). The log itself is an in-memory ring that is
 * easy to seed for tests and to render in the audit view.
 */

import type { Role } from "./rbac";

export type AuditAction =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "user.suspended"
  | "user.reinstated"
  | "role.changed"
  | "billing.updated"
  | "settings.updated"
  | "login.succeeded"
  | "login.failed";

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditEvent {
  id: string;
  /** ISO 8601 timestamp. */
  at: string;
  /** Email of the actor who performed the action. */
  actor: string;
  /** The actor's role at the time of the event. */
  actorRole: Role;
  action: AuditAction;
  /** Human-readable target, e.g. an affected user's email. */
  target?: string;
  severity: AuditSeverity;
  /** Free-form, human-readable summary. */
  message: string;
}

/** Default severity for each action, used when one is not supplied. */
const SEVERITY: Record<AuditAction, AuditSeverity> = {
  "user.created": "info",
  "user.updated": "info",
  "user.deleted": "critical",
  "user.suspended": "warning",
  "user.reinstated": "info",
  "role.changed": "warning",
  "billing.updated": "warning",
  "settings.updated": "info",
  "login.succeeded": "info",
  "login.failed": "warning",
};

/** Returns the default severity classification for an audit action. */
export function severityOf(action: AuditAction): AuditSeverity {
  return SEVERITY[action];
}

export interface AuditDraft {
  at?: string;
  actor: string;
  actorRole: Role;
  action: AuditAction;
  target?: string;
  severity?: AuditSeverity;
  message?: string;
}

/** Builds a human-readable message when one is not supplied. */
function defaultMessage(d: AuditDraft): string {
  const who = d.actor;
  const verb = d.action.replace(".", " ");
  return d.target ? `${who} ${verb} ${d.target}` : `${who} ${verb}`;
}

export class AuditLog {
  private events: AuditEvent[] = [];
  private seq = 0;

  constructor(seed: readonly AuditEvent[] = []) {
    this.events = seed.map((e) => ({ ...e }));
    this.seq = this.events.length;
  }

  /** Appends an event and returns the stored record. */
  record(draft: AuditDraft): AuditEvent {
    this.seq += 1;
    const event: AuditEvent = {
      id: `a_${String(this.seq).padStart(4, "0")}`,
      at: draft.at ?? new Date(0).toISOString(),
      actor: draft.actor,
      actorRole: draft.actorRole,
      action: draft.action,
      target: draft.target,
      severity: draft.severity ?? severityOf(draft.action),
      message: draft.message ?? defaultMessage(draft),
    };
    this.events.push(event);
    return { ...event };
  }

  /** All events, newest first. */
  all(): AuditEvent[] {
    return [...this.events].sort((a, b) => b.at.localeCompare(a.at));
  }

  /** Number of recorded events. */
  size(): number {
    return this.events.length;
  }
}

// ---- Pure query helpers ---------------------------------------------------

/** Filters by action, or returns all when `action` is "all". */
export function filterByAction(
  events: readonly AuditEvent[],
  action: AuditAction | "all",
): AuditEvent[] {
  if (action === "all") return [...events];
  return events.filter((e) => e.action === action);
}

/** Filters by severity, or returns all when `severity` is "all". */
export function filterBySeverity(
  events: readonly AuditEvent[],
  severity: AuditSeverity | "all",
): AuditEvent[] {
  if (severity === "all") return [...events];
  return events.filter((e) => e.severity === severity);
}

/** Case-insensitive search across actor, target and message. */
export function searchAudit(
  events: readonly AuditEvent[],
  query: string,
): AuditEvent[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [...events];
  return events.filter(
    (e) =>
      e.actor.toLowerCase().includes(q) ||
      (e.target?.toLowerCase().includes(q) ?? false) ||
      e.message.toLowerCase().includes(q),
  );
}

/**
 * Returns events whose timestamp falls within [from, to] inclusive.
 * Bounds are ISO date/datetime strings; omit one to leave that side open.
 */
export function withinRange(
  events: readonly AuditEvent[],
  from?: string,
  to?: string,
): AuditEvent[] {
  return events.filter((e) => {
    if (from && e.at < from) return false;
    if (to && e.at > to) return false;
    return true;
  });
}

/** Counts events grouped by severity. */
export function countBySeverity(
  events: readonly AuditEvent[],
): Record<AuditSeverity, number> {
  const counts: Record<AuditSeverity, number> = {
    info: 0,
    warning: 0,
    critical: 0,
  };
  for (const e of events) counts[e.severity] += 1;
  return counts;
}

/** A small deterministic seed of audit events for demos and tests. */
export function seedAuditEvents(): AuditEvent[] {
  const log = new AuditLog();
  log.record({
    at: "2025-01-02T09:15:00.000Z",
    actor: "ada@viprasol.dev",
    actorRole: "owner",
    action: "user.created",
    target: "katherine@viprasol.dev",
  });
  log.record({
    at: "2025-01-03T14:02:00.000Z",
    actor: "grace@viprasol.dev",
    actorRole: "admin",
    action: "role.changed",
    target: "alan@viprasol.dev",
    message: "grace@viprasol.dev changed alan@viprasol.dev to member",
  });
  log.record({
    at: "2025-01-05T08:47:00.000Z",
    actor: "ada@viprasol.dev",
    actorRole: "owner",
    action: "user.suspended",
    target: "linus@viprasol.dev",
  });
  log.record({
    at: "2025-01-06T11:30:00.000Z",
    actor: "unknown",
    actorRole: "viewer",
    action: "login.failed",
    message: "Failed login from 203.0.113.7",
  });
  log.record({
    at: "2025-01-07T16:20:00.000Z",
    actor: "ada@viprasol.dev",
    actorRole: "owner",
    action: "billing.updated",
    message: "Upgraded plan to Scale",
  });
  return log.all();
}
