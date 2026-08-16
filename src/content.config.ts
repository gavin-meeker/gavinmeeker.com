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

/**
 * A slide bullet. Accepts either a bare string or an object with nested
 * sub-bullets, and normalises both to the same shape so rendering is uniform:
 *
 *   bullets:
 *     - Encrypted entirely in the browser
 *     - text: Keys never reach the server
 *       sub:
 *         - Stored in the URL fragment
 *         - Never sent in a request
 */
const bullet = z.union([
	z.string().transform((text) => ({ text, sub: [] as string[] })),
	z.object({
		text: z.string(),
		sub: z.array(z.string()).default([]),
	}),
]);

const projects = defineCollection({
	// Load Markdown in `src/content/projects/`. The body is optional — the page
	// renders from frontmatter alone, so a project can be a single blurb.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// One or two sentences. Used on the homepage table, in link previews,
			// and as the slide's lead line when no bullets are given.
			blurb: z.string(),
			// Optional slide bullets. When present these replace the single
			// blurb bullet on the slide; the blurb is still used elsewhere.
			bullets: z.array(bullet).default([]),
			// Optional: the `statement` layout is text-only.
			screenshot: z.optional(image()),
			// Alt text for the screenshot. Enforced below whenever one is set —
			// screenshots carry meaning, and an optional field is one people skip.
			screenshotAlt: z.optional(z.string()),
			/**
			 * Slide layout:
			 *   split         text left, screenshot right (default)
			 *   split-reverse screenshot left, text right
			 *   showcase      screenshot dominant, text as a caption strip
			 *   statement     no screenshot; the blurb set large
			 */
			layout: z
				.enum(['split', 'split-reverse', 'showcase', 'statement'])
				.default('split'),
			year: z.string(),
			// Short tech/role tags rendered under the blurb.
			tags: z.array(z.string()).default([]),
			// Optional outbound links.
			url: z.string().url().optional(),
			repo: z.string().url().optional(),
			// Lower numbers sort first. Ties fall back to reverse-chronological.
			order: z.number().default(0),
			draft: z.boolean().default(false),
		})
		.refine((d) => !d.screenshot || (d.screenshotAlt ?? '').trim().length > 0, {
			message: 'screenshotAlt is required when a screenshot is set',
			path: ['screenshotAlt'],
		}),
});

export const collections = { blog, projects };
