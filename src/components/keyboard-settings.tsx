import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { keyboardState, keyboardActions } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';
import { Switch } from '@/components/ui/switch';
import { KeyboardIcon } from 'lucide-react';
import { ColorPicker } from '@/components/forms/color-picker';
import { type HslaColor } from '@uiw/color-convert';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { layoutZod } from '@/zods/layouts';

export function KeyboardSettings() {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const { data: layouts, isFetched } = useQuery({
		queryKey: ['layouts'],
		queryFn: async () => {
			const layouts = await fetch('/api/layouts').then((res) => res.json());
			return z.array(layoutZod).parse(layouts);
		},
		// No unneeded requests here!
		enabled: isPopoverOpen,
	});

	const selectedKeyboard = useSnapshot(keyboardState.layout);
	const settings = useSnapshot(keyboardState.settings);
	const { backgroundColor } = useSnapshot(keyboardState);

	const setSelectedLayout = useCallback(
		(layoutId: string) => {
			const layout = layouts?.find((layout) => layout.id === layoutId);
			if (layout) {
				keyboardActions.setKeyboardLayout(layout);
			} else {
				// TODO: replace with toast
				// eslint-disable-next-line no-console
				console.error(`No layout found with the id ${layoutId}`);
			}
		},
		[layouts],
	);

	const onAnimateKeycapsChange = useCallback((val: boolean) => {
		keyboardState.settings.animateKeycaps = val;
	}, []);

	const onSimulateInputChange = useCallback((val: boolean) => {
		keyboardState.settings.mirrorInput = val;
	}, []);

	const onBackgroundColorChange = useCallback((val: HslaColor) => {
		keyboardState.backgroundColor.h = val.h;
		keyboardState.backgroundColor.s = val.s;
		keyboardState.backgroundColor.l = val.l;
		keyboardState.backgroundColor.a = val.a;
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<KeyboardIcon className="size-5 flex-shrink-0 text-primary" />{' '}
					<span className="truncate">Keyboard Settings</span>
				</CardTitle>
				<CardDescription>Change settings that effect the keyboard.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="keyboard-layout">Keyboard Layout</Label>
						<p className="mt-0 text-xs text-muted-foreground">
							Select between different keyboard layouts to preview your colorway.
						</p>
						<Select onOpenChange={setIsPopoverOpen} onValueChange={setSelectedLayout} value={selectedKeyboard.id}>
							<SelectTrigger id="keyboard-layout">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent position="popper">
								{isFetched ? (
									layouts?.map((layout) => (
										<SelectItem key={layout.id} value={layout.id}>
											{layout.name}
										</SelectItem>
									))
								) : (
									<>
										<SelectItem key={selectedKeyboard.id} value={selectedKeyboard.id}>
											{selectedKeyboard.name}
										</SelectItem>
										<span className="text-muted-foreground">Loading layouts...</span>
									</>
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="background-color">Background Color</Label>
						<p className="text-xs text-muted-foreground">Change the background color for the keyboard.</p>
						<ColorPicker value={backgroundColor} onChange={onBackgroundColorChange} id="background-color" />
					</div>
					<Separator orientation="horizontal" />
					<div className="flex flex-col space-y-1.5">
						<div className="flex items-center justify-between space-x-2">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="simulate-input">Mirror Input</Label>
								<p className="mt-0 text-xs text-muted-foreground">
									Simulate input by mirroring the input from the keyboard.
								</p>
							</div>
							<Switch id="simulate-input" onCheckedChange={onSimulateInputChange} checked={settings.mirrorInput} />
						</div>
					</div>
					<div className="flex flex-col space-y-1.5">
						<div className="flex items-center justify-between space-x-2">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="animate-keycaps">Animate Keycaps</Label>
								<p className="mt-0 text-xs text-muted-foreground">Animate the keycaps for no justifiable reason.</p>
							</div>
							<Switch id="animate-keycaps" onCheckedChange={onAnimateKeycapsChange} checked={settings.animateKeycaps} />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
