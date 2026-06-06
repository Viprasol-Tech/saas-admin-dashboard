import { describe, it, expect } from "vitest";
import {
  AuditLog,
  severityOf,
  filterByAction,
  filterBySeverity,
  searchAudit,
  withinRange,
  countBySeverity,
  seedAuditEvents,
  type AuditEvent,
} from "@/lib/audit";

describe("audit.severityOf", () => {
  it("maps actions to default severities", () => {
    expect(severityOf("user.deleted")).toBe("critical");
    expect(severityOf("user.suspended")).toBe("warning");
    expect(severityOf("user.created")).toBe("info");
  });
});

describe("AuditLog.record", () => {
  it("assigns ids, default severity and a generated message", () => {
    const log = new AuditLog();
    const e = log.record({
      actor: "ada@viprasol.dev",
      actorRole: "owner",
      action: "user.created",
      target: "bob@viprasol.dev",
    });
    expect(e.id).toMatch(/^a_\d{4}$/);
    expect(e.severity).toBe("info");
    expect(e.message).toContain("ada@viprasol.dev");
    expect(e.message).toContain("bob@viprasol.dev");
    expect(log.size()).toBe(1);
  });

  it("honors an explicit severity and message", () => {
    const log = new AuditLog();
    const e = log.record({
      actor: "x",
      actorRole: "admin",
      action: "settings.updated",
      severity: "critical",
      message: "custom",
    });
    expect(e.severity).toBe("critical");
    expect(e.message).toBe("custom");
  });

  it("returns events newest-first from all()", () => {
    const log = new AuditLog();
    log.record({ at: "2025-01-01T00:00:00.000Z", actor: "a", actorRole: "owner", action: "user.created" });
    log.record({ at: "2025-02-01T00:00:00.000Z", actor: "b", actorRole: "owner", action: "user.created" });
    const all = log.all();
    expect(all[0].actor).toBe("b");
    expect(all[1].actor).toBe("a");
  });
});

describe("audit query helpers", () => {
  const events: AuditEvent[] = seedAuditEvents();

  it("seeds a non-empty deterministic log", () => {
    expect(events.length).toBe(5);
  });

  it("filters by action", () => {
    const out = filterByAction(events, "user.suspended");
    expect(out).toHaveLength(1);
    expect(out[0].target).toBe("linus@viprasol.dev");
    expect(filterByAction(events, "all")).toHaveLength(events.length);
  });

  it("filters by severity", () => {
    const warnings = filterBySeverity(events, "warning");
    expect(warnings.every((e) => e.severity === "warning")).toBe(true);
    expect(filterBySeverity(events, "all")).toHaveLength(events.length);
  });

  it("searches actor, target and message", () => {
    expect(searchAudit(events, "linus")).toHaveLength(1);
    expect(searchAudit(events, "Scale")).toHaveLength(1);
    expect(searchAudit(events, "")).toHaveLength(events.length);
    expect(searchAudit(events, "zzz")).toHaveLength(0);
  });

  it("filters by a time window", () => {
    const out = withinRange(events, "2025-01-04", "2025-01-06");
    expect(out.length).toBeGreaterThan(0);
    expect(
      out.every((e) => e.at >= "2025-01-04" && e.at <= "2025-01-06"),
    ).toBe(true);
  });

  it("leaves open-ended ranges open", () => {
    expect(withinRange(events, "2025-01-06")).toHaveLength(
      events.filter((e) => e.at >= "2025-01-06").length,
    );
    expect(withinRange(events)).toHaveLength(events.length);
  });

  it("counts by severity", () => {
    const counts = countBySeverity(events);
    expect(counts.info + counts.warning + counts.critical).toBe(events.length);
  });
});
