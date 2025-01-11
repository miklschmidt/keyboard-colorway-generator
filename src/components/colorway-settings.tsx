import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { ColorPicker } from '@/components/color-picker';
import { keyboardActions, keyboardState } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';
import { type ColorSchemeSelection, ColorSchemeSelector } from '@/components/color-scheme-selector';
import { type HslaColor } from '@uiw/color-convert';
import { useCallback, useMemo } from 'react';
import { getColorScheme } from '@/actions/palettespro';
import { useThrottledCallback } from '@/hooks/use-throttled-callback';
import { camelCaseToTitleCase, colorschemeMutationKey, hslaToHex } from '@/lib/utils';
import { toast } from 'sonner';

export function ColorwaySettings() {
	const { originalColor, colorScheme: currentColorScheme } = useSnapshot(keyboardState);
	// Third party API is called imperatively to avoid unneeded requests
	// It is proxied through our server, since it doesn't allow CORS.
	// The result is cached on the server for each parameter value, so we don't issue the same request twice.
	const mutationKey = colorschemeMutationKey(originalColor);
	const requestColorScheme = useMutation({
		mutationKey,
		mutationFn: getColorScheme,
		retry(failureCount) {
			if (failureCount > 3) {
				toast.error('Failed to fetch color schemes after 3 tries', {
					description: 'Palettespro is unfortunately highly unstable. Please try again later.',
				});
				return false;
			}
			return true;
		},
	});

	const debouncedGetColorScheme = useThrottledCallback(requestColorScheme.mutateAsync, 500);

	const onPrimaryColorChange = useCallback(
		(color: HslaColor) => {
			keyboardActions.setOriginalColor(color);
			keyboardActions.setColorway({ primary: color });
			keyboardActions.computeForegroundColors();
			// Fetch color schemes for the new primary color
			debouncedGetColorScheme(hslaToHex(color));
		},
		[debouncedGetColorScheme],
	);

	const onColorSchemeChange = useCallback((colorScheme: ColorSchemeSelection | null) => {
		if (colorScheme == null) {
			keyboardActions.setColorScheme(null, []);
			return;
		}
		keyboardActions.setColorScheme(colorScheme.value, colorScheme.colors);
	}, []);

	const selectedColorScheme = useMemo(() => {
		return requestColorScheme.data != null &&
			currentColorScheme != null &&
			currentColorScheme in requestColorScheme.data
			? {
					value: currentColorScheme,
					colors: requestColorScheme.data[currentColorScheme],
					label: camelCaseToTitleCase(currentColorScheme),
				}
			: null;
	}, [currentColorScheme, requestColorScheme.data]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Colorway Settings</CardTitle>
				<CardDescription>Change the colorway of the keycaps.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="primary-color">Primary Color</Label>
						<ColorPicker value={originalColor} onChange={onPrimaryColorChange} id="primary-color" />
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-scheme">Color scheme</Label>
						<ColorSchemeSelector
							id="color-scheme"
							setColorScheme={onColorSchemeChange}
							selectedColorScheme={selectedColorScheme}
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	);
}
