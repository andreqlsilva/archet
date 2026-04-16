// --- THEME SYSTEM ---
(function() {
  if (!document.documentElement.dataset.theme) {
    document.documentElement.dataset.theme = "light";
  }
  if (document.getElementById("archet-theme-vars")) return;
  const s = document.createElement("style");
  s.id = "archet-theme-vars";
  s.textContent = `
    :root {
      --archet-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    :root[data-theme="light"] {
      --archet-bg:         #cccccc;
      --archet-fg:         #1a1a1a;
      --archet-border:     #aaaaaa;
      --archet-surface:    #bfbfbf;
      --archet-surface-alt:#c5c5c5;
      --archet-link:       #005fcc;
      --archet-focus:      #007bff;
      --archet-focus-ring: rgba(0,123,255,0.25);
      --archet-muted:      #888888;
    }
    :root[data-theme="dark"] {
      --archet-bg:         #1e1e1e;
      --archet-fg:         #e0e0e0;
      --archet-border:     #444444;
      --archet-surface:    #2d2d2d;
      --archet-surface-alt:#252525;
      --archet-link:       #4da6ff;
      --archet-focus:      #4da6ff;
      --archet-focus-ring: rgba(77,166,255,0.25);
      --archet-muted:      #999999;
    }
    html[data-theme], html[data-theme] body {
      background-color: var(--archet-bg);
      color: var(--archet-fg);
    }
  `;
  document.head.appendChild(s);
}());

export function setTheme(name) {
  document.documentElement.dataset.theme = name;
}
