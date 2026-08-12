// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.hoisted() creates mock functions early enough for the hoisted vi.mock() factories to access them.
const {
    getCurrentUserIdMock,
    deleteManyMock,
} = vi.hoisted(() => ({
    getCurrentUserIdMock: vi.fn(),
    deleteManyMock: vi.fn(),
}))

vi.mock("@/lib/auth/getCurrentUserId", () => ({
    getCurrentUserId: getCurrentUserIdMock,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        jobApplication: {
            deleteMany: deleteManyMock,
        },
    },
}));

import { DELETE } from "./route";

describe("DELETE /api/jobs/[id]", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when the user is not authenticated", async () => {
        getCurrentUserIdMock.mockResolvedValue(null);

        const request = new Request(
            "http://localhost:3000/api/jobs/job-1",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "job-1",
            }),
        });

        expect(response.status).toBe(401);
        expect(deleteManyMock).not.toHaveBeenCalled();
    });

    it("deletes using both job id and user id", async () => {
        getCurrentUserIdMock.mockResolvedValue("user-1");

        deleteManyMock.mockResolvedValue({
            count: 1,
        });

        const request = new Request(
            "http://localhost:3000/api/jobs/job-1",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "job-1",
            }),
        });

        expect(response.status).toBe(200);

        expect(deleteManyMock).toHaveBeenCalledWith({
            where: {
                id: "job-1",
                userId: "user-1",
            },
        });
    });

    it("returns 404 when the job does not belong to the user", async () => {
        getCurrentUserIdMock.mockResolvedValue("user-2");

        deleteManyMock.mockResolvedValue({
            count: 0,
        });

        const request = new Request(
            "http://localhost:3000/api/jobs/job-1",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "job-1",
            }),
        });

        expect(response.status).toBe(404);

        expect(await response.json()).toEqual({
            error: "Job application not found",
        });
    });
});