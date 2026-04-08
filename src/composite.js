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
    this.nav.css({ display:"flex", flexDirection:"column", gap:"4px", padding:"10px", borderRight:"1px solid #ccc", minWidth:"120px" });

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
    this._links.forEach((l, j) => l.css({ background: j === i ? "#ddd" : "none", fontWeight: j === i ? "bold" : "normal" }));
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
    this.strip.css({ display:"flex", gap:"2px", borderBottom:"1px solid #ccc", padding:"0 10px" });

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
    this.nav.css({ display:"flex", flexDirection:"column", gap:"4px", padding:"10px", borderRight:"1px solid #ccc", minWidth:"120px" });
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

    this.bg("#fff").bd(1, "#ddd").round(8).pad(20).css({ maxWidth: "800px", margin: "20px auto" });
    this.add(new Text(title).css({ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }));

    const form = new Row().gap(10).css({ marginBottom: "20px" });
    this.inputs = {};
    schema.forEach(field => {
      const input = new Input(field).css({ flex: 1 });
      this.inputs[field] = input; form.add(input);
    });
    this.add(form.add(new Button("Add", () => this.addItem()).bg("#28a745").fg("#fff").nobd()));

    this.list = new Box().gap(5);
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
      const row = new Row().bg("#f9f9f9").pad(10).round(4).bd(1, "#eee");
      this.schema.forEach(k => row.add(new Text(item[k]).css({ flex: 1 })));

      row.add(new Button("×", () => {
        this.data.splice(idx, 1);
        this.renderList();
      }).bg("transparent").fg("#c00").nobd().data("role", "delete"));

      this.list.add(row);
    });
  }
}
