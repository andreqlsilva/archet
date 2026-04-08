import { Component } from './core.js';

// --- 4. SPLIT ---
export class Split extends Component {
  constructor(...ratios) {
    super("div");
    this.cls("archet-split");
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
    this.cls("archet-grid");
    this.css({ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:gapSize, width:"100%" });
  }
}
