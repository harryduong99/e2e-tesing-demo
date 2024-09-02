import { Page } from "@playwright/test";
import {
  testSharedState as test,
  expectSharedState as expect,
} from "./fixtures";
import { addCoverageReport } from "monocart-reporter";

let sharedPage: Page;

test.beforeAll(async ({ page }) => {
  sharedPage = page;
  const isChromium = test.info().project.name === "chromium";
  if (isChromium) {
    await Promise.all([
      sharedPage.coverage.startJSCoverage({
        resetOnNavigation: false,
      }),
      sharedPage.coverage.startCSSCoverage({
        resetOnNavigation: false,
      }),
    ]);
  }

  await sharedPage.goto("/");
});

test.afterAll(async () => {
  const isChromium = test.info().project.name === "chromium";
  if (isChromium) {
    const [jsCoverage, cssCoverage] = await Promise.all([
      sharedPage.coverage.stopJSCoverage(),
      sharedPage.coverage.stopCSSCoverage(),
    ]);
    const coverageList = [...jsCoverage, ...cssCoverage];

    await addCoverageReport(coverageList, test.info());
  }

  await sharedPage.close();
});

test("has title", async () => {
  await expect(sharedPage).toHaveTitle(/E2E tests/);
});

test("title is correct", async () => {
  await expect(sharedPage).toHaveTitle(/E2E tests/);
});

test("has env value", async () => {
  const envCheck = await sharedPage.locator(".env-check");
  await expect(envCheck).toHaveText("env test value");
});

test("check environment", async () => {
  const envCheck = await sharedPage.locator(".env-secrets");
  await expect(envCheck).toHaveText("234");
});
