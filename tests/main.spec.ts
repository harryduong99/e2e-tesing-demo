import { Page } from "@playwright/test";
import {
  testSharedState as test,
  expectSharedState as expect,
} from "./fixtures";
// import { test, expect } from "./fixtures";

let sharedPage: Page;

test.beforeAll(async ({ page }) => {
  sharedPage = page;
  await sharedPage.goto("/");
});

test.afterAll(async () => {
  await sharedPage.close();
});

test("has title", async () => {
  await expect(sharedPage).toHaveTitle(/E2E tests/);
});

test("has env value", async () => {
  const envCheck = await sharedPage.locator(".env-check");
  await expect(envCheck).toHaveText("env test value");
});
