// Captures the README screenshots by clicking through a running instance:
// login, dashboard, patient finder, a patient chart and its sections, an
// encounter, and the guide. Writes PNGs to docs/screenshots/.
//
//   npm run capture                      (default: http://localhost:3001, see start.sh)
//   BASE_URL=http://host:port npm run capture
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const base = (process.env.BASE_URL || "http://localhost:3001").replace(/\/$/, "");
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "screenshots");
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
page.setDefaultTimeout(20000);

let n = 0;
async function shot(name) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400); // let transitions settle
  const file = path.join(out, `${String(++n).padStart(2, "0")}-${name}.png`);
  await page.screenshot({ path: file });
  console.log("wrote", path.relative(process.cwd(), file));
}

// Login screen lists the demo users; pick the first one.
await page.goto(base + "/");
const userButton = page.getByRole("button").filter({ hasText: "@" }).first();
await userButton.waitFor();
await shot("login");
await userButton.click();

// Dashboard, then the patient finder.
await page.getByText("Find Patient").first().waitFor();
await shot("dashboard");
await page.getByText("Find Patient").first().click();
const firstRow = page.locator("table tbody tr").first();
await firstRow.waitFor();
await shot("patient-finder");

// Open the first patient in a tab: overview, then each section.
await firstRow.click();
// The section nav marks the active section; it appears once the chart loads.
const section = (label) => page.getByRole("button", { name: label, exact: true }).first();
await page.locator('button[aria-current="page"]', { hasText: "Overview" }).waitFor();
await page.getByRole("heading", { name: "Recent Encounters" }).waitFor();
await shot("patient-overview");

await section("Encounters").click();
await page.getByRole("heading", { level: 1, name: "Encounters" }).waitFor();
await shot("patient-encounters");

// First encounter's View button, if the patient has any.
const view = page.getByRole("button", { name: /^view$/i }).first();
if (await view.count()) {
  await view.click();
  await page.getByText("Status").first().waitFor();
  await shot("encounter-detail");
  await section("Encounters").click();
}

await section("Charts").click();
await page.getByRole("heading", { level: 1, name: "Charts" }).waitFor();
await shot("patient-charts");
await section("Notes").click();
await page.getByRole("heading", { level: 1, name: "Notes" }).waitFor();
await shot("patient-notes");

// The in-app guide.
await page.goto(base + "/guide");
await shot("guide");
await page.goto(base + "/guide/overview");
await shot("guide-overview");

await browser.close();
