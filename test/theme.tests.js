import { describe, test, expect, visual } from '../test.js';
const { setTheme, Box, Button, Input, Select, Pager } =
  await import('../archet.js').catch(() => ({}));

describe("Theme", () => {
  test("defaults to light", () => {
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("setTheme('dark') sets data-theme attribute", () => {
    setTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    setTheme("light");
  });

  test("setTheme('light') restores light theme", () => {
    setTheme("dark");
    setTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("CSS variable --archet-bg is defined", () => {
    const val = getComputedStyle(document.documentElement).getPropertyValue("--archet-bg").trim();
    expect(val).toBeTruthy();
  });

  test("--archet-bg differs between light and dark", () => {
    const light = getComputedStyle(document.documentElement).getPropertyValue("--archet-bg").trim();
    setTheme("dark");
    const dark = getComputedStyle(document.documentElement).getPropertyValue("--archet-bg").trim();
    setTheme("light");
    expect(light === dark).toBe(false);
  });
});

visual("Theme switcher", () => {
  const toggle = new Button("Switch to dark", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    toggle.dom.textContent = `Switch to ${next === "dark" ? "light" : "dark"}`;
  });
  return toggle;
});
