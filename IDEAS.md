# Ideas — parked for later

Running list of things we decided not to build yet. Nothing here is committed.

## Live cell selection (Excel pages)

A React island that makes the spreadsheet chrome behave like a real sheet.

- Click any cell to select it — accent outline plus the fill handle on the corner.
- The **name box** updates to the cell's reference (`C7`).
- The **formula bar** shows that cell's contents.
- Arrow keys move the selection; `Enter` on a cell containing a link navigates.

Roughly ~15 KB of JS, and only on pages that use it. This would be the first real
use of the `@astrojs/react` integration, which is currently installed but unused.

**Why it's worth doing:** it's the difference between a spreadsheet *skin* and
something that feels alive. The chrome currently promises interactivity it
doesn't deliver, and a visitor's first instinct will be to click a cell.

**Why we deferred:** the site ships 0 KB of JS today, and the static version
needed to exist first regardless.

## Working ribbon controls

Building on the above — a few ribbon buttons that actually do something:

- **Bold / Italic** restyle the selected cell.
- **Zoom** control resizes the grid.
- **Freeze Panes** pins the header row while the sheet scrolls.

Most delightful, but the most surface area to build and maintain. Only worth it
once live cell selection exists.

## Other threads

- **Blog index as a file browser** — an "Open Recent" screen listing posts as
  `.docx` files with modified dates, instead of the current sheet listing.
- **A real `File` menu** — clicking `File` opens a backstage view (About, Contact,
  RSS, "Export as PDF" linking to a print stylesheet).
- **Print stylesheet** — the Office metaphor makes `Ctrl+P` an obvious joke to
  honor: posts should print as genuinely clean documents.
- **Dark mode** — deliberately skipped during the Tailwind migration. Every color
  routes through `@theme` tokens, so it's a matter of adding dark values under
  `prefers-color-scheme`, not a rewrite.
- **404 page** — currently Cloudflare's default. Would want to be `#REF!` or
  `#NAME?` in the Excel chrome, with `not_found_handling: "404-page"` set in
  `wrangler.jsonc`.
