import { type HslaColor, hsvaToHex, hslaToHsva, type HslColor } from '@uiw/color-convert';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function objMerge<T extends object>(target: T, source: Partial<T>) {
	type K = keyof T;
	const isKey = (key: string | K): key is K => key in target && key in source;
	Object.keys(source).forEach((key) => {
		if (isKey(key) && source[key] !== undefined) {
			target[key] = source[key];
		} else {
			throw new Error(`Key ${key} not found in target, objects are not compatible`);
		}
	});
}

// Algorithm from https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
export function colorContrastRatio(c1: HslColor, c2: HslColor) {
	const l1 = c1.l / 100;
	const l2 = c2.l / 100;
	return (l1 + 0.05) / (l2 + 0.05);
}

export function getForegroundColor(c1: HslColor): HslColor {
	const contrastRatioBlack = colorContrastRatio(c1, { h: 0, s: 0, l: 0 });
	const contrastRatioWhite = colorContrastRatio({ h: 0, s: 0, l: 100 }, c1) + 3;
	return contrastRatioBlack > contrastRatioWhite ? { h: 0, s: 0, l: 0 } : { h: 0, s: 0, l: 100 };
}

export function camelCaseToTitleCase(str: string) {
	return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (match) {
		return match.toUpperCase();
	});
}

export function hslaToHex(hsla: HslaColor) {
	return hsvaToHex(hslaToHsva(hsla));
}

export function hslToHex(hsl: HslColor) {
	return hslaToHex({ h: hsl.h, s: hsl.s, l: hsl.l, a: 1 });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function colorschemeMutationKey(originalColor: HslaColor) {
	return ['colorSchemes'];
}
