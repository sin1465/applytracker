import { test, expect } from "@playwright/test";

test("unauthorized user cannot access jobs API", async ({request,}) => {
    const response = await request.get("/api/jobs");

    expect(response.status()).toBe(401);

    expect(await response.json()).toEqual({
        error: "Unauthorized",
    });
});