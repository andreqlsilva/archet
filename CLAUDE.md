# Archet

A dead-simple UI library for suckless web development.
Zero runtime dependencies. 100% native DOM and vanilla JavaScript.

## Principles

- **Obvious components:** Clean, readable, archetypally useful. No magic.
- **No runtime dependencies:** If it needs npm to run, it doesn't belong here.
- **Relative sizing:** Width and height are percentages of the container.
- **One build step:** `build.sh` concatenates source files into `archet.js`.
- **Full-stack components:** Each backend-capable component ships with its
  paired shell script in `scripts/`. The scripts folder is the whitelist.

## Architecture

- Components are orchestrators. State lives in the parent, not shared between
  siblings. If two components need to run together, wrap them in a bigger one.
- Behaviour is injected via strategies (how) and policies (whether). Prefer
  functions over classes for both.
- The factory pattern is not used. `new Component()` is explicit and clear.

## File Structure

    src/
      core.js         Component, Root, Box, Row
      layout.js       Split, Grid
      content.js      Text, Link, Image
      form.js         Button, Input, Checkbox, Select
      composite.js    Deck, Crud
    scripts/          Shell scripts paired with backend-capable components
    test/
      harness.js      Shared vanilla test harness
      *.test.html     Per-component test pages, served and run via Playwright
    archet.js         Built output — do not edit directly
    build.sh          Concatenates src/ into archet.js
    server.ts         Deno dev server (deno run --allow-net --allow-read
                        --allow-run=bash server.ts)
    index.html        Live demo
    CLAUDE.md
    README.md

## Coding Rules

- Imports in `src/` files must always be single-line:
  `import { Component } from './core.js';` — never multi-line.
  `build.sh` strips imports with `grep -v '^import'`; multi-line imports
  would leave broken syntax in the built output.

## TDD Workflow

1. Write a failing test in the relevant `*.test.html` first
2. Run `bash build.sh && deno run --allow-all run_tests.ts` — confirm it's red
3. Implement the feature in `src/`
4. Run `bash build.sh && deno run --allow-all run_tests.ts` — confirm it's green
5. Only commit when all tests are green

Never implement before the test exists.
Never commit a failing test.
