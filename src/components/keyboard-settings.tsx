import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLayouts } from '@/actions/layouts';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { keyboardState, keyboardActions } from '@/state/keyboard';
import { useSnapshot } from 'valtio/react';
import { Switch } from '@/components/ui/switch';

export function KeyboardSettings() {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const { data: layouts, isFetched } = useQuery({
		queryKey: ['layouts'],
		queryFn: async () => {
			return await getLayouts();
		},
		// No unneeded requests here!
		enabled: isPopoverOpen,
	});
	const selectedKeyboard = useSnapshot(keyboardState.layout);
	const settings = useSnapshot(keyboardState.settings);
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
	return (
		<Card>
			<CardHeader>
				<CardTitle>Keyboard Settings</CardTitle>
				<CardDescription>Change settings that effect the keyboard.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<div className="flex items-center justify-between space-x-2">
							<Label htmlFor="animate-keycaps">Animate Keycaps</Label>
							<Switch id="animate-keycaps" onCheckedChange={onAnimateKeycapsChange} checked={settings.animateKeycaps} />
						</div>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="keyboard-layout">Keyboard Layout</Label>
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
				</div>
			</CardContent>
		</Card>
	);
}
