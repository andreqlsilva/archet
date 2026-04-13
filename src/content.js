import { Component } from './core.js';

// --- 6. TEXT ---
export class Text extends Component {
  constructor(txt) {
    super("span");
    this.cls("archet-text");
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
    this.css({ color:"var(--archet-link, #005fcc)", textDecoration:"underline", cursor:"pointer" });
    if (href && href.startsWith("http")) this.attr("target", "_blank").attr("rel", "noopener noreferrer");
  }
}

// --- 8. TABLE ---
export class Table extends Component {
  constructor(headers=[]) {
    super("table");
    this.cls("archet-table");
    this.css({ borderCollapse:"collapse", width:"100%", fontFamily:"inherit" });

    const thead = document.createElement("thead");
    const tr    = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      th.style.cssText = "text-align:left;padding:8px 10px;border-bottom:2px solid var(--archet-border,#ccc);";
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    this.dom.appendChild(thead);

    this._tbody = document.createElement("tbody");
    this.dom.appendChild(this._tbody);
  }

  addRow(cells=[]) {
    const tr = document.createElement("tr");
    cells.forEach(c => {
      const td = document.createElement("td");
      td.textContent = String(c);
      td.style.cssText = "padding:8px 10px;border-bottom:1px solid var(--archet-border,#eee);";
      tr.appendChild(td);
    });
    this._tbody.appendChild(tr);
    return this;
  }

  clear() {
    this._tbody.innerHTML = "";
    return this;
  }
}

// --- 9. IMAGE ---
export class Image extends Component {
  constructor(src) {
    super("img");
    this.attr("src", src);
    this.css({ maxWidth:"100%", height:"auto", display:"block" });
  }
}
