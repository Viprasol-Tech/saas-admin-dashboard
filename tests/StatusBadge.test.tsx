import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";

afterEach(cleanup);

describe("<StatusBadge>", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("exposes the status via data attribute", () => {
    render(<StatusBadge status="suspended" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveAttribute("data-status", "suspended");
  });

  it("applies status-specific styling", () => {
    render(<StatusBadge status="invited" />);
    expect(screen.getByTestId("status-badge").className).toContain("amber");
  });
});
