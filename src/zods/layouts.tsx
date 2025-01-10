import { z } from 'zod';

// Sanitize layout name to prevent directory traversal
export const layoutIdZod = z.string().regex(/^[a-zA-Z0-9_-]+$/);

export const layoutZod = z.object({
	id: z.string(),
	name: z.string(),
	notes: z.string(),
});
