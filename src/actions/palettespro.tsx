'use server';
import { logger } from '@/lib/logger';
import { ColorHarmonyResponseSchema, type HexColor } from '@/zods/palettespro';

export async function getColorScheme(color: HexColor) {
	'use cache';
	try {
		// palettespro.com has severe intermediate SSL issues, however we're not sending any sensitive data
		// and the API is not used for anything else than fetching color schemes, so HTTP is
		// fine for now.
		const response = await fetch(
			`https://palettespro.com/api/v1/color-harmony?color=${encodeURIComponent(color)}&formats=hsl`,
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch color schemes. Response status: ${response.statusText}`);
		}
		const data = await response.json();
		try {
			const result = ColorHarmonyResponseSchema.parse(data);
			return result;
		} catch (error) {
			logger.error('Invalid color scheme response', data, error);
			throw new Error('Invalid color scheme API response.');
		}
	} catch (error) {
		logger.error('Error fetching color scheme', error);
		throw new Error('Error fetching color scheme.');
	}
}
