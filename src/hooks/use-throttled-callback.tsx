'use client';
import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottledCallback = <T extends (...args: any[]) => void>(callback: T, interval: number = 1000) => {
	const callbackRef = useRef<T>(callback);
	const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
	const lastArgsRef = useRef<Parameters<T> | null>(null);

	// Keep callback ref updated
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = null;
			lastArgsRef.current = null;
		};
	}, []);

	return useCallback(
		(...args: Parameters<T>) => {
			// If no timer is active, execute immediately and start timer
			if (!timeoutRef.current) {
				callbackRef.current(...args);

				timeoutRef.current = setTimeout(() => {
					// If we received more calls during the timeout, execute with latest args
					if (lastArgsRef.current) {
						callbackRef.current(...lastArgsRef.current);
						lastArgsRef.current = null;
					}
					timeoutRef.current = null;
				}, interval);
			} else {
				// Store the latest args to use when timer completes
				lastArgsRef.current = args;
			}
		},
		[interval],
	);
};
