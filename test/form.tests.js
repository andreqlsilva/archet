import { describe, test, expect, visual } from '../test.js';
const { Input, Button, Select, Checkbox, FilePicker, Form } =
  await import('../archet.js').catch(() => ({}));

describe("Input", () => {
  test("Generates deterministic sequential IDs", () => {
    Input.uid = 0;
    const inp = new Input("A", 1, "Label A");
    document.getElementById("stage").appendChild(inp.dom);
    expect(inp.input.dom.id).toMatch(/^inp-\d+$/);
    expect(inp.input.dom.id).toBe("inp-0");
  });

  test("Label click focuses the input", () => {
    Input.uid = 0;
    const inp = new Input("A", 1, "Label A");
    document.getElementById("stage").appendChild(inp.dom);
    const label = inp.dom.querySelector("label");
    label.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(inp.input.dom);
  });

  test("val getter/setter works on labelled input", () => {
    const inp = new Input("ph", 1, "Label");
    inp.val = "hello";
    expect(inp.val).toBe("hello");
  });
});

visual("Input (text)", () =>
  new Input("Type something…", 1, "Username").css({ width: "240px" })
);

visual("Input (multiline)", () =>
  new Input("Write a message…", 4, "Message").css({ width: "240px" })
);

describe("Input — number type", () => {
  test("Renders an <input type='number'>", () => {
    const n = new Input("0", 1, null, "number");
    expect(n.dom.tagName).toBe("INPUT");
    expect(n.dom.type).toBe("number");
  });

  test("val getter returns a Number, not a string", () => {
    const n = new Input("0", 1, null, "number");
    document.getElementById("stage").appendChild(n.dom);
    n.val = 42;
    expect(typeof n.val).toBe("number");
    expect(n.val).toBe(42);
  });

  test("val setter accepts numeric values", () => {
    const n = new Input("0", 1, null, "number");
    n.val = 7;
    expect(n.val).toBe(7);
  });
});

visual("Input (number)", () =>
  new Input("0", 1, "Quantity", "number").css({ width: "160px" })
);

describe("Input — date type", () => {
  test("Renders an <input type='date'>", () => {
    const d = new Input("", 1, null, "date");
    expect(d.dom.tagName).toBe("INPUT");
    expect(d.dom.type).toBe("date");
  });

  test("val getter/setter works with ISO date strings", () => {
    const d = new Input("", 1, null, "date");
    document.getElementById("stage").appendChild(d.dom);
    d.val = "2024-06-15";
    expect(d.val).toBe("2024-06-15");
  });
});

visual("Input (date)", () =>
  new Input("", 1, "Date", "date").css({ width: "200px" })
);

describe("Checkbox", () => {
  test("Renders an <input type='checkbox'>", () => {
    const cb = new Checkbox();
    expect(cb.dom.tagName).toBe("INPUT");
    expect(cb.dom.type).toBe("checkbox");
  });

  test("val is false by default", () => {
    const cb = new Checkbox();
    expect(cb.val).toBe(false);
  });

  test("val setter accepts booleans", () => {
    const cb = new Checkbox();
    cb.val = true;
    expect(cb.val).toBe(true);
    cb.val = false;
    expect(cb.val).toBe(false);
  });

  test("val setter ignores non-booleans", () => {
    const cb = new Checkbox();
    cb.val = "yes";
    expect(cb.val).toBe(false);
  });
});

visual("Checkbox", () => {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;gap:8px;padding:8px";
  const cb = new Checkbox();
  cb.val = true;
  const lbl = document.createElement("label");
  lbl.textContent = "I agree to the terms";
  row.appendChild(cb.dom);
  row.appendChild(lbl);
  return row;
});

describe("Select", () => {
  test("Renders a <select> element", () => {
    const sel = new Select([["1", "One"], ["2", "Two"]]);
    expect(sel.dom.tagName).toBe("SELECT");
  });

  test("Populates options with correct values and labels", () => {
    const sel = new Select([["a", "Alpha"], ["b", "Beta"], ["c", "Gamma"]]);
    expect(sel.dom.options.length).toBe(3);
    expect(sel.dom.options[0].value).toBe("a");
    expect(sel.dom.options[0].textContent).toBe("Alpha");
    expect(sel.dom.options[2].value).toBe("c");
    expect(sel.dom.options[2].textContent).toBe("Gamma");
  });

  test("Options render in the order given", () => {
    const sel = new Select([["2", "Two"], ["1", "One"], ["3", "Three"]]);
    expect(sel.dom.options[0].value).toBe("2");
    expect(sel.dom.options[1].value).toBe("1");
    expect(sel.dom.options[2].value).toBe("3");
  });

  test("val getter returns the first option's value by default", () => {
    const sel = new Select([["x", "Ex"], ["y", "Why"]]);
    expect(sel.val).toBe("x");
  });

  test("val setter changes the selected option", () => {
    const sel = new Select([["a", "Alpha"], ["b", "Beta"]]);
    sel.val = "b";
    expect(sel.val).toBe("b");
  });

  test("val setter ignores values not in the options", () => {
    const sel = new Select([["a", "Alpha"], ["b", "Beta"]]);
    sel.val = "z";
    expect(sel.val).toBe("a");
  });

  test("Blank option first — val is empty string by default", () => {
    const sel = new Select([["", ""], ["1", "One"], ["2", "Two"]]);
    expect(sel.dom.options.length).toBe(3);
    expect(sel.val).toBe("");
  });

  test("Blank option last — first real option is selected by default", () => {
    const sel = new Select([["1", "One"], ["2", "Two"], ["", ""]]);
    expect(sel.val).toBe("1");
    expect(sel.dom.options[2].value).toBe("");
  });
});

visual("Select", () =>
  new Select([["", "— choose —"], ["a", "Alpha"], ["b", "Beta"], ["c", "Gamma"]]).css({ width: "200px" })
);

describe("Select — dynamic options", () => {
  test("addOption() appends a new option", () => {
    const sel = new Select([]);
    sel.addOption("a", "Alpha");
    expect(sel.dom.options.length).toBe(1);
    expect(sel.dom.options[0].value).toBe("a");
    expect(sel.dom.options[0].textContent).toBe("Alpha");
  });

  test("removeOption() removes an option by value", () => {
    const sel = new Select([["a", "Alpha"], ["b", "Beta"]]);
    sel.removeOption("a");
    expect(sel.dom.options.length).toBe(1);
    expect(sel.dom.options[0].value).toBe("b");
  });

  test("updateOption() changes the label of an option", () => {
    const sel = new Select([["a", "Alpha"]]);
    sel.updateOption("a", "Renamed");
    expect(sel.dom.options[0].textContent).toBe("Renamed");
  });

  test("clearOptions() removes all options", () => {
    const sel = new Select([["a", "Alpha"], ["b", "Beta"]]);
    sel.clearOptions();
    expect(sel.dom.options.length).toBe(0);
  });
});

describe("Semantic CSS classes — form", () => {
  test("Button has archet-button class", () => {
    expect(new Button("x").dom.classList.contains("archet-button")).toBeTruthy();
  });
  test("Input (no label) has archet-input class", () => {
    expect(new Input("x").dom.classList.contains("archet-input")).toBeTruthy();
  });
  test("Input (with label) has archet-input class", () => {
    expect(new Input("x", 1, "Label").dom.classList.contains("archet-input")).toBeTruthy();
  });
  test("Checkbox has archet-checkbox class", () => {
    expect(new Checkbox().dom.classList.contains("archet-checkbox")).toBeTruthy();
  });
  test("Select has archet-select class", () => {
    expect(new Select([]).dom.classList.contains("archet-select")).toBeTruthy();
  });
  test("FilePicker has archet-filepicker class", () => {
    expect(new FilePicker().dom.classList.contains("archet-filepicker")).toBeTruthy();
  });
});

visual("Button states", () => {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:8px;padding:8px;flex-wrap:wrap";
  [
    new Button("Default"),
    new Button("Primary").bg("#007bff").fg("#fff").nobd(),
    new Button("Success").bg("#28a745").fg("#fff").nobd(),
    new Button("Danger").bg("#dc3545").fg("#fff").nobd(),
    new Button("Disabled").attr("disabled", "").css({ opacity: "0.5", cursor: "not-allowed" }),
  ].forEach(b => row.appendChild(b.dom));
  return row;
});

describe("Button — flash feedback", () => {
  test("flashSuccess() adds then removes feedback-success class", async () => {
    const btn = new Button("Save");
    document.getElementById("stage").appendChild(btn.dom);
    btn.flashSuccess(50);
    expect(btn.dom.classList.contains("feedback-success")).toBeTruthy();
    await new Promise(r => setTimeout(r, 100));
    expect(btn.dom.classList.contains("feedback-success")).toBe(false);
  });

  test("flashError() adds then removes feedback-error class", async () => {
    const btn = new Button("Save");
    document.getElementById("stage").appendChild(btn.dom);
    btn.flashError(50);
    expect(btn.dom.classList.contains("feedback-error")).toBeTruthy();
    await new Promise(r => setTimeout(r, 100));
    expect(btn.dom.classList.contains("feedback-error")).toBe(false);
  });
});

describe("FilePicker", () => {
  test("Renders an <input type='file'>", () => {
    const fp = new FilePicker();
    expect(fp.dom.tagName).toBe("INPUT");
    expect(fp.dom.type).toBe("file");
  });

  test("Accepts only .json files by default", () => {
    const fp = new FilePicker();
    expect(fp.dom.accept).toBe(".json");
  });

  test("file getter returns null when no file selected", () => {
    const fp = new FilePicker();
    expect(fp.file).toBe(null);
  });

  test("trigger() is a function", () => {
    const fp = new FilePicker();
    expect(typeof fp.trigger).toBe("function");
  });
});

visual("FilePicker", () =>
  new FilePicker()
);

describe("Form", () => {
  test("has archet-form class", () => {
    expect(new Form().dom.classList.contains("archet-form")).toBeTruthy();
  });

  test("add() registers a named field", () => {
    const form = new Form();
    form.add("name", new Input("Name"));
    expect(form.dom.children.length).toBe(1);
  });

  test("values() collects values from all fields", () => {
    const form = new Form();
    const inp = new Input("Name");
    inp.val = "Alice";
    form.add("name", inp);
    expect(form.values().name).toBe("Alice");
  });

  test("values() handles mixed field types", () => {
    const form = new Form();
    const inp = new Input("Name");
    inp.val = "Bob";
    const sel = new Select([["a", "Alpha"], ["b", "Beta"]]);
    sel.val = "b";
    const cb = new Checkbox();
    cb.val = true;
    form.add("name", inp);
    form.add("role", sel);
    form.add("active", cb);
    const v = form.values();
    expect(v.name).toBe("Bob");
    expect(v.role).toBe("b");
    expect(v.active).toBe(true);
  });

  test("clear() resets all field values", () => {
    const form = new Form();
    const inp = new Input("Name");
    inp.val = "Alice";
    form.add("name", inp);
    form.clear();
    expect(form.values().name).toBe("");
  });

  test("remove() unregisters a field and removes it from the DOM", () => {
    const form = new Form();
    form.add("name", new Input("Name"));
    form.add("email", new Input("Email"));
    form.remove("name");
    expect(form.dom.children.length).toBe(1);
    expect(form.values().name).toBe(undefined);
  });
});

visual("Form", () => {
  const form = new Form();
  form.add("name",  new Input("Full name",    1, "Name"));
  form.add("email", new Input("Email address", 1, "Email"));
  form.add("role",  new Select([["", "— role —"], ["admin", "Admin"], ["user", "User"]], "Role"));
  form.add("active", new Checkbox());
  return form.css({ width: "300px" });
});
