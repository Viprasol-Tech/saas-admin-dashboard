import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AuditRow } from "@/components/AuditRow";
import type { AuditEvent } from "@/lib/audit";

afterEach(cleanup);

const event: AuditEvent = {
  id: "a_0001",
  at: "2025-01-05T08:47:00.000Z",
  actor: "ada@viprasol.dev",
  actorRole: "owner",
  action: "user.suspended",
  target: "linus@viprasol.dev",
  severity: "warning",
  message: "ada@viprasol.dev user suspended linus@viprasol.dev",
};

function renderRow(ui: React.ReactElement) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
}

describe("<AuditRow>", () => {
  it("renders actor, action and message", () => {
    renderRow(<AuditRow event={event} />);
    expect(screen.getByText("ada@viprasol.dev")).toBeInTheDocument();
    expect(screen.getByText("user.suspended")).toBeInTheDocument();
    expect(
      screen.getByText(/user suspended linus@viprasol.dev/),
    ).toBeInTheDocument();
  });

  it("renders the actor role badge", () => {
    renderRow(<AuditRow event={event} />);
    expect(screen.getByTestId("role-badge")).toHaveAttribute(
      "data-role",
      "owner",
    );
  });

  it("encodes severity in a data attribute", () => {
    renderRow(<AuditRow event={event} />);
    expect(screen.getByTestId("severity-badge")).toHaveAttribute(
      "data-severity",
      "warning",
    );
  });
});
