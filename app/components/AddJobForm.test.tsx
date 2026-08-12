import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import AddJobForm from "./AddJobForm";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: refreshMock,
    }),
}));

describe("AddJobForm", () => {
    beforeEach(() => {
        refreshMock.mockClear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("shows the form after clicking Add Job", async() => {
        const user = userEvent.setup();

        render(<AddJobForm />);

        expect(
            screen.queryByRole("heading", {
                name: "Add Job Application",
            })
        ).not.toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Add Job",
            })
        );

        expect(
            screen.queryByRole("heading", {
                name: "Add Job Application",
            })
        ).toBeInTheDocument();
    });

    it("closes the form when Cancel is clicked", async() => {
        const user = userEvent.setup();

        render(<AddJobForm />);

        await user.click(
            screen.getByRole("button", {
                name: "Add Job",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Cancel",
            })
        );

        expect(
            screen.queryByRole("heading", {
                name: "Add Job Application",
            })
        ).not.toBeInTheDocument();
    });

    it("submits a valid job application", async() => {
        const user = userEvent.setup();

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async() => ({
                id: "job-1",
                company: "Microsoft",
                position: "Software Developer",
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        render(<AddJobForm />);

        await user.click(
            screen.getByRole("button", {
                name: "Add Job",
            })
        );

        await user.type(
            screen.getByLabelText("Company"),
            "Microsoft"
        );

        await user.type(
            screen.getByLabelText("Position"),
            "Software Developer"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Save Application",
            })
        );

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledOnce();
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/jobs",
            expect.objectContaining({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        );

        await waitFor(() => {
            expect(refreshMock).toHaveBeenCalledOnce();
        });
    });

    it("displays API validation errors", async() => {
        const user = userEvent.setup();

        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            json: async() => ({
                error: "Invalid job application data",
                details: {
                    company: ["Company is required"],
                },
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        render(<AddJobForm />);

        await user.click(
            screen.getByRole("button", {
                name: "Add Job",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Save Application",
            })
        );

        expect(
            await screen.findByText("Company is required")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Invalid job application data")
        ).toBeInTheDocument();

        expect(refreshMock).not.toHaveBeenCalled();
    });
})