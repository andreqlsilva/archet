// run_tests.ts
// Usage: deno run --allow-all run_tests.ts

import { chromium } from "npm:playwright";

const BASE = "http://localhost:8000";

const TEST_FILES = [
  "test/core.test.html",
  "test/layout.test.html",
  "test/form.test.html",
  "test/composite.test.html",
];

// Start dev server
const server = new Deno.Command("deno", {
  args: ["run", "--allow-net", "--allow-read", "server.ts"],
  stdout: "null",
  stderr: "null",
}).spawn();

// Give server a moment to start
await new Promise(r => setTimeout(r, 500));

const browser = await chromium.launch();
let totalPassed = 0;
let totalTests  = 0;
let anyFailed   = false;

for (const file of TEST_FILES) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/${file}`);
  await page.waitForSelector("#summary", { timeout: 10000 });

  const { passed, total } = await page.evaluate(() => {
    const el = document.getElementById("summary")!;
    return {
      passed: Number(el.dataset.passed),
      total:  Number(el.dataset.total),
    };
  });

  totalPassed += passed;
  totalTests  += total;
  if (passed < total) anyFailed = true;

  console.log(`${passed === total ? "✔" : "✘"} ${file}: ${passed}/${total}`);
  await page.close();
}

await browser.close();
server.kill();

console.log(`\n${totalPassed}/${totalTests} passed`);
Deno.exit(anyFailed ? 1 : 0);
