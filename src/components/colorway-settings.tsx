import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { ColorPicker } from '@/components/color-picker';
import { keyboardActions, keyboardState } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';
import { type ColorSchemeSelection, ColorSchemeSelector } from '@/components/color-scheme-selector';
import { type HslaColor } from '@uiw/color-convert';
import { useCallback, useState } from 'react';
import { getColorScheme } from '@/actions/palettespro';
import { useThrottledCallback } from '@/hooks/use-throttled-callback';
import { camelCaseToTitleCase, colorschemeQueryKey, hslaToHex } from '@/lib/utils';
import { toast } from 'sonner';

export function ColorwaySettings() {
	const { originalColor, colorScheme: currentColorScheme } = useSnapshot(keyboardState);
	const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeSelection | null>(null);
	// Third party API is proxied through our server, since it doesn't allow CORS.
	// The result is cached on the server for each parameter value, so we don't issue the same request twice.
	// Furthermore the client throttles the requests and has it's own query cache.
	const queryKey = colorschemeQueryKey(originalColor);
	const colorSchemes = useQuery({
		queryKey,
		queryFn: async () => {
			const res = await getColorScheme(hslaToHex(keyboardState.originalColor));
			if (keyboardState.colorScheme != null) {
				keyboardActions.setColorScheme(keyboardState.colorScheme, res[keyboardState.colorScheme]);
				keyboardActions.computeForegroundColors();
			}
			const selected =
				res != null && currentColorScheme != null && currentColorScheme in res
					? {
							value: currentColorScheme,
							colors: res[currentColorScheme],
							label: camelCaseToTitleCase(currentColorScheme),
						}
					: null;
			setSelectedColorScheme(selected);
			return res;
		},
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

	const throttledGetColorScheme = useThrottledCallback(colorSchemes.refetch, 500);

	const onPrimaryColorChange = useCallback(
		(color: HslaColor) => {
			keyboardActions.setOriginalColor(color);
			if (keyboardState.colorScheme == null) {
				keyboardActions.setColorway({ primary: color });
				keyboardActions.computeForegroundColors();
			}
			// Fetch color schemes for the new primary color
			throttledGetColorScheme();
		},
		[throttledGetColorScheme],
	);

	const onColorSchemeChange = useCallback((colorScheme: ColorSchemeSelection | null) => {
		if (colorScheme == null) {
			keyboardActions.setColorScheme(null, []);
		} else {
			keyboardActions.setColorScheme(colorScheme.value, colorScheme.colors);
		}
		setSelectedColorScheme(colorScheme);
		keyboardActions.computeForegroundColors();
	}, []);

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
							isPending={colorSchemes.isPending}
							isFetching={colorSchemes.isFetching}
							setColorScheme={onColorSchemeChange}
							selectedColorScheme={selectedColorScheme}
							colorSchemes={colorSchemes.data ?? null}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
