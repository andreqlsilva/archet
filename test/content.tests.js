import { describe, test, expect, visual } from '../test.js';
const { Table } =
  await import('../archet.js').catch(() => ({}));

describe("Table", () => {
  test("has archet-table class", () => {
    expect(new Table(["A", "B"]).dom.classList.contains("archet-table")).toBeTruthy();
  });

  test("renders a <table> element", () => {
    expect(new Table(["A"]).dom.tagName).toBe("TABLE");
  });

  test("renders correct number of header columns", () => {
    const t = new Table(["Name", "Email", "Role"]);
    expect(t.dom.tHead.rows[0].cells.length).toBe(3);
    expect(t.dom.tHead.rows[0].cells[0].textContent).toBe("Name");
    expect(t.dom.tHead.rows[0].cells[2].textContent).toBe("Role");
  });

  test("addRow() appends a row with correct cell values", () => {
    const t = new Table(["Name", "Email"]);
    t.addRow(["Alice", "alice@example.com"]);
    expect(t.dom.tBodies[0].rows.length).toBe(1);
    expect(t.dom.tBodies[0].rows[0].cells[0].textContent).toBe("Alice");
    expect(t.dom.tBodies[0].rows[0].cells[1].textContent).toBe("alice@example.com");
  });

  test("addRow() appends multiple rows in order", () => {
    const t = new Table(["Name"]);
    t.addRow(["Alice"]);
    t.addRow(["Bob"]);
    t.addRow(["Carol"]);
    expect(t.dom.tBodies[0].rows.length).toBe(3);
    expect(t.dom.tBodies[0].rows[2].cells[0].textContent).toBe("Carol");
  });

  test("clear() removes all rows but keeps headers", () => {
    const t = new Table(["Name", "Email"]);
    t.addRow(["Alice", "alice@example.com"]);
    t.addRow(["Bob",   "bob@example.com"]);
    t.clear();
    expect(t.dom.tBodies[0].rows.length).toBe(0);
    expect(t.dom.tHead.rows[0].cells.length).toBe(2);
  });
});

visual("Table", () => {
  const t = new Table(["Name", "Email", "Role"]);
  t.addRow(["Alice",   "alice@example.com",   "Admin"]);
  t.addRow(["Bob",     "bob@example.com",     "User"]);
  t.addRow(["Carol",   "carol@example.com",   "User"]);
  return t.css({ width: "460px" });
});
