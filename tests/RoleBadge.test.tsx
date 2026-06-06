import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { RoleBadge } from "@/components/RoleBadge";

afterEach(cleanup);

describe("<RoleBadge>", () => {
  it("renders the human label for a role", () => {
    render(<RoleBadge role="owner" />);
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("exposes the raw role via data attribute", () => {
    render(<RoleBadge role="admin" />);
    const badge = screen.getByTestId("role-badge");
    expect(badge).toHaveAttribute("data-role", "admin");
    expect(badge).toHaveTextContent("Admin");
  });

  it("applies role-specific styling", () => {
    render(<RoleBadge role="viewer" />);
    const badge = screen.getByTestId("role-badge");
    expect(badge.className).toContain("bg-gray-100");
  });
});
