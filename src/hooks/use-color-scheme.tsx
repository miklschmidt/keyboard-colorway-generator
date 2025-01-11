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
		const unsubscribe = subscribe(keyboardState.colorway, () => {
			if (animationFrameId.current != null) {
				cancelAnimationFrame(animationFrameId.current);
			}
			animationFrameId.current = requestAnimationFrame(() => {
				const primaryHslString = `${keyboardState.colorway.primary.h} ${keyboardState.colorway.primary.s}% ${keyboardState.colorway.primary.l}%`;
				const primaryForegroundHslString = `${keyboardState.colorway.primaryForeground.h} ${keyboardState.colorway.primaryForeground.s}% ${keyboardState.colorway.primaryForeground.l}%`;

				const secondaryHslString = `${keyboardState.colorway.secondary.h} ${keyboardState.colorway.secondary.s}% ${keyboardState.colorway.secondary.l}%`;
				const secondaryForegroundHslString = `${keyboardState.colorway.secondaryForeground.h} ${keyboardState.colorway.secondaryForeground.s}% ${keyboardState.colorway.secondaryForeground.l}%`;

				const tertiaryHslString = `${keyboardState.colorway.tertiary.h} ${keyboardState.colorway.tertiary.s}% ${keyboardState.colorway.tertiary.l}%`;
				const tertiaryForegroundHslString = `${keyboardState.colorway.tertiaryForeground.h} ${keyboardState.colorway.tertiaryForeground.s}% ${keyboardState.colorway.tertiaryForeground.l}%`;

				const quaternaryHslString = `${keyboardState.colorway.quaternary.h} ${keyboardState.colorway.quaternary.s}% ${keyboardState.colorway.quaternary.l}%`;
				const quaternaryForegroundHslString = `${keyboardState.colorway.quaternaryForeground.h} ${keyboardState.colorway.quaternaryForeground.s}% ${keyboardState.colorway.quaternaryForeground.l}%`;

				ref.current?.style.setProperty('--primary', primaryHslString);
				ref.current?.style.setProperty('--primary-foreground', primaryForegroundHslString);
				ref.current?.style.setProperty('--secondary', secondaryHslString);
				ref.current?.style.setProperty('--secondary-foreground', secondaryForegroundHslString);
				ref.current?.style.setProperty('--tertiary', tertiaryHslString);
				ref.current?.style.setProperty('--tertiary-foreground', tertiaryForegroundHslString);
				ref.current?.style.setProperty('--quaternary', quaternaryHslString);
				ref.current?.style.setProperty('--quaternary-foreground', quaternaryForegroundHslString);

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
