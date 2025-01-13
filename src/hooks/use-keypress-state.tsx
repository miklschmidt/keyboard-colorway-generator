'use client';
import { kleKeyToBrowserKey } from '@/lib/keyboard';
import { useEffect, useState, useMemo, useRef } from 'react';

const matchKey = (
	keys: string[],
	keyLocation: KeyboardEvent['location'] | undefined,
	eventKey: string,
	eventLocation: KeyboardEvent['location'],
) => {
	const matchesLocation =
		keyLocation == null || keyLocation === eventLocation || eventLocation === KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
	const matchesKey = keys.includes(eventKey.toLowerCase()) || (keys.length === 0 && eventKey.toLowerCase() === ' ');
	return matchesLocation && matchesKey;
};

export function useKeyPressState(
	keys: string[],
	location?: KeyboardEvent['location'],
	preventDefaultWithin?: HTMLElement,
) {
	const [isPressed, setIsPressed] = useState(false);
	const [keyLocation, setKeyLocation] = useState<number | null>(null);
	const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
	const lowerKeys = useMemo(() => keys.map((key) => kleKeyToBrowserKey(key).toLowerCase()), [keys]);
	useEffect(() => {
		const downHandler = (event: KeyboardEvent) => {
			if (matchKey(lowerKeys, location, event.key, event.location)) {
				if (
					preventDefaultWithin &&
					mousePositionRef.current &&
					document.elementFromPoint(mousePositionRef.current.x, mousePositionRef.current.y) === preventDefaultWithin
				) {
					event.preventDefault();
				}
				setIsPressed(true);
				setKeyLocation(event.location);
			}
		};

		const upHandler = (event: KeyboardEvent) => {
			if (matchKey(lowerKeys, location, event.key, event.location)) {
				if (
					preventDefaultWithin &&
					mousePositionRef.current &&
					document.elementFromPoint(mousePositionRef.current.x, mousePositionRef.current.y) === preventDefaultWithin
				) {
					event.preventDefault();
				}
				setIsPressed(false);
				setKeyLocation(null);
			}
		};

		const mouseMoveHandler = (event: MouseEvent) => {
			mousePositionRef.current = { x: event.clientX, y: event.clientY };
		};

		window?.addEventListener('keydown', downHandler);
		window?.addEventListener('keyup', upHandler);
		window?.addEventListener('mousemove', mouseMoveHandler);

		return () => {
			window?.removeEventListener('keydown', downHandler);
			window?.removeEventListener('keyup', upHandler);
			window?.removeEventListener('mousemove', mouseMoveHandler);
		};
	}, [location, lowerKeys, preventDefaultWithin]);

	return { isPressed, keyLocation };
}
