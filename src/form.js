import { Component } from './core.js';

// --- 9. BUTTON ---
export class Button extends Component {
  constructor(content, fn) {
    super("button");
    if (typeof content === "string") this.dom.textContent = content;
    else this.add(content);

    if (fn) this.on("click", (e) => { e.preventDefault(); fn(e); });

    this.css({
      cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
      border:"1px solid #ccc", background:"#eee", color:"inherit", fontSize: "inherit"
    }).pad(10).round(4);
  }
}

// --- 10. INPUT ---
export class Input extends Component {
  static uid = 0;

  constructor(ph="", lines=1, label=null, type="text") {
    if (label) {
      super("div");
      const id = `inp-${Input.uid++}`;
      this.css({ display:"flex", flexDirection:"column", gap:"5px", width:"100%" });

      const lbl = new Component("label").attr("for", id).add(label);
      lbl.css({ fontSize:"0.85rem", fontWeight:"bold", display:"block" });

      this.input = new Input(ph, lines, null, type);
      this.input.id(id);
      this.add(lbl, this.input);
      return;
    }

    super(lines > 1 ? "textarea" : "input");
    this.attr("placeholder", ph);
    this.css({ width:"100%", fontFamily:"inherit", resize:"vertical" }).pad(8).bd(1).round(4);

    if (lines > 1) this.attr("rows", lines);
    else this.attr("type", type);
  }

  get val() {
    if (this.input) return this.input.val;
    return this.dom.type === "number" ? Number(this.dom.value) : this.dom.value;
  }
  set val(v) { if (this.input) this.input.dom.value = v; else this.dom.value = v; }
}

// --- 11. CHECKBOX ---
export class Checkbox extends Component {
  constructor() {
    super("input");
    this.attr("type", "checkbox");
  }

  get val() { return this.dom.checked; }
  set val(v) { if (typeof v === "boolean") this.dom.checked = v; }
}

// --- 12. SELECT ---
export class Select extends Component {
  constructor(options=[]) {
    super("select");
    this.css({ width:"100%", fontFamily:"inherit" }).pad(8).bd(1).round(4);
    options.forEach(([value, label]) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      this.dom.appendChild(opt);
    });
  }

  get val() { return this.dom.value; }
  set val(v) {
    if (Array.from(this.dom.options).some(o => o.value === v)) this.dom.value = v;
  }
}
