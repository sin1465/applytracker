import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
    it("displays Saved", () => {
        render(<StatusBadge status="SAVED" />);

        expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("displays Interview", () => {
        render(<StatusBadge status="INTERVIEW" />);

        expect(screen.getByText("Interview")).toBeInTheDocument();
    });

    it("displays Offer", () => {
        render(<StatusBadge status="OFFER" />);

        expect(screen.getByText("Offer")).toBeInTheDocument();
    });
});