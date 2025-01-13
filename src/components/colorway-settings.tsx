import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/forms/color-picker';
import { keyboardActions, keyboardState } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';
import { type ColorwayMode, ColorwayModeSelector } from '@/components/forms/colorway-mode-selector';
import { Paintbrush } from 'lucide-react';
import { objMerge } from '@/lib/utils';

export function KeycapSettings() {
	const { colorwayMode, colorway } = useSnapshot(keyboardState);
	const setSelectedColorwayMode = (mode: ColorwayMode | null) => {
		keyboardActions.setColorway(mode?.value ?? 'custom');
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Paintbrush className="size-5 text-tertiary" /> Colorway Settings
				</CardTitle>
				<CardDescription>Control how the color scheme is applied to the keycaps.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="colorway-mode">Mode</Label>
						<ColorwayModeSelector
							id="colorway-mode"
							colorwayMode={colorwayMode}
							setSelectedColorwayMode={setSelectedColorwayMode}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="alphas-color">Alphas</Label>
						<ColorPicker
							id="alphas-color"
							disabled={colorwayMode === 'wave'}
							value={colorway.alphas}
							onChange={(value) => {
								if (keyboardState.colorwayMode !== 'custom') {
									keyboardActions.setColorway('custom');
								}
								objMerge(keyboardState.colorway.alphas, value);
							}}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="numbers-color">Number keys</Label>
						<ColorPicker
							id="numbers-color"
							disabled={colorwayMode === 'wave'}
							value={colorway.numbers}
							onChange={(value) => {
								if (keyboardState.colorwayMode !== 'custom') {
									keyboardActions.setColorway('custom');
								}
								objMerge(keyboardState.colorway.numbers, value);
							}}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="modifiers-color">Modifier keys</Label>
						<ColorPicker
							id="modifiers-color"
							disabled={colorwayMode === 'wave'}
							value={colorway.modifiers}
							onChange={(value) => {
								if (keyboardState.colorwayMode !== 'custom') {
									keyboardActions.setColorway('custom');
								}
								objMerge(keyboardState.colorway.modifiers, value);
							}}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="special-color">Special keys</Label>
						<ColorPicker
							id="special-color"
							disabled={colorwayMode === 'wave'}
							value={colorway.special}
							onChange={(value) => {
								if (keyboardState.colorwayMode !== 'custom') {
									keyboardActions.setColorway('custom');
								}
								objMerge(keyboardState.colorway.special, value);
							}}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="spacebar-color">Spacebars</Label>
						<ColorPicker
							id="spacebar-color"
							disabled={colorwayMode === 'wave'}
							value={colorway.spacebar}
							onChange={(value) => {
								if (keyboardState.colorwayMode !== 'custom') {
									keyboardActions.setColorway('custom');
								}
								objMerge(keyboardState.colorway.spacebar, value);
							}}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
