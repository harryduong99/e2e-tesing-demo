import { test, expect } from "@playwright/test";

test("has env value", async ({ page }) => {
  await page.goto("/");

  const envCheck = await page.locator(".env-check");
  // Expect a title "to contain" a substring.
  await expect(envCheck).toHaveText("env test value");
});
