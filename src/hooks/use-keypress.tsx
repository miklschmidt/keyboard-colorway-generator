import { useEffect } from 'react';

export const useKeypress = (keys: KeyboardEvent['key'][], callback: () => void) => {
	useEffect(() => {
		const onKeyPress = (e: KeyboardEvent) => {
			if (keys.includes(e.key)) {
				callback();
			}
		};
		window?.addEventListener('keydown', onKeyPress);
		return () => {
			window?.removeEventListener('keydown', onKeyPress);
		};
	}, [keys, callback]);
};
