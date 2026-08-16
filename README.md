# gavinmeeker.com

The source for [gavinmeeker.com](https://gavinmeeker.com) — Gavin Meeker's
personal site: a homepage, a project portfolio, and a blog.

Built with [Astro](https://astro.build), styled with Tailwind CSS v4, and
deployed to Cloudflare Workers as a fully static site. It ships **no JavaScript
to the browser**.

## The design

The site is dressed as an office suite. Each kind of content is presented in
whichever application it most resembles:

| Route             | Application    | Accent | Why                                      |
| ----------------- | -------------- | ------ | ---------------------------------------- |
| `/`               | **Excel**      | green  | The homepage is tabular data             |
| `/blog`           | **Excel**      | green  | A list of posts is a sheet               |
| `/projects`       | **PowerPoint** | orange | Projects are slides                      |
| `/blog/[slug]`    | **Word**       | blue   | Long-form writing is a document          |
| `/about`          | **Word**       | blue   | Same                                     |

Navigation lives in the sheet tabs along the bottom of the window, where a
spreadsheet keeps them.

### The one design rule

**Nothing should look interactive unless it is.**

An earlier version reproduced Excel's full ribbon — Paste, B/I/U, font
dropdowns, Sort & Filter. It looked convincing and was wrong: roughly twenty
controls with borders and hover states that did nothing, while the things that
actually navigate were styled more quietly. The ribbon was removed entirely.

What remains is either real navigation or a genuine spreadsheet cue: the grid,
the `A`/`B`/`C` and row headers, the selection outline and fill handle, cell
references, `=CONCAT(...)` and `=HYPERLINK(...)` formulas, and the sheet tabs.
Cover the ribbon in a screenshot of the old version and the page was still
obviously a spreadsheet — which is what made it removable.

The colour system encodes destination: an orange row opens PowerPoint, a blue
row opens Word. Both are learnable in two clicks, so new accents are not
invented for anything else.

## Slide layouts

Projects render as PowerPoint slides. Each project picks its arrangement with a
`layout` field in its frontmatter, the way a real deck applies a slide layout.

| `layout`        | Arrangement                                        | Best for                                        |
| --------------- | -------------------------------------------------- | ----------------------------------------------- |
| `split`         | Text left, screenshot right *(default)*            | Most projects                                   |
| `split-reverse` | Screenshot left, text right                        | Breaking up rhythm across consecutive slides    |
| `showcase`      | Screenshot dominant, text as a caption strip above | Detailed UI where small text needs full width   |
| `statement`     | No screenshot; the blurb set large                 | Projects with nothing worth showing visually    |

All layouts live in `src/components/office/Slide.astro`. Adding a fifth means
editing that one file and adding one value to the enum in
`src/content.config.ts`.

Screenshots always use `object-contain`, never `object-cover` — a UI screenshot
cropped to fill a box loses the thing it exists to show.

## Adding content

### A project

Create `src/content/projects/<slug>.md`. The body is optional; the slide renders
from frontmatter alone.

```yaml
---
title: 'BlindPaste'
blurb: 'A zero-knowledge app for sharing encrypted Markdown text.'
bullets:
  - text: 'Zero-knowledge by design'
    sub:
      - 'Content is encrypted in the browser with the Web Crypto API'
  - 'Optional passphrase and burn-after-reading'
screenshot: '../../assets/blindpaste.png'
screenshotAlt: 'The BlindPaste editor with a Markdown preview'
layout: 'showcase'
year: '2026'
tags: ['React', 'PostgreSQL', 'C#/.Net']
url: 'https://blindpaste.example'
repo: 'https://github.com/gavin-meeker/blindpaste'
order: 1
draft: false
---
```

`blurb` and `bullets` do different jobs. `blurb` is the one-line summary shown
in the Description column of the homepage table, and it is the slide's single
bullet when no `bullets` are authored. `bullets` are slide-only, and replace
that fallback when present. Bullets accept either a bare string or an object
with nested `sub` entries:

```yaml
bullets:
  - Optional passphrase and burn-after-reading
  - text: Zero-knowledge by design
    sub:
      - Content is encrypted in the browser with the Web Crypto API
      - The server only ever stores ciphertext
```

`screenshot` is optional (for `statement`), but `screenshotAlt` is **required
whenever a screenshot is set** — enforced by a schema rule, so an unlabelled
image fails the build rather than shipping.

`url` and `repo` are validated as URLs, so a typo fails the build too.

### A blog post

Create `src/content/blog/<slug>.md` or `.mdx`:

```yaml
---
title: 'Post title'
description: 'One or two sentences. Shown on the blog index and in link previews.'
pubDate: 'Jun 01 2026'
heroImage: '../../assets/some-image.jpg' # optional
---
```

## Project structure

```text
src/
├── assets/                  Images; optimised at build time by Astro
├── components/
│   ├── office/              The Office chrome
│   │   ├── AppWindow.astro    Title bar, sub-bar slot, status bar
│   │   ├── Sheet.astro        Spreadsheet grid, headers, row gutter
│   │   ├── Slide.astro        Project slides and their layouts
│   │   ├── StatusBar.astro    Sheet tabs — the site's navigation
│   │   └── Icon.astro         Inline SVG icons
│   ├── BaseHead.astro       Meta tags, fonts, Open Graph
│   └── FormattedDate.astro
├── content/
│   ├── blog/                Posts
│   └── projects/            Projects
├── layouts/
│   └── BlogPost.astro       The Word document view
├── pages/
└── styles/
    └── global.css           Design tokens — the single source of truth
```

### Design tokens

Everything visual is defined in the `@theme` block of `src/styles/global.css`.
Tailwind generates matching utilities, so `--color-ink` yields `text-ink`,
`bg-ink`, and `border-ink`.

`--color-app` is the current application's accent. The `.app-excel`,
`.app-word`, and `.app-powerpoint` classes reassign it, which is how a whole
page — or a single table header — is retinted with one class.

## Commands

| Command             | Action                                     |
| ------------------- | ------------------------------------------ |
| `npm install`       | Install dependencies                       |
| `npm run dev`       | Dev server at `localhost:4321`             |
| `npm run build`     | Build the static site to `./dist/`         |
| `npm run preview`   | Preview the build locally                  |

## Deployment

Pushes to `main` build and deploy to Cloudflare Workers via GitHub Actions.

- **`.github/workflows/deploy.yml`** — builds, then deploys. Pull requests build
  but never deploy. Manual runs are available via **Run workflow**, and
  selecting a tag there deploys that tag, which is how rollback works.
- **`.github/workflows/tag.yml`** — tags every merge to `main` as
  `yyyymmddhhmmss_branch_sha`, giving a stable ref to redeploy or roll back to.

`wrangler.jsonc` configures the deploy. It has no `main` field: the site is
static, so Cloudflare serves `./dist` from the edge and no Worker code runs.
An adapter would only be needed for on-demand rendering.

Two repository secrets are required: `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`.

Note that tags pushed by `tag.yml` use the built-in `GITHUB_TOKEN`, and GitHub
does not let that trigger other workflows — so `on: push: tags:` would never
fire. Deploying a tag is a deliberate manual action.

## Notes

`IDEAS.md` holds parked ideas — live cell selection, working ribbon controls, a
print stylesheet, a `#REF!` 404 page — with the reasoning for why each was
deferred.
