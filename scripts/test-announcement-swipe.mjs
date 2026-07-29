// Temporary Playwright script to test announcement bar mobile swipe behavior
import { chromium } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3001/test-announcement";

function log(message) {
  // eslint-disable-next-line no-console
  console.log(`[test] ${message}`);
}

async function dispatchSwipe(page, selector, { fromX, fromY, toX, toY }) {
  await page.evaluate(
    ({ selector, fromX, fromY, toX, toY }) => {
      const bar = document.querySelector(selector);
      if (!bar) throw new Error(`Element ${selector} not found`);

      const createTouch = (x, y) =>
        new Touch({
          identifier: 0,
          target: bar,
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
          pageX: x,
          pageY: y,
          radiusX: 1,
          radiusY: 1,
          rotationAngle: 0,
          force: 0,
        });

      const touchStart = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        changedTouches: [createTouch(fromX, fromY)],
      });
      const touchEnd = new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        changedTouches: [createTouch(toX, toY)],
      });

      bar.dispatchEvent(touchStart);
      bar.dispatchEvent(touchEnd);
    },
    { selector, fromX, fromY, toX, toY }
  );
}

async function getSlideText(page) {
  return page.evaluate(() => {
    const bar = document.querySelector('[data-testid="announcement-bar"]');
    if (!bar) return null;
    const span = bar.querySelector("span");
    return span ? span.textContent.trim() : null;
  });
}

async function isBarVisible(page) {
  return page.evaluate(() => {
    const bar = document.querySelector('[data-testid="announcement-bar"]');
    return bar !== null;
  });
}

(async () => {
  log(`Starting browser and navigating to ${BASE_URL}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();

  const consoleMessages = [];
  page.on("console", (msg) => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    log(`console.${msg.type()}: ${text}`);
  });
  page.on("pageerror", (error) => {
    consoleMessages.push({ type: "pageerror", text: error.message });
    log(`pageerror: ${error.message}`);
  });

  log("Navigating to test page...");
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60000 });

  // Wait for the announcement bar to render (long timeout for dev server compile)
  try {
    await page.waitForSelector('[data-testid="announcement-bar"]', { timeout: 45000 });
  } catch (err) {
    log("Bar not found within timeout. Capturing debug info...");
    await page.screenshot({ path: "debug-timeout-screenshot.png" });
    const htmlDump = await page.content();
    log(`HTML length: ${htmlDump.length}`);
    log(`HTML includes announcement-bar: ${htmlDump.includes("announcement-bar")}`);
    const fs = await import("fs");
    fs.writeFileSync("debug-timeout-page.html", htmlDump);
    log("Saved HTML dump to debug-timeout-page.html");
    try {
      const visibleText = await page.evaluate(() => document.body.innerText.slice(0, 500));
      log(`Visible body text: ${visibleText}`);
    } catch (e) {
      log(`Could not read body text: ${e.message}`);
    }
    throw err;
  }

  const barBox = await page.locator('[data-testid="announcement-bar"]').boundingBox();
  if (!barBox) throw new Error("Could not determine announcement bar bounding box");

  const startX = barBox.x + barBox.width * 0.7;
  const endX = barBox.x + barBox.width * 0.3;
  const centerY = barBox.y + barBox.height / 2;

  // Read initial slide
  const initialText = await getSlideText(page);
  log(`Initial slide: "${initialText}"`);

  // Swipe left (next slide)
  log("Swiping left on the bar...");
  await dispatchSwipe(page, '[data-testid="announcement-bar"]', {
    fromX: startX,
    fromY: centerY,
    toX: endX,
    toY: centerY,
  });
  await page.waitForTimeout(500);
  const afterLeftSwipe = await getSlideText(page);
  log(`After left swipe: "${afterLeftSwipe}"`);

  // Swipe right (previous slide)
  log("Swiping right on the bar...");
  await dispatchSwipe(page, '[data-testid="announcement-bar"]', {
    fromX: endX,
    fromY: centerY,
    toX: startX,
    toY: centerY,
  });
  await page.waitForTimeout(500);
  const afterRightSwipe = await getSlideText(page);
  log(`After right swipe: "${afterRightSwipe}"`);

  // Tap close button
  log("Tapping close button...");
  await page.locator('[data-testid="announcement-bar"] button[aria-label="Dismiss announcement"]').tap();
  await page.waitForTimeout(300);
  const visibleAfterClose = await isBarVisible(page);
  log(`Bar visible after close: ${visibleAfterClose}`);

  await browser.close();

  // Report results
  log("=== RESULTS ===");
  const leftSwipeWorked = afterLeftSwipe !== initialText && afterLeftSwipe !== null;
  const rightSwipeWorked = afterRightSwipe === initialText;
  const closeWorked = !visibleAfterClose;

  if (leftSwipeWorked) log("✅ Left swipe advanced to a new slide");
  else log("❌ Left swipe did NOT advance to a new slide");

  if (rightSwipeWorked) log(" Right swipe returned to the initial slide");
  else log("❌ Right swipe did NOT return to the initial slide");

  if (closeWorked) log("✅ Close button dismissed the bar");
  else log("❌ Close button did NOT dismiss the bar");

  if (consoleMessages.length > 0) {
    log("=== Console output ===");
    consoleMessages.forEach((m) => log(`${m.type}: ${m.text}`));
  } else {
    log("No console messages captured.");
  }

  const exitCode = leftSwipeWorked && rightSwipeWorked && closeWorked ? 0 : 1;
  process.exit(exitCode);
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
