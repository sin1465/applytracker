import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusFilter from "./StatusFilter";

describe("StatusFilter", () => {
    it("renders all status filters", () => {
        render(<StatusFilter />);

        expect(screen.getByText("ALL")).toBeInTheDocument();
        expect(screen.getByText("SAVED")).toBeInTheDocument();
        expect(screen.getByText("APPLIED")).toBeInTheDocument();
        expect(screen.getByText("INTERVIEW")).toBeInTheDocument();
        expect(screen.getByText("REJECTED")).toBeInTheDocument();
        expect(screen.getByText("OFFER")).toBeInTheDocument();
    });

    it("creates the correct Applied URL", () => {
        render(<StatusFilter />);

        const link = screen.getByRole("link", {
            name: "APPLIED",
        });

        expect(link).toHaveAttribute(
            "href",
            "/?status=APPLIED"
        );
    });

    it("preserves search and sorting parameters", () => {
        render(
            <StatusFilter
                currentSearch="developer"
                currentSort="company-asc"
            />
        );

        const link = screen.getByRole("link", {
            name: "APPLIED",
        });

        expect(link).toHaveAttribute(
            "href",
            "/?status=APPLIED&search=developer&sort=company-asc"
        );
    });
});