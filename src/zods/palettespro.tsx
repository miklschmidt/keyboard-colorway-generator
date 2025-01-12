import { z } from 'zod';

export const HexSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

// Palettespro is not afraid to return negative angles, guess it makes the math easier.
// We normalize the hue to 0-360 to ensure it's a valid value.
const HSLSchema = z.object({
	h: z.number().transform((h) => ((h % 360) + 360) % 360), // Hue: normalized to 0-360
	s: z.number().min(0).max(100), // Saturation: 0-100
	l: z.number().min(0).max(100), // Lightness: 0-100
});

const ColorSchema = z.object({
	hsl: HSLSchema,
});

export const ColorHarmonyResponseSchema = z.object({
	analogous: z.array(ColorSchema).length(3),
	complementary: z.array(ColorSchema).length(2),
	splitComplementary: z.array(ColorSchema).length(3),
	triadic: z.array(ColorSchema).length(3),
	tetradic: z.array(ColorSchema).length(4),
	square: z.array(ColorSchema).length(4),
	monochromatic: z.array(ColorSchema).length(4),
});

export const ColorSchemeKeySchema = ColorHarmonyResponseSchema.keyof();

export const ColorHarmonyErrorSchema = z.object({
	error: z.string(),
});

export type ColorHarmonyResponse = z.infer<typeof ColorHarmonyResponseSchema>;
export type ColorHarmonyError = z.infer<typeof ColorHarmonyErrorSchema>;
export type HexColor = z.infer<typeof HexSchema>;
export type ColorScheme = z.infer<typeof ColorSchema>;
export type ColorSchemeKey = z.infer<typeof ColorSchemeKeySchema>;
