import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const projects = defineCollection({
	// Load Markdown in `src/content/projects/`. The body is optional — the page
	// renders from frontmatter alone, so a project can be a single blurb.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// The blurb shown on the index. Keep it to a sentence or two.
			blurb: z.string(),
			screenshot: image(),
			// Alt text for the screenshot — required, since these carry meaning.
			screenshotAlt: z.string(),
			year: z.string(),
			// Short tech/role tags rendered under the blurb.
			tags: z.array(z.string()).default([]),
			// Optional outbound links.
			url: z.string().url().optional(),
			repo: z.string().url().optional(),
			// Lower numbers sort first. Ties fall back to reverse-chronological.
			order: z.number().default(0),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog, projects };
