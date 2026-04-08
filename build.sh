#!/bin/bash
set -e

strip() {
  grep -v '^import' "$1"
}

{
  strip src/core.js
  strip src/layout.js
  strip src/content.js
  strip src/form.js
  strip src/composite.js
} > archet.js

echo "Built archet.js"
