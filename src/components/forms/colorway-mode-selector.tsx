'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SwatchBook } from 'lucide-react';

export type ColorWayModes = 'mods_alphas' | 'dolch' | 'wave' | 'custom';

export type ColorwayMode = {
	value: ColorWayModes;
	label: string;
};

const modes: ColorwayMode[] = [
	{
		value: 'mods_alphas',
		label: 'Mods / Alphas',
	},
	{
		value: 'dolch',
		label: 'Dolch',
	},
	{
		value: 'wave',
		label: 'Wave',
	},
	{
		value: 'custom',
		label: 'Custom',
	},
];

type ColorwayModeSelectorProps = {
	id?: string;
	colorwayMode: ColorWayModes | null;
	setSelectedColorwayMode: (mode: ColorwayMode | null) => void;
};

export function ColorwayModeSelector({ colorwayMode, setSelectedColorwayMode, id }: ColorwayModeSelectorProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const selectedColorwayMode = modes.find((mode) => mode.value === colorwayMode);

	const trigger = (
		<Button variant="outline" className="focusable min-w-0 justify-start px-2">
			<SwatchBook className="mr-2 size-4" />
			<div className="flex min-w-0 flex-1 items-center justify-between gap-2 truncate">
				<span className="truncate">{selectedColorwayMode ? selectedColorwayMode.label : 'Pick a mode'}</span>
			</div>
		</Button>
	);

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild id={id}>
					{trigger}
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<ColorwayModeList setOpen={setOpen} setSelectedColorwayMode={setSelectedColorwayMode} />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild id={id}>
				{trigger}
			</DrawerTrigger>
			<DrawerTitle className="sr-only">Select a color mode</DrawerTitle>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ColorwayModeList setOpen={setOpen} setSelectedColorwayMode={setSelectedColorwayMode} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function ColorwayModeList({
	setOpen,
	setSelectedColorwayMode,
}: {
	setOpen: (open: boolean) => void;
	setSelectedColorwayMode: (mode: ColorwayMode | null) => void;
}) {
	return (
		<Command>
			<CommandInput placeholder="Filter mode..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{modes.map((mode) => (
						<CommandItem
							key={mode.value}
							value={mode.value}
							onSelect={(value) => {
								setSelectedColorwayMode(modes.find((priority) => priority.value === value) || null);
								setOpen(false);
							}}
						>
							{mode.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
