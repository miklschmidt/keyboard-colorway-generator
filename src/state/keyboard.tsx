'use client';
import { type ColorWayModes } from '@/components/forms/colorway-mode-selector';
import { getForegroundColor, objMerge } from '@/lib/utils';
import { type layoutZod } from '@/zods/layouts';
import { type ColorScheme, type ColorSchemeKey } from '@/zods/palettespro';
import { type HslaColor } from '@uiw/color-convert';
import { proxy } from 'valtio';
import { deepClone } from 'valtio/utils';
import { type z } from 'zod';

const fallbackColor = { h: 0, s: 0, l: 100, a: 1 };
const fallbackForegroundColor = { h: 0, s: 0, l: 0, a: 1 };

type KeyboardState = {
	layout: z.output<typeof layoutZod>;
	settings: {
		animateKeycaps: boolean;
		mirrorInput: boolean;
	};
	colorScheme: ColorSchemeKey | null;
	colorSchemeColorCount: number;
	backgroundColor: HslaColor;
	originalColor: HslaColor;
	colors: {
		primary: HslaColor;
		primaryForeground: HslaColor;
		secondary: HslaColor;
		secondaryForeground: HslaColor;
		tertiary: HslaColor;
		tertiaryForeground: HslaColor;
		quaternary: HslaColor;
		quaternaryForeground: HslaColor;
	};
	colorwayMode: ColorWayModes;
	colorway: {
		alphas: HslaColor;
		alphasForeground: HslaColor;
		numbers: HslaColor;
		numbersForeground: HslaColor;
		modifiers: HslaColor;
		modifiersForeground: HslaColor;
		spacebar: HslaColor;
		spacebarForeground: HslaColor;
		special: HslaColor;
		specialForeground: HslaColor;
	};
};

export const colorsProxy = proxy<KeyboardState['colors']>({
	primary: deepClone(fallbackColor),
	primaryForeground: deepClone(fallbackForegroundColor),
	secondary: deepClone(fallbackColor),
	secondaryForeground: deepClone(fallbackForegroundColor),
	tertiary: deepClone(fallbackColor),
	tertiaryForeground: deepClone(fallbackForegroundColor),
	quaternary: deepClone(fallbackColor),
	quaternaryForeground: deepClone(fallbackForegroundColor),
});

export const colorwayProxy = proxy<KeyboardState['colorway']>({
	alphas: colorsProxy.primary,
	alphasForeground: colorsProxy.primaryForeground,
	numbers: colorsProxy.secondary,
	numbersForeground: colorsProxy.secondaryForeground,
	modifiers: colorsProxy.tertiary,
	modifiersForeground: colorsProxy.tertiaryForeground,
	spacebar: colorsProxy.quaternary,
	spacebarForeground: colorsProxy.quaternaryForeground,
	special: colorsProxy.tertiary,
	specialForeground: colorsProxy.tertiaryForeground,
});

export const keyboardState = proxy<KeyboardState>({
	layout: {
		id: 'alice',
		name: 'TGR Alice',
		notes: 'The original TGR Alice layout',
	},
	settings: {
		animateKeycaps: true,
		mirrorInput: true,
	},
	backgroundColor: deepClone(fallbackForegroundColor),
	colorScheme: 'monochromatic',
	colorSchemeColorCount: 4,
	originalColor: deepClone(fallbackColor),
	colors: colorsProxy,
	colorway: colorwayProxy,
	colorwayMode: 'mods_alphas',
});

export const keyboardActions = {
	setKeyboardLayout: (layout: z.input<typeof layoutZod>) => {
		objMerge(keyboardState.layout, deepClone(layout));
	},
	setColorScheme: (colorScheme: ColorSchemeKey | null, colors: ColorScheme[]) => {
		keyboardState.colorScheme = colorScheme;
		keyboardState.colorSchemeColorCount = colors.length;
		if (colorScheme == null) {
			keyboardActions.setColors({
				primary: deepClone(keyboardState.originalColor),
				secondary: deepClone(fallbackColor),
				tertiary: deepClone(fallbackColor),
				quaternary: deepClone(fallbackColor),
			});
		}
		keyboardActions.setColors({
			primary: deepClone({ ...(colors[0]?.hsl ?? keyboardState.originalColor), a: 1 }),
			secondary: deepClone({ ...(colors[1]?.hsl ?? keyboardState.originalColor), a: 1 }),
			tertiary: deepClone({ ...(colors[2]?.hsl ?? keyboardState.originalColor), a: 1 }),
			quaternary: deepClone({ ...(colors[3]?.hsl ?? keyboardState.originalColor), a: 1 }),
		});
	},
	setColors: (colors: Partial<typeof keyboardState.colors>) => {
		if (colors.primary != null) {
			keyboardState.colors.primary = objMerge(keyboardState.colors.primary, colors.primary);
		}
		if (colors.secondary != null) {
			keyboardState.colors.secondary = objMerge(keyboardState.colors.secondary, colors.secondary);
		}
		if (colors.tertiary != null) {
			keyboardState.colors.tertiary = objMerge(keyboardState.colors.tertiary, colors.tertiary);
		}
		if (colors.quaternary != null) {
			keyboardState.colors.quaternary = objMerge(keyboardState.colors.quaternary, colors.quaternary);
		}
	},
	setColorway: (mode: ColorWayModes, customColorway?: Partial<typeof keyboardState.colorway>) => {
		keyboardState.colorwayMode = mode;
		switch (mode) {
			case 'mods_alphas':
				// We're replacing a proxy here, that means if anyone is subscribing to the keys on the individual colors, those won't be updated
				keyboardState.colorway.alphas = keyboardState.colors.primary;
				keyboardState.colorway.alphasForeground = keyboardState.colors.primaryForeground;
				keyboardState.colorway.numbers = keyboardState.colors.secondary;
				keyboardState.colorway.numbersForeground = keyboardState.colors.secondaryForeground;
				keyboardState.colorway.modifiers = keyboardState.colors.tertiary;
				keyboardState.colorway.modifiersForeground = keyboardState.colors.tertiaryForeground;
				keyboardState.colorway.spacebar = keyboardState.colors.quaternary;
				keyboardState.colorway.spacebarForeground = keyboardState.colors.quaternaryForeground;
				keyboardState.colorway.special = keyboardState.colors.tertiary;
				keyboardState.colorway.specialForeground = keyboardState.colors.tertiaryForeground;
				break;
			case 'dolch':
				// We're replacing a proxy here, that means if anyone is subscribing to the keys on the individual colors, those won't be updated
				const derivedDolchDark = { ...keyboardState.colors.primary, l: 15, s: 7 };
				const derivedDolchLight = { ...keyboardState.colors.primary, l: 25, s: 5 };
				const derivedDolchDarkForeground = getForegroundColor(derivedDolchDark);
				const derivedDolchLightForeground = getForegroundColor(derivedDolchLight);
				keyboardState.colorway.alphas = derivedDolchLight;
				keyboardState.colorway.alphasForeground = derivedDolchLightForeground;
				keyboardState.colorway.numbers = derivedDolchLight;
				keyboardState.colorway.numbersForeground = derivedDolchLightForeground;
				keyboardState.colorway.modifiers = derivedDolchDark;
				keyboardState.colorway.modifiersForeground = derivedDolchDarkForeground;
				keyboardState.colorway.spacebar = derivedDolchLight;
				keyboardState.colorway.spacebarForeground = derivedDolchLightForeground;
				keyboardState.colorway.special = keyboardState.originalColor;
				keyboardState.colorway.specialForeground = getForegroundColor(keyboardState.originalColor);
				break;
			case 'wave':
				break;
			case 'custom':
				objMerge(
					keyboardState.colorway,
					customColorway ?? {
						alphas: deepClone(keyboardState.colorway.alphas),
						alphasForeground: deepClone(keyboardState.colorway.alphasForeground),
						numbers: deepClone(keyboardState.colorway.numbers),
						numbersForeground: deepClone(keyboardState.colorway.numbersForeground),
						modifiers: deepClone(keyboardState.colorway.modifiers),
						modifiersForeground: deepClone(keyboardState.colorway.modifiersForeground),
						spacebar: deepClone(keyboardState.colorway.spacebar),
						spacebarForeground: deepClone(keyboardState.colorway.spacebarForeground),
						special: deepClone(keyboardState.colorway.special),
						specialForeground: deepClone(keyboardState.colorway.specialForeground),
					},
				);
				break;
		}
	},
	setOriginalColor: (color: HslaColor) => {
		keyboardState.originalColor = objMerge(keyboardState.originalColor, color);
	},
	computeForegroundColors: () => {
		const primaryForeground = getForegroundColor(keyboardState.colors.primary);
		const secondaryForeground = getForegroundColor(keyboardState.colors.secondary);
		const tertiaryForeground = getForegroundColor(keyboardState.colors.tertiary);
		const quaternaryForeground = getForegroundColor(keyboardState.colors.quaternary);
		objMerge(keyboardState.colors.primaryForeground, primaryForeground);
		objMerge(keyboardState.colors.secondaryForeground, secondaryForeground);
		objMerge(keyboardState.colors.tertiaryForeground, tertiaryForeground);
		objMerge(keyboardState.colors.quaternaryForeground, quaternaryForeground);
	},
};
