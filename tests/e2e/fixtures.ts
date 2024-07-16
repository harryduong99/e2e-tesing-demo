import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
import { prepareMetamask } from "@synthetixio/synpress/helpers";
import { setExpectInstance } from "@synthetixio/synpress/commands/playwright";
import { resetState } from "@synthetixio/synpress/commands/synpress";

export const test = base.extend<{
  context: BrowserContext;
  autoTestFixture: string;
  extensionId: string;
}>({
  context: async ({}, use) => {
    await setExpectInstance(expect);

    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || "10.25.0"
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];

    if (process.env.E2E_METAMASK_HEADLESS_MODE == "true") {
      browserArgs.push("--headless=new");
    }

    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey: process.env.E2E_METAMASK_SEED_PHRASE,
      network: "sepolia",
      password: "e2eTesting",
      enableAdvancedSettings: true,
    });

    await context.pages()[0].waitForTimeout(1000);
    await context.pages()[0].close();

    await use(context);
    await context.close();

    await resetState();
  },

  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});

export const expect = test.expect;

export const testSharedState = base.extend<{
  context: BrowserContext;
  autoTestFixture: string;
  extensionId: string;
}>({
  context: async ({}, use) => {
    await setExpectInstance(expect);

    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || "10.25.0"
    );
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];

    if (process.env.CI) {
      browserArgs.push("--disable-gpu");
    }

    if (process.env.E2E_METAMASK_HEADLESS_MODE == "true") {
      browserArgs.push("--headless=new");
    }

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey: process.env.E2E_METAMASK_SEED_PHRASE,
      network: "sepolia",
      password: "e2eTesting",
      enableAdvancedSettings: true,
    });

    await use(context);
  },

  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});

export const expectSharedState = testSharedState.expect;
