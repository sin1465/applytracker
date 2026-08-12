import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    authMock,
    findManyMock,
    createMock,
} = vi.hoisted(() => ({
    authMock: vi.fn(),
    findManyMock: vi.fn(),
    createMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
    auth: authMock,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        jobApplication: {
            findMany: findManyMock,
            create: createMock,
        },
    },
}));

import { GET, POST } from "./route";

describe("/api/jobs", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET", () => {
        it("returns 401 when the user is not authenticated", async () => {
            authMock.mockResolvedValue(null);

            const response = await GET();

            expect(response.status).toBe(401);

            expect(await response.json()).toEqual({
                error: "Unauthorized",
            });

            expect(findManyMock).not.toHaveBeenCalled();
        });

        it("returns only the signed-in user's jobs", async () => {
            authMock.mockResolvedValue({
                user: {
                    id: "user-1",
                    name: "Test User",
                    email: "test@example.com",
                },
            });

            findManyMock.mockResolvedValue([
                {
                    id: "job-1",
                    company: "Microsoft",
                    position: "Software Developer",
                    userId: "user-1",
                },
            ]);

            const response = await GET();

            expect(response.status).toBe(200);

            expect(findManyMock).toHaveBeenCalledWith({
                where: {
                    userId: "user-1",
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            const body = await response.json();

            expect(body).toHaveLength(1);
            expect(body[0].company).toBe("Microsoft");
        });
    });

    describe("POST", () => {
        it("returns 401 when the user is not authenticated", async () => {
            authMock.mockResolvedValue(null);

            const request = new Request(
                "http://localhost:3000/api/jobs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        company: "Microsoft",
                        position: "Software Developer",
                    }),
                }
            );

            const response = await POST(request);

            expect(response.status).toBe(401);
            expect(createMock).not.toHaveBeenCalled();
        });

        it("creates the job with the signed-in user's id", async () => {
            authMock.mockResolvedValue({
                user: {
                    id: "user-1",
                    name: "Test User",
                    email: "test@example.com",
                },
            });

            createMock.mockResolvedValue({
                id: "job-1",
                company: "Microsoft",
                position: "Software Developer",
                location: null,
                salary: null,
                jobUrl: null,
                notes: null,
                status: "SAVED",
                userId: "user-1",
            });

            const request = new Request(
                "http://localhost:3000/api/jobs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        company: "Microsoft",
                        position: "Software Developer",
                    }),
                }
            );

            const response = await POST(request);

            expect(response.status).toBe(201);

            expect(createMock).toHaveBeenCalledWith({
                data: {
                    company: "Microsoft",
                    position: "Software Developer",
                    location: null,
                    salary: null,
                    jobUrl: null,
                    notes: null,
                    status: "SAVED",
                    userId: "user-1",
                },
            });
        });
    });
});