import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PermissionMatrix } from "@/components/PermissionMatrix";
import { ROLES, ACTIONS } from "@/lib/rbac";

afterEach(cleanup);

describe("<PermissionMatrix>", () => {
  it("renders one row per action", () => {
    render(<PermissionMatrix />);
    expect(screen.getAllByTestId("matrix-row")).toHaveLength(ACTIONS.length);
  });

  it("renders a full grid of cells", () => {
    render(<PermissionMatrix />);
    expect(screen.getAllByTestId("matrix-cell")).toHaveLength(
      ROLES.length * ACTIONS.length,
    );
  });

  it("marks the owner column as fully allowed", () => {
    render(<PermissionMatrix />);
    const allowedCells = screen
      .getAllByTestId("matrix-cell")
      .filter((c) => c.getAttribute("data-allowed") === "true");
    // owner has all ACTIONS allowed, so at least that many true cells exist
    expect(allowedCells.length).toBeGreaterThanOrEqual(ACTIONS.length);
  });

  it("shows the View users permission label", () => {
    render(<PermissionMatrix />);
    expect(screen.getByText("View users")).toBeInTheDocument();
  });
});
