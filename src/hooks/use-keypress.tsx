'use client';
import { kleKeyToBrowserKey } from '@/lib/keyboard';
import { useEffect, useState, useMemo } from 'react';
export function useKeyPress(keys: string[]) {
	const [isPressed, setIsPressed] = useState(false);
	const lowerKeys = useMemo(() => keys.map((key) => kleKeyToBrowserKey(key).toLowerCase()), [keys]);
	useEffect(() => {
		const downHandler = (event: KeyboardEvent) => {
			if (lowerKeys.includes(event.key.toLowerCase())) {
				setIsPressed(true);
			}
		};

		const upHandler = (event: KeyboardEvent) => {
			if (lowerKeys.includes(event.key.toLowerCase())) {
				setIsPressed(false);
			}
		};

		window?.addEventListener('keydown', downHandler);
		window?.addEventListener('keyup', upHandler);

		return () => {
			window?.removeEventListener('keydown', downHandler);
			window?.removeEventListener('keyup', upHandler);
		};
	}, [lowerKeys]);

	return isPressed;
}
