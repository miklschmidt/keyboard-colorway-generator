'use client';
import { getForegroundColor, objMerge } from '@/lib/utils';
import { type layoutZod } from '@/zods/layouts';
import { type ColorScheme, type ColorSchemeKey } from '@/zods/palettespro';
import { type HslaColor } from '@uiw/color-convert';
import { proxy, ref } from 'valtio';
import { deepClone } from 'valtio/utils';
import { type z } from 'zod';

const fallbackColor = { h: 0, s: 0, l: 100, a: 1 };
const fallbackForegroundColor = { h: 0, s: 0, l: 0, a: 1 };

export const colorwayProxy = proxy({
	primary: ref(fallbackColor),
	primaryForeground: ref(fallbackForegroundColor),
	secondary: ref(fallbackColor),
	secondaryForeground: ref(fallbackForegroundColor),
	tertiary: ref(fallbackColor),
	tertiaryForeground: ref(fallbackForegroundColor),
	quaternary: ref(fallbackColor),
	quaternaryForeground: ref(fallbackForegroundColor),
});

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
	originalColor: ref(fallbackColor),
	colorway: colorwayProxy,
});

export const keyboardActions = {
	setKeyboardLayout: (layout: z.input<typeof layoutZod>) => {
		objMerge(keyboardState.layout, deepClone(layout));
	},
	setColorScheme: (colorScheme: ColorSchemeKey | null, colors: ColorScheme[]) => {
		keyboardState.colorScheme = colorScheme;
		if (colorScheme == null) {
			keyboardActions.setColorway({
				primary: deepClone(keyboardState.originalColor),
				secondary: deepClone(fallbackColor),
				tertiary: deepClone(fallbackColor),
				quaternary: deepClone(fallbackColor),
			});
		}
		keyboardActions.setColorway({
			primary: deepClone({ ...(colors[0]?.hsl ?? keyboardState.originalColor), a: 1 }),
			secondary: deepClone({ ...(colors[1]?.hsl ?? fallbackColor), a: 1 }),
			tertiary: deepClone({ ...(colors[2]?.hsl ?? fallbackColor), a: 1 }),
			quaternary: deepClone({ ...(colors[3]?.hsl ?? fallbackColor), a: 1 }),
		});
	},
	setColorway: (colorway: Partial<typeof keyboardState.colorway>) => {
		objMerge(keyboardState.colorway, deepClone(colorway));
	},
	setOriginalColor: (color: HslaColor) => {
		keyboardState.originalColor = deepClone(color);
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
