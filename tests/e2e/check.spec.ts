import test, { expect } from "@playwright/test";

test("has title check", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/E2E tests/);
});
