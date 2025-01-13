'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorSchemeKeySchema, type ColorHarmonyResponse, type ColorScheme } from '@/zods/palettespro';
import { Loading } from '@/components/loading';
import { useCallback, useMemo } from 'react';
import { SwatchBook } from 'lucide-react';
import { camelCaseToTitleCase, cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

export type ColorSchemeSelection = {
	value: keyof ColorHarmonyResponse;
	colors: ColorScheme[];
	label: string;
};

type ColorSchemeProps = {
	id?: string;
	colorSchemes: ColorHarmonyResponse | null;
	isPending: boolean;
	isFetching: boolean;
	setColorScheme: (colorScheme: ColorSchemeSelection | null) => void;
	selectedColorScheme: ColorSchemeSelection | null;
};

export function ColorSchemeSelector({
	setColorScheme,
	selectedColorScheme,
	colorSchemes,
	isPending,
	isFetching,
	id,
}: ColorSchemeProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const colorSchemeValues = useMemo(() => {
		if (colorSchemes == null) {
			return [];
		}
		return Object.keys(colorSchemes)
			.map((k) => {
				const key = ColorSchemeKeySchema.safeParse(k);
				if (!key.success) {
					logger.error('Invalid color scheme key', k);
					return null;
				}
				return {
					value: key.data,
					label: camelCaseToTitleCase(key.data),
					colors: colorSchemes[key.data],
				};
			})
			.filter((scheme) => scheme !== null);
	}, [colorSchemes]);

	const trigger = (
		<Button variant="outline" className="focusable justify-start px-2 @container">
			{isFetching ? <Loading size="sm" className="mr-2 size-4" /> : <SwatchBook className="mr-2 size-4" />}
			{isPending ? (
				<div className="flex flex-1 items-center justify-start gap-2">
					<span>Fetching color schemes..</span>
				</div>
			) : selectedColorScheme ? (
				<div className="flex flex-1 items-center justify-between gap-2">
					<span>{selectedColorScheme.label}</span>
					<ColorSchemeBar colorScheme={selectedColorScheme} />
				</div>
			) : (
				<>Pick a color scheme</>
			)}
		</Button>
	);

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild id={id}>
					{trigger}
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0" align="start">
					<ColorSchemeList
						isFetching={isFetching}
						colorSchemes={colorSchemeValues}
						setOpen={setOpen}
						setSelectedColorScheme={setColorScheme}
					/>
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
					<ColorSchemeList
						isFetching={isFetching}
						colorSchemes={colorSchemeValues}
						setOpen={setOpen}
						setSelectedColorScheme={setColorScheme}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function ColorSchemeBar({ colorScheme, className }: { colorScheme: ColorSchemeSelection; className?: string }) {
	return (
		<div className={cn('inline-flex overflow-hidden rounded-full', className)}>
			{colorScheme.colors.map((color) => (
				<div
					key={`${color.hsl.h}-${color.hsl.s}-${color.hsl.l}`}
					className="size-4"
					style={{ backgroundColor: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)` }}
				></div>
			))}
		</div>
	);
}

function ColorSchemeList({
	setOpen,
	colorSchemes,
	isFetching,
	setSelectedColorScheme,
}: {
	setOpen: (open: boolean) => void;
	colorSchemes: ColorSchemeSelection[];
	isFetching: boolean;
	setSelectedColorScheme: (colorScheme: ColorSchemeSelection | null) => void;
}) {
	const onSelect = useCallback(
		(value: string | undefined) => {
			if (value === undefined) {
				setSelectedColorScheme(null);
			} else {
				setSelectedColorScheme(colorSchemes.find((colorScheme) => colorScheme.value === value) || null);
			}
			setOpen(false);
		},
		[colorSchemes, setSelectedColorScheme, setOpen],
	);

	return (
		<Command>
			<CommandInput placeholder="Filter color schemes..." />
			<CommandList>
				{isFetching ? (
					<CommandEmpty className="flex items-center gap-2">
						<Loading size="sm" /> Fetching color schemes...
					</CommandEmpty>
				) : (
					colorSchemes.length === 0 && (
						<CommandEmpty>No color schemes found. Select a primary color to generate color schemes.</CommandEmpty>
					)
				)}
				<CommandGroup>
					<CommandItem value={undefined} onSelect={onSelect}>
						No color scheme
					</CommandItem>
					{colorSchemes.map((colorScheme) => (
						<CommandItem
							className="flex justify-between"
							key={colorScheme.value}
							value={colorScheme.value}
							onSelect={onSelect}
						>
							{colorScheme.label} <ColorSchemeBar colorScheme={colorScheme} />
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
