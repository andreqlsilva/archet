import { Component } from './core.js';

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
