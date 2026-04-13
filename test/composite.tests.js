import { describe, test, expect, visual } from '../test.js';
const { Box, Text, Button, Deck, Crud, Pager, Tabber, NavPager,
        Toast, Modal, Spinner, Accordion, Checklist } =
  await import('../archet.js').catch(() => ({}));

describe("Semantic CSS classes — composite", () => {
  test("Pager has archet-pager class", () => {
    expect(new Pager([["A", new Box()]]).dom.classList.contains("archet-pager")).toBeTruthy();
  });
  test("Tabber has archet-tabber class", () => {
    expect(new Tabber([["A", new Box()]]).dom.classList.contains("archet-tabber")).toBeTruthy();
  });
  test("NavPager has archet-navpager class", () => {
    expect(new NavPager().dom.classList.contains("archet-navpager")).toBeTruthy();
  });
  test("Deck has archet-deck class", () => {
    expect(new Deck().dom.classList.contains("archet-deck")).toBeTruthy();
  });
  test("Crud has archet-crud class", () => {
    expect(new Crud("Items", ["Name"]).dom.classList.contains("archet-crud")).toBeTruthy();
  });
});

describe("Deck", () => {
  test("Rejects raw DOM nodes — only Archet Components allowed", () => {
    const deck = new Deck();
    deck.add(new Box());
    expect(deck.items.length).toBe(1);
    expect(() => deck.add(document.createElement("div"))).toThrow("Only Archet Components");
  });
});

visual("Deck", () => {
  const deck = new Deck();
  const a = new Box(null, null).pad(16).bg("var(--archet-surface)").add("Slide 1 — click show(1) in console");
  const b = new Box(null, null).pad(16).bg("var(--archet-surface-alt)").add("Slide 2");
  deck.add(a).add(b);
  return deck.css({ width: "300px", height: "80px" });
});

describe("Crud", () => {
  test("Adding an item appends to data and clears inputs", () => {
    const crud = new Crud("Users", ["Name"]);
    crud.onError = () => {};
    document.getElementById("stage").appendChild(crud.dom);

    crud.inputs["Name"].val = "Alice";
    crud.addItem();

    expect(crud.data.length).toBe(1);
    expect(crud.inputs["Name"].val).toBe("");
  });

  test("Delete button removes the correct item", () => {
    const crud = new Crud("Users", ["Name"]);
    crud.onError = () => {};
    document.getElementById("stage").appendChild(crud.dom);

    crud.inputs["Name"].val = "Alice";
    crud.addItem();
    expect(crud.data.length).toBe(1);

    const btn = crud.list.dom.querySelector('[data-role="delete"]');
    expect(btn).toBeTruthy();
    btn.click();
    expect(crud.data.length).toBe(0);
  });

  test("list scrolls when rows overflow", () => {
    const crud = new Crud("Users", ["Name"]);
    expect(crud.list.dom.style.overflowY).toBe("auto");
  });

  test("Rejects addItem when a field is empty", () => {
    let errorCalled = false;
    const crud = new Crud("Users", ["Name", "Email"]);
    crud.onError = () => { errorCalled = true; };
    document.getElementById("stage").appendChild(crud.dom);

    crud.inputs["Name"].val = "Alice";
    crud.addItem();

    expect(crud.data.length).toBe(0);
    expect(errorCalled).toBeTruthy();
  });
});

visual("Crud", () => {
  const crud = new Crud("Contacts", ["Name", "Email"]);
  crud.onError = () => {};
  return crud.css({ width: "500px" });
});

describe("Pager", () => {
  test("Renders a container with a nav and a content pane", () => {
    const pager = new Pager([["Home", new Box()], ["About", new Box()]]);
    document.getElementById("stage").appendChild(pager.dom);
    expect(pager.nav.dom.tagName).toBe("NAV");
    expect(pager.content.dom).toBeTruthy();
  });

  test("Nav has one entry per page", () => {
    const pager = new Pager([["Home", new Box()], ["About", new Box()], ["Contact", new Box()]]);
    document.getElementById("stage").appendChild(pager.dom);
    const items = pager.nav.dom.querySelectorAll("[data-role='page-link']");
    expect(items.length).toBe(3);
  });

  test("First page is shown by default", () => {
    const a = new Box();
    const b = new Box();
    const pager = new Pager([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(pager.dom);
    expect(pager.content.dom.contains(a.dom)).toBeTruthy();
    expect(pager.content.dom.contains(b.dom)).toBe(false);
  });

  test("select(index) switches the visible page", () => {
    const a = new Box();
    const b = new Box();
    const pager = new Pager([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(pager.dom);
    pager.select(1);
    expect(pager.content.dom.contains(b.dom)).toBeTruthy();
    expect(pager.content.dom.contains(a.dom)).toBe(false);
  });

  test("Clicking a nav link switches the page", () => {
    const a = new Box();
    const b = new Box();
    const pager = new Pager([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(pager.dom);
    const links = pager.nav.dom.querySelectorAll("[data-role='page-link']");
    links[1].click();
    expect(pager.content.dom.contains(b.dom)).toBeTruthy();
  });

  test("nav scrolls when entries overflow", () => {
    const pager = new Pager([["A", new Box()], ["B", new Box()]]);
    expect(pager.nav.dom.style.overflowY).toBe("auto");
  });
});

visual("Pager", () => {
  const pager = new Pager([
    ["Home",    new Box(null, null).pad(16).add("Home content")],
    ["About",   new Box(null, null).pad(16).add("About content")],
    ["Contact", new Box(null, null).pad(16).add("Contact content")],
  ]);
  return pager.css({ width: "400px", height: "160px" });
});

describe("Tabber", () => {
  test("Renders a container with a tab strip and a content pane", () => {
    const tabber = new Tabber([["One", new Box()], ["Two", new Box()]]);
    document.getElementById("stage").appendChild(tabber.dom);
    expect(tabber.strip.dom.tagName).toBe("NAV");
    expect(tabber.content.dom).toBeTruthy();
  });

  test("Strip has one tab per page", () => {
    const tabber = new Tabber([["One", new Box()], ["Two", new Box()], ["Three", new Box()]]);
    document.getElementById("stage").appendChild(tabber.dom);
    const tabs = tabber.strip.dom.querySelectorAll("[data-role='tab']");
    expect(tabs.length).toBe(3);
  });

  test("First tab is active by default", () => {
    const a = new Box();
    const b = new Box();
    const tabber = new Tabber([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(tabber.dom);
    expect(tabber.content.dom.contains(a.dom)).toBeTruthy();
    expect(tabber.content.dom.contains(b.dom)).toBe(false);
  });

  test("select(index) switches the visible panel", () => {
    const a = new Box();
    const b = new Box();
    const tabber = new Tabber([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(tabber.dom);
    tabber.select(1);
    expect(tabber.content.dom.contains(b.dom)).toBeTruthy();
    expect(tabber.content.dom.contains(a.dom)).toBe(false);
  });

  test("Clicking a tab switches the panel", () => {
    const a = new Box();
    const b = new Box();
    const tabber = new Tabber([["A", a], ["B", b]]);
    document.getElementById("stage").appendChild(tabber.dom);
    const tabs = tabber.strip.dom.querySelectorAll("[data-role='tab']");
    tabs[1].click();
    expect(tabber.content.dom.contains(b.dom)).toBeTruthy();
  });
});

visual("Tabber", () => {
  const tabber = new Tabber([
    ["Tab A", new Box(null, null).pad(16).add("Panel A content")],
    ["Tab B", new Box(null, null).pad(16).add("Panel B content")],
    ["Tab C", new Box(null, null).pad(16).add("Panel C content")],
  ]);
  return tabber.css({ width: "400px", height: "160px" });
});

describe("NavPager", () => {
  test("Starts empty — no nav entries", () => {
    const pager = new NavPager();
    expect(pager.nav.dom.querySelectorAll("[data-role='nav-entry']").length).toBe(0);
  });

  test("add() shows the new page in the content area", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    const box = new Box();
    pager.add(box);
    expect(pager.content.dom.contains(box.dom)).toBeTruthy();
  });

  test("add() creates a numbered nav entry per page", () => {
    const pager = new NavPager();
    pager.add(new Box());
    pager.add(new Box());
    expect(pager.nav.dom.querySelectorAll("[data-role='nav-entry']").length).toBe(2);
  });

  test("Each nav entry has a delete button", () => {
    const pager = new NavPager();
    pager.add(new Box());
    expect(pager.nav.dom.querySelector("[data-role='nav-delete']")).toBeTruthy();
  });

  test("Clicking delete removes the entry and its page", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    pager.add(new Box());
    pager.add(new Box());
    pager.nav.dom.querySelectorAll("[data-role='nav-delete']")[0].click();
    expect(pager.nav.dom.querySelectorAll("[data-role='nav-entry']").length).toBe(1);
  });

  test("delete callback fires when entry is deleted", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    let called = false;
    pager.add(new Box(), () => { called = true; });
    pager.nav.dom.querySelector("[data-role='nav-delete']").click();
    expect(called).toBeTruthy();
  });

  test("Clicking a nav entry switches the visible page", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    const a = new Box();
    const b = new Box();
    pager.add(a);
    pager.add(b);
    pager.nav.dom.querySelectorAll("[data-role='nav-entry']")[0].click();
    expect(pager.content.dom.contains(a.dom)).toBeTruthy();
    expect(pager.content.dom.contains(b.dom)).toBe(false);
  });

  test("active entry is highlighted after add()", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    pager.add(new Box());
    const entry = pager.nav.dom.querySelector("[data-role='nav-entry']");
    expect(entry.style.background).not.toBe("none");
  });

  test("clicking a nav entry transfers the highlight", () => {
    const pager = new NavPager();
    document.getElementById("stage").appendChild(pager.dom);
    pager.add(new Box());
    pager.add(new Box());
    const entries = pager.nav.dom.querySelectorAll("[data-role='nav-entry']");
    entries[0].click();
    expect(entries[0].style.background).not.toBe("none");
    expect(entries[1].style.background).toBe("none");
  });

  test("empty() removes all entries and clears content", () => {
    const pager = new NavPager();
    pager.add(new Box());
    pager.add(new Box());
    pager.empty();
    expect(pager.nav.dom.querySelectorAll("[data-role='nav-entry']").length).toBe(0);
    expect(pager.content.dom.children.length).toBe(0);
  });

  test("exposes an addBtn", () => {
    const pager = new NavPager();
    expect(typeof pager.addBtn.dom).toBe("object");
  });

  test("nav scrolls when entries overflow", () => {
    const pager = new NavPager();
    expect(pager.nav.dom.style.overflowY).toBe("auto");
  });
});

visual("NavPager", () => {
  const pager = new NavPager();
  let n = 0;
  pager.addBtn.on("click", () => pager.add(new Box(null, null).pad(16).add(`Page ${++n}`)));
  pager.addBtn.dom.click();
  pager.addBtn.dom.click();
  return pager.css({ width: "400px", height: "180px" });
});

describe("Toast", () => {
  test("has archet-toast class", () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    expect(t.dom.classList.contains("archet-toast")).toBeTruthy();
  });

  test("success() adds a message element to the container", () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    t.success("All good");
    expect(t.dom.children.length).toBe(1);
    expect(t.dom.children[0].textContent).toBe("All good");
  });

  test("error() adds a message element to the container", () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    t.error("Something went wrong");
    expect(t.dom.children.length).toBe(1);
    expect(t.dom.children[0].textContent).toBe("Something went wrong");
  });

  test("success message has archet-toast-success class", () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    t.success("OK");
    expect(t.dom.children[0].classList.contains("archet-toast-success")).toBeTruthy();
  });

  test("error message has archet-toast-error class", () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    t.error("Fail");
    expect(t.dom.children[0].classList.contains("archet-toast-error")).toBeTruthy();
  });

  test("message is removed after duration", async () => {
    const t = new Toast();
    document.getElementById("stage").appendChild(t.dom);
    t.success("Bye", 50);
    expect(t.dom.children.length).toBe(1);
    await new Promise(r => setTimeout(r, 100));
    expect(t.dom.children.length).toBe(0);
  });
});

visual("Toast", () => {
  const t = new Toast();
  t.success("Changes saved successfully", 0);
  t.error("Connection failed", 0);
  return t.css({ position: "relative" });
});

describe("Modal", () => {
  test("has archet-modal class", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    expect(m.dom.classList.contains("archet-modal")).toBeTruthy();
  });

  test("is hidden by default", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    expect(m.dom.style.display).toBe("none");
  });

  test("open() makes it visible", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    m.open();
    expect(m.dom.style.display).not.toBe("none");
  });

  test("close() hides it", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    m.open();
    m.close();
    expect(m.dom.style.display).toBe("none");
  });

  test("onClose callback fires when close() is called", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    let called = false;
    m.onClose = () => { called = true; };
    m.open();
    m.close();
    expect(called).toBeTruthy();
  });

  test("clicking the backdrop closes the modal", () => {
    const m = new Modal("Title", new Box());
    document.getElementById("stage").appendChild(m.dom);
    m.open();
    m.dom.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(m.dom.style.display).toBe("none");
  });
});

visual("Modal", () => {
  const content = new Box(null, null).pad(16).add("Modal body goes here.");
  const m = new Modal("Confirm action", content);
  m.open();
  return m.css({ position: "relative" });
});

describe("Spinner", () => {
  test("has archet-spinner class", () => {
    expect(new Spinner().dom.classList.contains("archet-spinner")).toBeTruthy();
  });

  test("is visible by default", () => {
    const s = new Spinner();
    expect(s.dom.style.display).not.toBe("none");
  });
});

visual("Spinner", () =>
  new Spinner()
);

describe("Accordion", () => {
  test("has archet-accordion class", () => {
    expect(new Accordion().dom.classList.contains("archet-accordion")).toBeTruthy();
  });

  test("add() creates a panel with a header and body", () => {
    const acc = new Accordion();
    acc.add("Section 1", new Box());
    expect(acc.dom.querySelectorAll("[data-role='panel-header']").length).toBe(1);
    expect(acc.dom.querySelectorAll("[data-role='panel-body']").length).toBe(1);
  });

  test("panels are collapsed by default", () => {
    const acc = new Accordion();
    acc.add("Section 1", new Box());
    const body = acc.dom.querySelector("[data-role='panel-body']");
    expect(body.style.display).toBe("none");
  });

  test("clicking a header expands its panel", () => {
    const acc = new Accordion();
    acc.add("Section 1", new Box());
    acc.dom.querySelector("[data-role='panel-header']").click();
    const body = acc.dom.querySelector("[data-role='panel-body']");
    expect(body.style.display).not.toBe("none");
  });

  test("clicking an open header collapses it", () => {
    const acc = new Accordion();
    acc.add("Section 1", new Box());
    const header = acc.dom.querySelector("[data-role='panel-header']");
    header.click();
    header.click();
    const body = acc.dom.querySelector("[data-role='panel-body']");
    expect(body.style.display).toBe("none");
  });

  test("multiple panels can be open simultaneously", () => {
    const acc = new Accordion();
    acc.add("Section 1", new Box());
    acc.add("Section 2", new Box());
    const headers = acc.dom.querySelectorAll("[data-role='panel-header']");
    headers[0].click();
    headers[1].click();
    const bodies = acc.dom.querySelectorAll("[data-role='panel-body']");
    expect(bodies[0].style.display).not.toBe("none");
    expect(bodies[1].style.display).not.toBe("none");
  });
});

visual("Accordion", () => {
  const acc = new Accordion();
  acc.add("Getting started",  new Box(null, null).pad(12).add("Welcome to Archet."));
  acc.add("Configuration",    new Box(null, null).pad(12).add("No config needed."));
  acc.add("Advanced usage",   new Box(null, null).pad(12).add("Just read the source."));
  return acc.css({ width: "360px" });
});

describe("Checklist", () => {
  test("has archet-checklist class", () => {
    expect(new Checklist().dom.classList.contains("archet-checklist")).toBeTruthy();
  });

  test("add() appends an item to the list", () => {
    const cl = new Checklist();
    cl.add("Buy milk");
    expect(cl.dom.querySelectorAll("[data-role='checklist-item']").length).toBe(1);
  });

  test("items start unchecked", () => {
    const cl = new Checklist();
    cl.add("Buy milk");
    const cb = cl.dom.querySelector("[data-role='item-check']");
    expect(cb.checked).toBe(false);
  });

  test("checking an item marks it as done", () => {
    const cl = new Checklist();
    cl.add("Buy milk");
    const cb = cl.dom.querySelector("[data-role='item-check']");
    cb.click();
    expect(cb.checked).toBe(true);
  });

  test("onComplete fires when an item is checked", () => {
    const cl = new Checklist();
    let received = null;
    cl.onComplete = (label) => { received = label; };
    cl.add("Buy milk");
    document.getElementById("stage").appendChild(cl.dom);
    cl.dom.querySelector("[data-role='item-check']").click();
    expect(received).toBe("Buy milk");
  });

  test("delete button removes the item", () => {
    const cl = new Checklist();
    cl.add("Buy milk");
    cl.add("Buy eggs");
    cl.dom.querySelectorAll("[data-role='item-delete']")[0].click();
    expect(cl.dom.querySelectorAll("[data-role='checklist-item']").length).toBe(1);
  });

  test("has an input and add button for new items", () => {
    const cl = new Checklist();
    expect(cl.dom.querySelector("[data-role='item-input']")).toBeTruthy();
    expect(cl.dom.querySelector("[data-role='item-add']")).toBeTruthy();
  });

  test("typing in the input and clicking add appends a new item", () => {
    const cl = new Checklist();
    document.getElementById("stage").appendChild(cl.dom);
    const input = cl.dom.querySelector("[data-role='item-input']");
    const btn   = cl.dom.querySelector("[data-role='item-add']");
    input.value = "Buy milk";
    btn.click();
    expect(cl.dom.querySelectorAll("[data-role='checklist-item']").length).toBe(1);
  });

  test("add clears the input after adding", () => {
    const cl = new Checklist();
    document.getElementById("stage").appendChild(cl.dom);
    const input = cl.dom.querySelector("[data-role='item-input']");
    input.value = "Buy milk";
    cl.dom.querySelector("[data-role='item-add']").click();
    expect(input.value).toBe("");
  });

  test("add does nothing when input is empty", () => {
    const cl = new Checklist();
    document.getElementById("stage").appendChild(cl.dom);
    cl.dom.querySelector("[data-role='item-add']").click();
    expect(cl.dom.querySelectorAll("[data-role='checklist-item']").length).toBe(0);
  });

  test("pressing Enter in the input adds the item", () => {
    const cl = new Checklist();
    document.getElementById("stage").appendChild(cl.dom);
    const input = cl.dom.querySelector("[data-role='item-input']");
    input.value = "Buy milk";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(cl.dom.querySelectorAll("[data-role='checklist-item']").length).toBe(1);
  });

  test("scrolls when items overflow", () => {
    const cl = new Checklist();
    expect(cl.dom.style.overflowY).toBe("auto");
  });

  test("multiple items can be checked independently", () => {
    const cl = new Checklist();
    cl.add("Task A");
    cl.add("Task B");
    const boxes = cl.dom.querySelectorAll("[data-role='item-check']");
    boxes[0].click();
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(false);
  });
});

visual("Checklist", () => {
  const cl = new Checklist();
  cl.onComplete = () => {};
  cl.add("Review pull requests");
  cl.add("Run test suite");
  cl.add("Deploy to staging");
  cl.add("Notify the team");
  return cl.css({ width: "320px" });
});
