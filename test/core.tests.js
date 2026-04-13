import { describe, test, expect, visual } from '../test.js';
const { Component, Root, Box, Row, Text, Button, Link, Image } =
  await import('../archet.js').catch(() => ({}));

describe("Component", () => {
  test("Hide/Show restores previous display value", () => {
    const b = new Box().css({ display: "grid" });
    document.getElementById("stage").appendChild(b.dom);
    expect(b.dom.style.display).toBe("grid");
    b.hide();
    expect(b.dom.style.display).toBe("none");
    b.show();
    expect(b.dom.style.display).toBe("grid");
  });

  test("Primitives and raw nodes appended, nulls silently dropped", () => {
    const box = new Box();
    box.add(new Button("A"), document.createElement("span"), "Text");
    box.add(null, undefined);
    document.getElementById("stage").appendChild(box.dom);
    expect(box.dom.children.length).toBe(3);
  });

  test("bg() and fg() macros apply correct computed colours", () => {
    const btn = new Button("X").bg("#ff0000").fg("#00ff00");
    document.getElementById("stage").appendChild(btn.dom);
    expect(btn.dom).toHaveBg("#ff0000");
    expect(btn.dom).toHaveFg("#00ff00");
  });
});

describe("Box", () => {
  test("has archet-box class", () => {
    expect(new Box().dom.classList.contains("archet-box")).toBeTruthy();
  });
});

visual("Box", () =>
  new Box(null, null).bg("var(--archet-surface)").bd(1).pad(16).css({ width: "200px", height: "80px" })
    .add("I am a Box")
);

describe("Row", () => {
  test("has archet-row class", () => {
    expect(new Row().dom.classList.contains("archet-row")).toBeTruthy();
  });
});

visual("Row", () =>
  new Row().bg("var(--archet-surface)").bd(1).pad(8).css({ width: "300px", gap: "10px" })
    .add(new Button("A"), new Button("B"), new Button("C"))
);

describe("Text", () => {
  test("has archet-text class", () => {
    expect(new Text("hi").dom.classList.contains("archet-text")).toBeTruthy();
  });
});

visual("Text", () =>
  new Box(null, null).pad(8).css({ gap: "6px" })
    .add(new Text("Normal text"))
    .add(new Text("Bold text").css({ fontWeight: "bold" }))
    .add(new Text("Big text").css({ fontSize: "1.5rem" }))
);

describe("Button", () => {
  test("has archet-button class", () => {
    expect(new Button("x").dom.classList.contains("archet-button")).toBeTruthy();
  });
  test("archet-theme stylesheet is auto-injected", () => {
    expect(document.getElementById("archet-theme")).toBeTruthy();
  });
});

visual("Button", () =>
  new Row().pad(8).css({ gap: "8px" })
    .add(new Button("Default"))
    .add(new Button("Primary").bg("#007bff").fg("#fff").nobd())
    .add(new Button("Danger").bg("#dc3545").fg("#fff").nobd())
);

describe("Link", () => {
  test("has correct href", () => {
    const l = new Link("Click", "/test.html");
    expect(l.dom.getAttribute("href")).toBe("/test.html");
  });
  test("external links open in new tab", () => {
    const l = new Link("Ext", "https://example.com");
    expect(l.dom.getAttribute("target")).toBe("_blank");
  });
});

visual("Link", () =>
  new Box(null, null).pad(8).css({ gap: "6px" })
    .add(new Link("Internal link", "/test.html"))
    .add(new Link("External link", "https://example.com"))
);

describe("Root", () => {
  test("Does not reset body margin when mounted to a non-body target", () => {
    const before = getComputedStyle(document.body).margin;
    new Root("stage");
    expect(getComputedStyle(document.body).margin).toBe(before);
  });

  test("Injects archet-styles exactly once across multiple instances", () => {
    new Root("stage");
    new Root("stage");
    expect(document.querySelectorAll("#archet-styles").length).toBe(1);
  });
});
