// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://gavinmeeker.com",
  integrations: [mdx(), sitemap(), react()],

  fonts: [
    {
      // UI face: ribbon, cells, headings, chrome.
      provider: fontProviders.google(),
      name: "Schibsted Grotesk",
      cssVariable: "--font-schibsted",
      weights: [400, 500, 600, 700],
      subsets: ["latin"],
    },
    {
      // Cell values, formula bar, row/column headers, status bar.
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: [400, 500],
      subsets: ["latin"],
    },
    {
      // Body face for Word documents (blog posts, about).
      provider: fontProviders.google(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
