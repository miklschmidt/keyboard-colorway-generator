import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLayouts } from '@/actions/layouts';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { setKeyboardLayout } from '@/state/keyboard';

export function KeyboardSettings() {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const { data: layouts, isFetched } = useQuery({
		queryKey: ['layouts'],
		queryFn: async () => {
			return await getLayouts();
		},
		enabled: isPopoverOpen,
	});
	const setSelectedLayout = useCallback(
		(layoutId: string) => {
			const layout = layouts?.find((layout) => layout.id === layoutId);
			if (layout) {
				setKeyboardLayout(layout);
			} else {
				// TODO: replace with toast
				// eslint-disable-next-line no-console
				console.error(`No layout found with the id ${layoutId}`);
			}
		},
		[layouts],
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Name of your project" />
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="framework">Framework</Label>
							<Select onOpenChange={setIsPopoverOpen} onValueChange={setSelectedLayout}>
								<SelectTrigger id="framework">
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
										<span className="text-muted-foreground">Loading layouts...</span>
									)}
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	);
}
