import { describe, test, expect, visual } from '../test.js';
const { Box, Split, Grid } =
  await import('../archet.js').catch(() => ({}));

describe("Split", () => {
  test("has archet-split class", () => {
    expect(new Split(50, 50).dom.classList.contains("archet-split")).toBeTruthy();
  });

  test("Wraps raw DOM nodes in a flex-column div", () => {
    const split = new Split(50, 50);
    const raw = document.createElement("div");
    raw.textContent = "Raw";

    split.add(raw, "Right");
    document.getElementById("stage").appendChild(split.dom);

    expect(split.dom.children.length).toBe(2);

    const wrapper = split.dom.children[0];
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.style.flexDirection).toBe("column");
    expect(wrapper.firstElementChild).toBe(raw);
  });

  test("Applies flex-grow ratios to children", () => {
    const split = new Split(50, 50);
    split.add("Left", "Right");
    document.getElementById("stage").appendChild(split.dom);

    const left = split.dom.children[0];
    expect(Number(getComputedStyle(left).flexGrow)).toBe(50);
    expect(left.textContent).toBe("Left");
  });
});

visual("Split (50/50)", () => {
  const left  = new Box(null, null).bg("var(--archet-surface)").pad(12).add("Left pane");
  const right = new Box(null, null).bg("var(--archet-surface-alt)").pad(12).add("Right pane");
  return new Split(50, 50).css({ width: "400px", height: "80px" }).add(left, right);
});

visual("Split (30/70)", () => {
  const nav     = new Box(null, null).bg("var(--archet-surface)").pad(12).add("Nav (30)");
  const content = new Box(null, null).bg("var(--archet-surface-alt)").pad(12).add("Content (70)");
  return new Split(30, 70).css({ width: "400px", height: "80px" }).add(nav, content);
});

describe("Grid", () => {
  test("has archet-grid class", () => {
    expect(new Grid(3).dom.classList.contains("archet-grid")).toBeTruthy();
  });
});

visual("Grid (3 cols)", () => {
  const g = new Grid(3, "8px").css({ width: "360px" });
  ["One", "Two", "Three", "Four", "Five", "Six"].forEach(label =>
    g.add(new Box(null, null).bg("var(--archet-surface)").pad(10).add(label))
  );
  return g;
});
