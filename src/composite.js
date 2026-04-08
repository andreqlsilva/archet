import { Component, Box, Row } from './core.js';
import { Text } from './content.js';
import { Input, Button } from './form.js';

// --- 11. DECK ---
export class Deck extends Component {
  constructor() {
    super("div");
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

// --- 12. CRUD ---
export class Crud extends Box {
  constructor(title, schema=[]) {
    super();
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
