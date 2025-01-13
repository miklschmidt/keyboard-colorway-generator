import { env } from '@/env';
import { readdir, readFile } from 'fs/promises';
import { z } from 'zod';
import { deserialize } from '@kcf-hub/kle-serial';
import { layoutIdZod, layoutZod } from '@/zods/layouts';
import { logger } from '@/lib/logger';
import path from 'path';

export const readLayout = async (layoutId: z.infer<typeof layoutIdZod>): Promise<string> => {
	try {
		const layoutsPath = env.KEYBOARD_LAYOUTS_PATH ?? path.join(process.cwd(), 'public', 'data', 'keyboard-layouts');
		const name = layoutIdZod.parse(layoutId);
		const data = await readFile(`${layoutsPath}/${name}.json`);
		return data.toString();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		if (error instanceof z.ZodError) {
			throw `Invalid layout id: ${error.formErrors.formErrors.join(', ')}`;
		}
		throw `No layout found with the id ${layoutId}`;
	}
};

export const getLayouts = async (): Promise<z.infer<typeof layoutZod>[]> => {
	try {
		const layoutsPath = env.KEYBOARD_LAYOUTS_PATH ?? path.join(process.cwd(), 'public', 'data', 'keyboard-layouts');
		const layouts = await readdir(layoutsPath);
		const jsonLayouts = await Promise.all(
			layouts
				.filter((file) => file.endsWith('.json'))
				.map(async (file) => {
					const id = file.replace('.json', '');
					const layoutData = await readLayout(id);
					const layout = deserialize(JSON.parse(layoutData));
					return layoutZod.parse({
						id,
						name: layout.meta.name,
						notes: layout.meta.notes,
					});
				}),
		);
		return jsonLayouts;
	} catch (error) {
		logger.error(error, { __dirname, cwd: process.cwd });
		throw new Error('Failed to read layout directory.');
	}
};
