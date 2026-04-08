/* archet - suckless web UI */
/* More info: www.archet.ink */

// --- 0. THE BASE ---
export class Component {
  constructor(tag) {
    this.dom = document.createElement(tag);
  }

  // --- CORE ---
  add(...kids) {
    kids.forEach(k => {
      // 1. Primitives -> Text Component
      if (["string", "number", "boolean"].includes(typeof k)) k = new Text(k);

      // 2. Validate & Append
      if (k instanceof Component) this.dom.appendChild(k.dom);
      else if (k instanceof Node) this.dom.appendChild(k);
      else if (k != null) console.warn(`Archet: Dropped invalid child in <${this.dom.tagName}>:`, k);
    });
    return this;
  }

  // Styles & Attributes
  css(s) { Object.assign(this.dom.style, s); return this; }
  on(e, f) { this.dom.addEventListener(e, f); return this; }

  attr(a, v) {
    if (v === null || v === undefined) this.dom.removeAttribute(a);
    else this.dom.setAttribute(a, String(v));
    return this;
  }

  // --- MACROS ---
  id(v) { this.dom.id = v; return this; }

  cls(...n) {
    const valid = n.filter(x => x);
    if (valid.length) this.dom.classList.add(...valid);
    return this;
  }

  data(k, v) {
    if (v === null || v === undefined) delete this.dom.dataset[k];
    else this.dom.dataset[k] = String(v);
    return this;
  }

  bg(c) { return this.css({ background: c }); }
  fg(c) { return this.css({ color: c }); }

  // Stateful Display
  hide() {
    if (this.dom.style.display !== "none") {
      this._disp = this.dom.style.display;
      this.css({ display: "none" });
    }
    return this;
  }
  show() {
    if (this.dom.style.display === "none") {
      this.css({ display: this._disp || "" });
    }
    return this;
  }

  // Geometry
  size(w, h) {
    if (w != null) this.css({ width: typeof w === 'number' ? `${w}%` : w });
    if (h != null) this.css({ height: typeof h === 'number' ? `${h}%` : h });
    return this;
  }

  // Visuals
  bd(w=1, c="#ccc", s="solid") { return this.css({ border: `${w}px ${s} ${c}` }); }
  nobd() { return this.css({ border: "none" }); }
  round(px=4) { return this.css({ borderRadius: `${px}px` }); }
  pad(px) { return this.css({ padding: `${px}px` }); }
  gap(px) { return this.css({ gap: `${px}px` }); }

  animate(prop="all", time="0.2s") { return this.css({ transition: `${prop} ${time}` }); }
}

// --- 1. ROOT ---
export class Root extends Component {
  constructor(targetId) {
    super("div");

    // Inject global reset only once
    if (!document.getElementById("archet-styles")) {
      const s = document.createElement("style");
      s.id = "archet-styles";
      s.textContent = `
        * { box-sizing: border-box; }
        button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid #005fcc; outline-offset: 2px;
        }
      `;
      document.head.appendChild(s);
    }

    this.css({
      width:"100%",
      height: "100vh",
      display:"flex", flexDirection:"column",
      overflow:"hidden"
    });
    if (globalThis.CSS?.supports?.("height", "100dvh")) this.css({ height: "100dvh" });

    const target = targetId ? document.getElementById(targetId) : document.body;

    if (target === document.body) {
      document.body.style.margin = "0";
      document.body.style.fontFamily = 'system-ui, sans-serif';
    }

    target.appendChild(this.dom);
  }
}

// --- 2. BOX ---
export class Box extends Component {
  constructor(w=100, h=100) {
    super("div");
    this.size(w, h).css({ display:"flex", flexDirection:"column", position:"relative" });
  }
}

// --- 3. ROW ---
export class Row extends Component {
  constructor(h=null) {
    super("div");
    this.size(100, h).css({ display:"flex", flexDirection:"row", alignItems:"center" });
  }
}

// --- 4. SPLIT ---
export class Split extends Component {
  constructor(...ratios) {
    super("div");
    this.size(100, 100).css({ display:"flex" });
    this.ratios = ratios; this.idx = 0;
  }

  add(...kids) {
    kids.forEach(k => {
      if (["string", "number", "boolean"].includes(typeof k)) k = new Text(k);

      if (!(k instanceof Component)) {
        if (k instanceof Node) {
          const wrapper = new Component("div").css({ display:"flex", flexDirection:"column" }).add(k);
          k = wrapper;
        } else if (k != null) {
          console.warn("Split: Dropped invalid child", k);
          return;
        }
      }

      const r = this.ratios[this.idx++] || 1;
      if (k instanceof Component) k.css({ flex: `${r} 1 0%` });
      super.add(k);
    });
    return this;
  }
}

// --- 5. GRID ---
export class Grid extends Component {
  constructor(cols=2, gapSize="10px") {
    super("div");
    this.css({ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:gapSize, width:"100%" });
  }
}

// --- 6. TEXT ---
export class Text extends Component {
  constructor(txt) {
    super("span");
    this.dom.textContent = String(txt);
    this.css({ display:"inline-block" });
  }
}

// --- 7. LINK ---
export class Link extends Component {
  constructor(lbl, href) {
    super("a");
    this.dom.textContent = lbl;
    this.attr("href", href);
    this.css({ color:"#005fcc", textDecoration:"underline", cursor:"pointer" });
    if (href && href.startsWith("http")) this.attr("target", "_blank").attr("rel", "noopener noreferrer");
  }
}

// --- 8. IMAGE ---
export class Image extends Component {
  constructor(src) {
    super("img");
    this.attr("src", src);
    this.css({ maxWidth:"100%", height:"auto", display:"block" });
  }
}

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
