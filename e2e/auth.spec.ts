import { test, expect } from "@playwright/test";

test("signed-out user sees the sign-in screen", async ({ page }) => {
    await page.goto("/");

    await expect(
        page.getByRole("heading", {
            name: "ApplyTrackr",
        })
    ).toBeVisible();

    await expect(
        page.getByRole("button", {
            name: "Sign in with GitHub",
        })
    ).toBeVisible();

    await expect(
        page.getByText(
            "Sign in to manage your job applications."
        )
    ).toBeVisible();
});