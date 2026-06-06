import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { UserRow } from "@/components/UserRow";
import type { User } from "@/lib/users";

afterEach(cleanup);

const user: User = {
  id: "u_001",
  name: "Ada Lovelace",
  email: "ada@viprasol.dev",
  role: "owner",
  status: "active",
  createdAt: "2024-01-12",
  seatMrr: 99,
};

function renderRow(ui: React.ReactElement) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
}

describe("<UserRow>", () => {
  it("renders name, email and formatted MRR", () => {
    renderRow(<UserRow user={user} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@viprasol.dev")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it("renders role and status badges", () => {
    renderRow(<UserRow user={user} />);
    expect(screen.getByTestId("role-badge")).toHaveAttribute(
      "data-role",
      "owner",
    );
    expect(screen.getByTestId("status-badge")).toHaveAttribute(
      "data-status",
      "active",
    );
  });

  it("does not render a checkbox by default", () => {
    renderRow(<UserRow user={user} />);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("renders a checkbox and fires onToggle when selectable", () => {
    const onToggle = vi.fn();
    renderRow(
      <UserRow user={user} selectable selected={false} onToggle={onToggle} />,
    );
    const box = screen.getByRole("checkbox");
    fireEvent.click(box);
    expect(onToggle).toHaveBeenCalledWith("u_001");
  });
});
