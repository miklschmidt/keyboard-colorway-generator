'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
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
		<Button variant="outline" className="focusable justify-start px-2">
			<SwatchBook className="mr-2 size-4" />
			{selectedColorwayMode ? (
				<div className="flex flex-1 items-center justify-between gap-2">
					<span>{selectedColorwayMode.label}</span>
				</div>
			) : (
				<>Pick a mode</>
			)}
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
