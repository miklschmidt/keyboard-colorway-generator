import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/color-picker';
import { keyboardActions, keyboardState } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';

export function KeycapSettings() {
	const colorway = useSnapshot(keyboardState.colorway);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Keycap Settings</CardTitle>
				<CardDescription>These settings control how the colorway is applied to the keycaps.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color">Primary Color</Label>
						<ColorPicker
							value={colorway.primary}
							onChange={(color) => {
								keyboardActions.setColorway({ primary: color });
								keyboardActions.computeForegroundColors();
							}}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="framework">Color scheme</Label>
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
