import { Component, Box, Row } from './core.js';
import { Text } from './content.js';
import { Input, Button } from './form.js';

// --- 11. DECK ---
export class Deck extends Component {
  constructor() {
    super("div");
    this.cls("archet-deck");
    this.items = []; this.idx = 0;
    this.size(100, 100).css({ display:"flex", flexDirection:"column" });
  }

  add(k) {
    if (!(k instanceof Component)) throw new Error("Deck: Only Archet Components allowed (need .show/.hide methods)");
    this.items.push(k);
    super.add(k);
    this.render();
    return this;
  }

  show(i) {
    if (i < 0) i = this.items.length - 1;
    if (i >= this.items.length) i = 0;
    this.idx = i; this.render();
    return this;
  }

  render() {
    this.items.forEach((item, i) => {
      (i === this.idx) ? item.show() : item.hide();
    });
    return this;
  }
}

// --- 12. PAGER ---
export class Pager extends Component {
  constructor(pages=[]) {
    super("div");
    this.cls("archet-pager");
    this.css({ display:"flex", height:"100%" });
    this._pages = pages;

    this.nav = new Component("nav");
    this.nav.css({ display:"flex", flexDirection:"column", gap:"4px", padding:"10px", borderRight:"1px solid var(--archet-border,#ccc)", minWidth:"120px", overflowY:"auto" });

    this.content = new Box();
    this.content.css({ flex:"1", overflow:"auto" });

    this._links = pages.map(([label], i) => {
      const link = new Component("button").add(label);
      link.css({ background:"none", border:"none", textAlign:"left", cursor:"pointer", padding:"6px 10px", borderRadius:"4px", color:"inherit", fontFamily:"inherit", fontSize:"inherit" });
      link.attr("data-role", "page-link");
      link.on("click", () => this.select(i));
      this.nav.add(link);
      return link;
    });

    super.add(this.nav);
    super.add(this.content);
    this.select(0);
  }

  select(i) {
    this._idx = i;
    this.content.dom.innerHTML = "";
    this.content.dom.appendChild(this._pages[i][1].dom);
    this._links.forEach((l, j) => l.css({ background: j === i ? "var(--archet-surface,#ddd)" : "none", fontWeight: j === i ? "bold" : "normal" }));
    return this;
  }
}

// --- 13. TABBER ---
export class Tabber extends Component {
  constructor(pages=[]) {
    super("div");
    this.cls("archet-tabber");
    this.css({ display:"flex", flexDirection:"column", height:"100%" });
    this._pages = pages;

    this.strip = new Component("nav");
    this.strip.css({ display:"flex", gap:"2px", borderBottom:"1px solid var(--archet-border,#ccc)", padding:"0 10px" });

    this.content = new Box();
    this.content.css({ flex:"1", overflow:"auto" });

    this._tabs = pages.map(([label], i) => {
      const tab = new Component("button").add(label);
      tab.css({ background:"none", border:"none", borderBottom:"2px solid transparent", cursor:"pointer", padding:"8px 14px", color:"inherit", fontFamily:"inherit", fontSize:"inherit" });
      tab.attr("data-role", "tab");
      tab.on("click", () => this.select(i));
      this.strip.add(tab);
      return tab;
    });

    super.add(this.strip);
    super.add(this.content);
    this.select(0);
  }

  select(i) {
    this._idx = i;
    this.content.dom.innerHTML = "";
    this.content.dom.appendChild(this._pages[i][1].dom);
    this._tabs.forEach((t, j) => t.css({ borderBottom: j === i ? "2px solid currentColor" : "2px solid transparent", fontWeight: j === i ? "bold" : "normal" }));
    return this;
  }
}

// --- 14. NAVPAGER ---
export class NavPager extends Component {
  constructor() {
    super("div");
    this.cls("archet-navpager");
    this.css({ display:"flex", height:"100%" });
    this._pages = [];

    this.addBtn = new Button("+");
    this.nav = new Component("nav");
    this.nav.css({ display:"flex", flexDirection:"column", gap:"4px", padding:"10px", borderRight:"1px solid var(--archet-border,#ccc)", minWidth:"120px", overflowY:"auto" });
    this.nav.add(this.addBtn);

    this.content = new Box();
    this.content.css({ flex:"1", overflow:"auto" });

    super.add(this.nav);
    super.add(this.content);
  }

  add(component, onDelete) {
    const entry = new Component("div");
    entry.attr("data-role", "nav-entry");
    entry.css({ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"4px" });

    const label = new Component("span");
    label.css({ flex:"1", cursor:"pointer", padding:"4px 6px" });

    const del = new Component("button").add("×");
    del.attr("data-role", "nav-delete");
    del.css({ background:"none", border:"none", cursor:"pointer", color:"inherit", fontSize:"inherit", padding:"2px 6px" });

    entry.add(label);
    entry.add(del);
    this.nav.add(entry);

    const page = { component, entry, label, del, onDelete };
    this._pages.push(page);

    entry.on("click", (e) => { if (!e.target.closest("[data-role='nav-delete']")) this._show(this._pages.indexOf(page)); });
    del.on("click", () => { if (page.onDelete) page.onDelete(); this._remove(this._pages.indexOf(page)); });

    this._renumber();
    this._show(this._pages.length - 1);
    return this;
  }

  _renumber() {
    this._pages.forEach(({ label }, i) => { label.dom.textContent = String(i + 1); });
  }

  _show(i) {
    if (i < 0 || i >= this._pages.length) return;
    this._idx = i;
    this.content.dom.innerHTML = "";
    this.content.dom.appendChild(this._pages[i].component.dom);
    this._pages.forEach(({ entry }, j) => entry.css({ background: j === i ? "var(--archet-surface,#ddd)" : "none", fontWeight: j === i ? "bold" : "normal" }));
  }

  _remove(i) {
    if (i < 0 || i >= this._pages.length) return;
    this._pages[i].entry.dom.remove();
    this._pages.splice(i, 1);
    this._renumber();
    this.content.dom.innerHTML = "";
    if (this._pages.length > 0) this._show(0);
  }

  empty() {
    this._pages.forEach(({ entry }) => entry.dom.remove());
    this._pages = [];
    this.content.dom.innerHTML = "";
  }
}

// --- 15. CRUD ---
export class Crud extends Box {
  constructor(title, schema=[]) {
    super();
    this.cls("archet-crud");
    this.schema = schema; this.data = [];
    this.onError = alert;

    this.bg("var(--archet-bg,#fff)").bd(1, "var(--archet-border,#ddd)").round(8).pad(20).css({ maxWidth: "800px", margin: "20px auto" });
    this.add(new Text(title).css({ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }));

    const form = new Row().gap(10).css({ marginBottom: "20px" });
    this.inputs = {};
    schema.forEach(field => {
      const input = new Input(field).css({ flex: 1 });
      this.inputs[field] = input; form.add(input);
    });
    this.add(form.add(new Button("Add", () => this.addItem()).bg("#28a745").fg("#fff").nobd()));

    this.list = new Box().gap(5).css({ overflowY:"auto" });
    this.add(this.list);
  }

  addItem() {
    const rowData = {};
    let valid = true;
    this.schema.forEach(k => {
      const v = this.inputs[k].val;
      if (v === "") valid = false;
      rowData[k] = v;
    });

    if (!valid) return this.onError("Fill all fields");

    this.data.push(rowData);
    Object.values(this.inputs).forEach(i => i.val = "");
    this.renderList();
  }

  renderList() {
    this.list.dom.innerHTML = "";
    this.data.forEach((item, idx) => {
      const row = new Row().bg("var(--archet-surface-alt,#f9f9f9)").pad(10).round(4).bd(1, "var(--archet-border,#eee)");
      this.schema.forEach(k => row.add(new Text(item[k]).css({ flex: 1 })));

      row.add(new Button("×", () => {
        this.data.splice(idx, 1);
        this.renderList();
      }).bg("transparent").fg("#c00").nobd().data("role", "delete"));

      this.list.add(row);
    });
  }
}

// --- 16. TOAST ---
(function() {
  if (document.getElementById("archet-toast-style")) return;
  const s = document.createElement("style");
  s.id = "archet-toast-style";
  s.textContent = `
    .archet-toast-success { background: #28a745; color: #fff; }
    .archet-toast-error   { background: #dc3545; color: #fff; }
  `;
  document.head.appendChild(s);
}());

export class Toast extends Component {
  constructor() {
    super("div");
    this.cls("archet-toast");
    this.css({ display:"flex", flexDirection:"column", gap:"6px" });
  }

  _show(msg, cls, duration) {
    const el = document.createElement("div");
    el.className = cls;
    el.textContent = msg;
    el.style.cssText = "padding:10px 16px;border-radius:4px;font-family:inherit;";
    this.dom.appendChild(el);
    if (duration > 0) setTimeout(() => el.remove(), duration);
    return this;
  }

  success(msg, duration=3000) { return this._show(msg, "archet-toast-success", duration); }
  error(msg,   duration=3000) { return this._show(msg, "archet-toast-error",   duration); }
}

// --- 17. MODAL ---
export class Modal extends Component {
  constructor(title, content) {
    super("div");
    this.cls("archet-modal");
    this.onClose = null;
    this.css({ display:"none", position:"fixed", inset:"0", background:"rgba(0,0,0,0.5)", alignItems:"center", justifyContent:"center", zIndex:"1000" });

    this._dialog = new Component("div");
    this._dialog.css({ background:"var(--archet-bg,#fff)", borderRadius:"6px", padding:"24px", minWidth:"320px", maxWidth:"90vw", maxHeight:"90vh", overflow:"auto", position:"relative" });

    const header = new Row().css({ justifyContent:"space-between", marginBottom:"16px" });
    header.add(new Text(title).css({ fontWeight:"bold", fontSize:"1.1rem" }));
    header.add(new Button("×", () => this.close()).nobd().bg("transparent").css({ fontSize:"1.2rem", lineHeight:"1" }));

    this._dialog.add(header);
    this._dialog.add(content);
    super.add(this._dialog);

    this.dom.addEventListener("click", (e) => { if (e.target === this.dom) this.close(); });
  }

  open()  { this.css({ display:"flex" }); return this; }
  close() { this.css({ display:"none" }); if (this.onClose) this.onClose(); return this; }
}

// --- 18. SPINNER ---
export class Spinner extends Component {
  constructor(size=32) {
    super("div");
    this.cls("archet-spinner");
    this.css({ width:`${size}px`, height:`${size}px`, border:"3px solid var(--archet-border,#ddd)", borderTopColor:"var(--archet-muted,#555)", borderRadius:"50%", display:"inline-block", animation:"archet-spin 0.7s linear infinite" });
    if (!document.getElementById("archet-spinner-style")) {
      const s = document.createElement("style");
      s.id = "archet-spinner-style";
      s.textContent = "@keyframes archet-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(s);
    }
  }
}

// --- 19. ACCORDION ---
export class Accordion extends Component {
  constructor() {
    super("div");
    this.cls("archet-accordion");
    this.css({ display:"flex", flexDirection:"column", width:"100%" });
  }

  add(label, content) {
    const panel = new Component("div");
    panel.css({ borderBottom:"1px solid var(--archet-border,#ddd)" });

    const header = new Component("button");
    header.attr("data-role", "panel-header");
    header.add(label);
    header.css({ width:"100%", textAlign:"left", background:"none", border:"none", padding:"10px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:"inherit", fontWeight:"bold", color:"inherit" });

    const body = new Component("div");
    body.attr("data-role", "panel-body");
    body.css({ display:"none", padding:"10px 14px" });
    body.add(content);

    header.on("click", () => {
      const open = body.dom.style.display !== "none";
      body.css({ display: open ? "none" : "block" });
    });

    panel.add(header);
    panel.add(body);
    super.add(panel);
    return this;
  }
}

// --- 20. CHECKLIST ---
(function() {
  if (document.getElementById("archet-checklist-style")) return;
  const s = document.createElement("style");
  s.id = "archet-checklist-style";
  s.textContent = `
    .archet-checklist input[type="checkbox"] {
      appearance: none; -webkit-appearance: none;
      width: 22px; height: 22px; min-width: 22px;
      border: 2px solid var(--archet-border,#aaa); border-radius: 4px;
      cursor: pointer; position: relative;
      transition: background 0.15s, border-color 0.15s;
    }
    .archet-checklist input[type="checkbox"]:checked {
      background: #28a745; border-color: #28a745;
    }
    .archet-checklist input[type="checkbox"]:checked::after {
      content: ""; position: absolute;
      left: 5px; top: 2px; width: 6px; height: 11px;
      border: 2px solid #fff; border-top: none; border-left: none;
      transform: rotate(45deg);
    }
  `;
  document.head.appendChild(s);
}());

export class Checklist extends Component {
  constructor() {
    super("div");
    this.cls("archet-checklist");
    this.css({ display:"flex", flexDirection:"column", gap:"4px", overflowY:"auto" });
    this.onComplete = null;

    const row   = new Component("div");
    row.css({ display:"flex", gap:"6px", padding:"4px 0" });

    const input = document.createElement("input");
    input.type = "text";
    input.dataset.role = "item-input";
    input.placeholder = "New item…";
    input.style.cssText = "flex:1;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-family:inherit;font-size:inherit;";

    const btn = document.createElement("button");
    btn.dataset.role = "item-add";
    btn.textContent = "+";
    btn.style.cssText = "padding:6px 12px;border:none;border-radius:4px;background:#28a745;color:#fff;font-size:1.1rem;cursor:pointer;";

    const doAdd = () => {
      const label = input.value.trim();
      if (!label) return;
      this.add(label);
      input.value = "";
      input.focus();
    };

    btn.addEventListener("click", doAdd);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doAdd(); });

    row.dom.appendChild(input);
    row.dom.appendChild(btn);
    super.add(row);
  }

  add(label) {
    const item = new Component("div");
    item.attr("data-role", "checklist-item");
    item.css({ display:"flex", alignItems:"center", gap:"10px", padding:"6px 8px", borderRadius:"4px" });

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.role = "item-check";

    const lbl = document.createElement("span");
    lbl.textContent = label;
    lbl.style.flex = "1";

    const del = document.createElement("button");
    del.dataset.role = "item-delete";
    del.textContent = "×";
    del.style.cssText = "border:none;cursor:pointer;color:#fff;background:#c00;font-size:1rem;padding:2px 8px;border-radius:4px;line-height:1.4;";

    cb.addEventListener("change", () => {
      lbl.style.textDecoration = cb.checked ? "line-through" : "";
      lbl.style.opacity        = cb.checked ? "0.5" : "";
      if (cb.checked && this.onComplete) this.onComplete(label);
    });

    del.addEventListener("click", () => item.dom.remove());

    item.dom.appendChild(cb);
    item.dom.appendChild(lbl);
    item.dom.appendChild(del);
    super.add(item);
    return this;
  }
}
