# Archet

**A dead-simple UI library for suckless web development.**

Zero dependencies. Zero build steps. 100% Native DOM and vanilla Javascript.

UI isn't that interesting, go back to solving actual problems and ship this to interact with normies.

## Can web development be truly suckless?

No, not "truly". But it can suck less than the mainstream suckful alternatives.

## Principles

* **Obvious components:** Clean, readable, *archet*ypal, obviously useful components that don't break or lag.
* **No dependencies:** Don't naively depend on thousands of maintainers' hopes and dreams. And if I die, this is simple enough that you can easily maintain this yourself.
* **Relative sizing:** A component's width and height are just percentages of the container's. Plus sensible margins and padding.
* **API first:** There is no form submission, no server-side rendering, no magic. Components read and write plain values. Your button callback calls `fetch`. Your backend is just a JSON API.

## Installation

Add a script tag pointing to [https://archet.ink/archet.js](https://archet.ink/archet.js).

## Usage

Mount the app to the page with `Root`, then build your UI from components:

```js
const root  = new Root();
const name  = new Input("Your name", 1, "Name");
const email = new Input("Your email", 1, "Email");

const save = new Button("Save", async () => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.val, email: email.val }),
  });
  if (res.ok) save.flashSuccess();
  else        save.flashError();
});

root.add(
  new Box().pad(20).gap(12)
    .add(name, email, save)
);
```

Form data lives in `input.val`. You read it when you need it, send it where you want, handle the response yourself. That's the whole model.

## Components

| Component | Description |
|---|---|
| `Root` | Mounts the app to the page |
| `Box` | Flex column container |
| `Row` | Flex row container |
| `Split` | Two-pane flex layout with configurable ratios |
| `Grid` | CSS grid container |
| `Text` | Inline text node |
| `Link` | Anchor element |
| `Image` | Image element |
| `Button` | Clickable button with optional callback and flash feedback |
| `Input` | Text, number, date, or multiline input with optional label |
| `Checkbox` | Boolean checkbox input |
| `Select` | Dropdown with dynamic option management |
| `FilePicker` | File input, `.json` by default |
| `Pager` | Side-nav layout that switches between pages |
| `Tabber` | Tab strip layout that switches between panels |
| `NavPager` | Dynamic pager where pages can be added and deleted |
| `Deck` | Stacked panel switcher |
| `Crud` | Ready-made list with add/delete and field validation |
| `Toast` | Temporary success/error notification banners |
| `Modal` | Overlay dialog with title and close button |
| `Spinner` | Animated loading indicator |
| `Accordion` | Collapsible labeled panels |
| `Checklist` | To-do list with add, check, and delete |
| `Form` | Named field group with `values()`, `clear()`, and `remove()` |
| `Table` | Simple table with typed headers and row data |

## Theming

Archet ships with light and dark themes. The light theme is the default.

```js
setTheme("dark");   // switch to dark
setTheme("light");  // switch back
```

Themes are implemented as CSS custom properties on `[data-theme]`:

| Variable | Light | Dark |
|---|---|---|
| `--archet-bg` | `#ffffff` | `#1e1e1e` |
| `--archet-fg` | `#1a1a1a` | `#e0e0e0` |
| `--archet-border` | `#cccccc` | `#444444` |
| `--archet-surface` | `#f0f0f0` | `#2d2d2d` |
| `--archet-link` | `#005fcc` | `#4da6ff` |
| `--archet-focus` | `#007bff` | `#4da6ff` |

You can override any variable on `:root` or a specific element to customise the palette.
