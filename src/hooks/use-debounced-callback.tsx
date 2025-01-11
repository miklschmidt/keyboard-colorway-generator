'use client';
import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => void>(callback: T, delay: number = 1000) => {
	const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);
	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current != null) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => callback(...args), delay);
		},
		[callback, delay],
	);
};
