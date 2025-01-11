'use client';
import { getForegroundColor, objMerge } from '@/lib/utils';
import { type layoutZod } from '@/zods/layouts';
import { type ColorScheme, type ColorSchemeKey } from '@/zods/palettespro';
import { type HslaColor } from '@uiw/color-convert';
import { proxy } from 'valtio';
import { type z } from 'zod';

const fallbackColor = { h: 0, s: 0, l: 100, a: 1 };
const fallbackForegroundColor = { h: 0, s: 0, l: 0, a: 1 };

export const keyboardState = proxy<{
	layout: z.output<typeof layoutZod>;
	settings: {
		animateKeycaps: boolean;
	};
	colorScheme: ColorSchemeKey | null;
	originalColor: HslaColor;
	colorway: {
		primary: HslaColor;
		primaryForeground: HslaColor;
		secondary: HslaColor;
		secondaryForeground: HslaColor;
		tertiary: HslaColor;
		tertiaryForeground: HslaColor;
		quaternary: HslaColor;
		quaternaryForeground: HslaColor;
	};
}>({
	layout: {
		id: 'alice',
		name: 'TGR Alice',
		notes: 'The original TGR Alice layout',
	},
	settings: {
		animateKeycaps: true,
	},
	colorScheme: null,
	originalColor: fallbackColor,
	colorway: {
		primary: fallbackColor,
		primaryForeground: fallbackForegroundColor,
		secondary: fallbackColor,
		secondaryForeground: fallbackForegroundColor,
		tertiary: fallbackColor,
		tertiaryForeground: fallbackForegroundColor,
		quaternary: fallbackColor,
		quaternaryForeground: fallbackForegroundColor,
	},
});

export const keyboardActions = {
	setKeyboardLayout: (layout: z.input<typeof layoutZod>) => {
		objMerge(keyboardState.layout, layout);
	},
	setColorScheme: (colorScheme: ColorSchemeKey | null, colors: ColorScheme[]) => {
		keyboardState.colorScheme = colorScheme;
		if (colorScheme == null) {
			keyboardActions.setColorway({
				primary: keyboardState.originalColor,
				secondary: fallbackColor,
				tertiary: fallbackColor,
				quaternary: fallbackColor,
			});
		}
		keyboardActions.setColorway({
			primary: { ...(colors[0]?.hsl ?? keyboardState.originalColor), a: 1 },
			secondary: { ...(colors[1]?.hsl ?? fallbackColor), a: 1 },
			tertiary: { ...(colors[2]?.hsl ?? fallbackColor), a: 1 },
			quaternary: { ...(colors[3]?.hsl ?? fallbackColor), a: 1 },
		});
	},
	setColorway: (colorway: Partial<typeof keyboardState.colorway>) => {
		objMerge(keyboardState.colorway, colorway);
	},
	setOriginalColor: (color: HslaColor) => {
		objMerge(keyboardState.originalColor, color);
	},
	computeForegroundColors: () => {
		const primaryForeground = getForegroundColor(keyboardState.colorway.primary);
		const secondaryForeground = getForegroundColor(keyboardState.colorway.secondary);
		const tertiaryForeground = getForegroundColor(keyboardState.colorway.tertiary);
		const quaternaryForeground = getForegroundColor(keyboardState.colorway.quaternary);
		objMerge(keyboardState.colorway, {
			primaryForeground: { ...primaryForeground, a: 1 },
			secondaryForeground: { ...secondaryForeground, a: 1 },
			tertiaryForeground: { ...tertiaryForeground, a: 1 },
			quaternaryForeground: { ...quaternaryForeground, a: 1 },
		});
	},
};
