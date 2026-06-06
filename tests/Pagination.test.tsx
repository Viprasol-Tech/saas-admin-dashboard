import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/Pagination";

afterEach(cleanup);

describe("<Pagination>", () => {
  it("renders the showing-range summary", () => {
    render(
      <Pagination
        page={1}
        totalPages={3}
        from={1}
        to={10}
        total={23}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText(/of/)).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
  });

  it("disables Prev on the first page", () => {
    render(
      <Pagination
        page={1}
        totalPages={3}
        from={1}
        to={10}
        total={23}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeEnabled();
  });

  it("calls onPageChange when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={1}
        totalPages={3}
        from={1}
        to={10}
        total={23}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page button with aria-current", () => {
    render(
      <Pagination
        page={2}
        totalPages={3}
        from={11}
        to={20}
        total={23}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
  });
});
