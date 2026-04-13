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
  bd(w=1, c="var(--archet-border)", s="solid") { return this.css({ border: `${w}px ${s} ${c}` }); }
  nobd() { return this.css({ border: "none" }); }
  round(px=4) { return this.css({ borderRadius: `${px}px` }); }
  pad(px) { return this.css({ padding: `${px}px` }); }
  gap(px) { return this.css({ gap: `${px}px` }); }

  animate(prop="all", time="0.2s") { return this.css({ transition: `${prop} ${time}` }); }
}

// --- THEME INJECTION ---
(function() {
  if (typeof document === "undefined") return;
  if (document.getElementById("archet-theme")) return;
  const s = document.createElement("style");
  s.id = "archet-theme";
  s.textContent = `
    .archet-button { transition: filter 0.15s, transform 0.1s; }
    .archet-button:hover { filter: brightness(0.9); }
    .archet-button:active { transform: translateY(1px); }
    .archet-input input:focus,
    .archet-input textarea:focus,
    .archet-select:focus { border-color: var(--archet-focus, #007bff) !important; box-shadow: 0 0 0 3px var(--archet-focus-ring, rgba(0,123,255,0.25)); }
    .archet-button.feedback-success { background: #28a745 !important; color: #fff !important; border-color: #28a745 !important; }
    .archet-button.feedback-error   { background: #dc3545 !important; color: #fff !important; border-color: #dc3545 !important; }
  `;
  document.head.appendChild(s);
})();

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
          outline: 2px solid var(--archet-focus, #005fcc); outline-offset: 2px;
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
    this.cls("archet-box");
    this.size(w, h).css({ display:"flex", flexDirection:"column", position:"relative" });
  }
}

// --- 3. ROW ---
export class Row extends Component {
  constructor(h=null) {
    super("div");
    this.cls("archet-row");
    this.size(100, h).css({ display:"flex", flexDirection:"row", alignItems:"center" });
  }
}
