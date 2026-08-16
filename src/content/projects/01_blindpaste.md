---
title: "BlindPaste"
blurb: "A zero-knowledge app for sharing encrypted Markdown text — the server never sees the content."
bullets:
  - text: "Zero-knowledge by design"
    sub:
      - "Content is encrypted in the browser with the Web Crypto API"
      - "The server only ever stores ciphertext"
  - text: "Decryption keys never leave the client"
    sub:
      - "The key lives in the URL fragment"
      - "Fragments are never sent in an HTTP request"
  - "Optional passphrase and burn-after-reading"
screenshot: "../../assets/blindpaste.png"
screenshotAlt: "Screenshot of the BlindPaste application"
year: "2026"
layout: "split"
tags: ["React", "PostgreSQL", "C#/.Net"]
repo: "https://github.com/gavin-meeker/blindpaste"
"url": "https://blindpaste.gavinmeeker.com"
order: 1
---
