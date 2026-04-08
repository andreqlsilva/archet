/* archet test harness */
/* Expects the host HTML to provide: #report, #stage, #scratch */

let _group   = null;
let _before  = null;
const _queue = [];

export function describe(name, fn) {
  const prevGroup  = _group;
  const prevBefore = _before;
  _group  = name;
  _before = null;
  fn();
  _group  = prevGroup;
  _before = prevBefore;
}

export function beforeEach(fn) { _before = fn; }

export function test(name, fn) {
  _queue.push({ name, fn, group: _group, before: _before });
}

// --- EXPECT ---

function fmt(v) {
  if (v instanceof Element) {
    let s = `<${v.tagName.toLowerCase()}`;
    if (v.id) s += `#${v.id}`;
    if (v.className) s += `.${v.className.replace(/\s+/g, ".")}`;
    return s + ">";
  }
  if (typeof v === "object" && v !== null) {
    try { return JSON.stringify(v); } catch { return Object.prototype.toString.call(v); }
  }
  return String(v);
}

function normalizeColor(hex, prop) {
  const d = document.createElement("div");
  d.style[prop] = hex;
  document.getElementById("scratch").appendChild(d);
  const rgb = getComputedStyle(d)[prop];
  d.remove();
  return rgb;
}

export const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected)
      throw new Error(`Expected ${fmt(expected)}, got ${fmt(actual)}`);
  },
  toBeTruthy: () => {
    if (!actual)
      throw new Error(`Expected truthy, got ${fmt(actual)}`);
  },
  toMatch: (regex) => {
    if (!(regex instanceof RegExp)) throw new Error("toMatch() expects a RegExp");
    if (!regex.test(String(actual)))
      throw new Error(`Expected "${actual}" to match ${regex}`);
  },
  toThrow: (fragment) => {
    if (typeof actual !== "function") throw new Error("toThrow() expects a function");
    try { actual(); }
    catch (e) {
      if (!e.message.includes(fragment))
        throw new Error(`Expected error containing "${fragment}", got "${e.message}"`);
      return;
    }
    throw new Error(`Expected function to throw "${fragment}", but it succeeded`);
  },
  toHaveBg: (hex) => {
    const expected = normalizeColor(hex, "backgroundColor");
    const actual_  = getComputedStyle(actual).backgroundColor;
    if (actual_ !== expected)
      throw new Error(`Expected BG ${expected} (${hex}), got ${actual_}`);
  },
  toHaveFg: (hex) => {
    const expected = normalizeColor(hex, "color");
    const actual_  = getComputedStyle(actual).color;
    if (actual_ !== expected)
      throw new Error(`Expected FG ${expected} (${hex}), got ${actual_}`);
  },
});

// --- RUNNER ---

function log(name, success, err) {
  const report = document.getElementById("report");
  const div = document.createElement("div");
  div.className = success ? "pass" : "fail";
  if (success) {
    div.textContent = `✔ ${name}`;
  } else {
    div.appendChild(document.createTextNode(`✘ ${name}`));
    const trace = document.createElement("div");
    trace.className = "error-trace";
    trace.textContent = `${err.message}\n${err.stack}`;
    div.appendChild(trace);
  }
  report.appendChild(div);
}

export async function runTests() {
  const report  = document.getElementById("report");
  let passed    = 0;
  let lastGroup = null;

  for (const t of _queue) {
    // Group header
    if (t.group !== lastGroup) {
      lastGroup = t.group;
      if (t.group) {
        const h = document.createElement("div");
        h.className = "group";
        h.textContent = t.group;
        report.appendChild(h);
      }
    }

    // Reset stage before every test
    document.getElementById("stage").innerHTML   = "";
    document.getElementById("scratch").innerHTML = "";

    if (t.before) t.before();

    try {
      await t.fn();
      log(t.name, true);
      passed++;
    } catch (e) {
      console.error(e);
      log(t.name, false, e);
    }
  }

  // Summary — Playwright reads data-passed / data-total
  const summary = document.createElement("div");
  summary.id = "summary";
  summary.dataset.passed = passed;
  summary.dataset.total  = _queue.length;
  summary.innerHTML = `<h3>${passed}/${_queue.length} passed</h3>`;
  report.appendChild(summary);
}
