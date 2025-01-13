import { keyboardState } from '@/state/keyboard';
import { uiState } from '@/state/ui';
import { useLayoutEffect, useRef } from 'react';
import { subscribe, useSnapshot } from 'valtio';

export const useColorScheme = () => {
	const ref = useRef<HTMLElement>(null);
	const ui = useSnapshot(uiState);
	const animationFrameId = useRef<number | null>(null);
	// Update CSS variables used by the interface when colors change
	useLayoutEffect(() => {
		const unsubscribe = subscribe(keyboardState.colors, () => {
			if (animationFrameId.current != null) {
				cancelAnimationFrame(animationFrameId.current);
			}
			animationFrameId.current = requestAnimationFrame(() => {
				const primaryHslString = `${keyboardState.colors.primary.h} ${keyboardState.colors.primary.s}% ${keyboardState.colors.primary.l}%`;
				const primaryForegroundHslString = `${keyboardState.colors.primaryForeground.h} ${keyboardState.colors.primaryForeground.s}% ${keyboardState.colors.primaryForeground.l}%`;

				const secondaryHslString = `${keyboardState.colors.secondary.h} ${keyboardState.colors.secondary.s}% ${keyboardState.colors.secondary.l}%`;
				const secondaryForegroundHslString = `${keyboardState.colors.secondaryForeground.h} ${keyboardState.colors.secondaryForeground.s}% ${keyboardState.colors.secondaryForeground.l}%`;

				const tertiaryHslString = `${keyboardState.colors.tertiary.h} ${keyboardState.colors.tertiary.s}% ${keyboardState.colors.tertiary.l}%`;
				const tertiaryForegroundHslString = `${keyboardState.colors.tertiaryForeground.h} ${keyboardState.colors.tertiaryForeground.s}% ${keyboardState.colors.tertiaryForeground.l}%`;

				const quaternaryHslString = `${keyboardState.colors.quaternary.h} ${keyboardState.colors.quaternary.s}% ${keyboardState.colors.quaternary.l}%`;
				const quaternaryForegroundHslString = `${keyboardState.colors.quaternaryForeground.h} ${keyboardState.colors.quaternaryForeground.s}% ${keyboardState.colors.quaternaryForeground.l}%`;
				if (ref.current != null) {
					ref.current.style.setProperty('--primary', primaryHslString);
					ref.current.style.setProperty('--primary-foreground', primaryForegroundHslString);
					ref.current.style.setProperty('--secondary', secondaryHslString);
					ref.current.style.setProperty('--secondary-foreground', secondaryForegroundHslString);
					ref.current.style.setProperty('--tertiary', tertiaryHslString);
					ref.current.style.setProperty('--tertiary-foreground', tertiaryForegroundHslString);
					ref.current.style.setProperty('--quaternary', quaternaryHslString);
					ref.current.style.setProperty('--quaternary-foreground', quaternaryForegroundHslString);
				} else {
					document.body.style.setProperty('--primary', primaryHslString);
					document.body.style.setProperty('--primary-foreground', primaryForegroundHslString);
					document.body.style.setProperty('--secondary', secondaryHslString);
					document.body.style.setProperty('--secondary-foreground', secondaryForegroundHslString);
					document.body.style.setProperty('--tertiary', tertiaryHslString);
					document.body.style.setProperty('--tertiary-foreground', tertiaryForegroundHslString);
					document.body.style.setProperty('--quaternary', quaternaryHslString);
					document.body.style.setProperty('--quaternary-foreground', quaternaryForegroundHslString);
				}

				animationFrameId.current = null;
			});
		});
		return unsubscribe;
	});

	useLayoutEffect(() => {
		if (ui.darkMode) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	}, [ui.darkMode]);

	return ref;
};
