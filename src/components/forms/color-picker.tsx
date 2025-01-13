'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Saturation from '@uiw/react-color-saturation';
import Hue from '@uiw/react-color-hue';
import { hslaToHsva, type HslaColor, hsvaToHsla, hexToHsva, type HsvaColor } from '@uiw/color-convert';
import { Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { hslaToHex } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { useKeypress } from '@/hooks/use-keypress';
import { deepClone } from 'valtio/utils';
import namer from 'color-namer';
import { ColorSwatch } from '@/components/ui/color-swatch';

type ColorPickerProps = {
	value: HslaColor;
	id?: string;
	disabled?: boolean;
	placeholder?: string;
	onChange: (color: HslaColor) => void;
};

export const ColorPicker = ({ value, onChange, id, disabled }: ColorPickerProps) => {
	const [hex, setHex] = useState(hslaToHex(value));
	const [hsla, setHsla] = useState(deepClone(value));
	const valueRef = useRef(deepClone(value));
	const hslaRef = useRef(deepClone(hsla));
	valueRef.current = value;
	hslaRef.current = hsla;

	const [open, setOpen] = useState(false);

	useKeypress(
		['enter', 'escape'],
		useCallback(() => {
			setOpen(false);
		}, []),
	);

	const updateLocalValues = useCallback((hsva: HsvaColor) => {
		setHex(hslaToHex(hsvaToHsla(hsva)));
		setHsla(hsvaToHsla(hsva));
	}, []);

	const onChangeH = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = { ...valueRef.current, h: Number(e.target.value) };
			updateLocalValues(hslaToHsva(newValue));
			onChange(newValue);
		},
		[onChange, updateLocalValues],
	);

	const onChangeS = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = { ...valueRef.current, s: Number(e.target.value) };
			updateLocalValues(hslaToHsva(newValue));
			onChange(newValue);
		},
		[onChange, updateLocalValues],
	);

	const onChangeL = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = { ...valueRef.current, l: Number(e.target.value) };
			updateLocalValues(hslaToHsva(newValue));
			onChange(newValue);
		},
		[onChange, updateLocalValues],
	);

	const onChangeHex = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setHex(e.target.value);
			const color = hexToHsva(e.target.value.replace('#', ''));
			updateLocalValues(color);
			onChange(hsvaToHsla(color));
		},
		[onChange, updateLocalValues],
	);

	const onChangeSaturation = useCallback(
		(color: HsvaColor) => {
			const hsla = hsvaToHsla(color);
			updateLocalValues(color);
			onChange(hsla);
		},
		[onChange, updateLocalValues],
	);
	const onChangeHue = useCallback(
		(hue: { h: number }) => {
			const hsla = { ...valueRef.current, h: hue.h };
			updateLocalValues(hslaToHsva(hsla));
			onChange(hsla);
		},
		[onChange, updateLocalValues],
	);

	const keysPressed = useRef<Set<KeyboardEvent['key']>>(new Set());

	const updateSaturationFromKeysPressed = useCallback(() => {
		const newValue = hslaToHsva(hslaRef.current);
		let changed = false;
		if (keysPressed.current.has('ArrowUp')) {
			newValue.v = Math.max(Math.min(newValue.v + 1, 100), 0);
			changed = true;
		}
		if (keysPressed.current.has('ArrowDown')) {
			newValue.v = Math.min(Math.max(newValue.v - 1, 0), 100);
			changed = true;
		}
		if (keysPressed.current.has('ArrowLeft')) {
			newValue.s = Math.min(Math.max(newValue.s - 1, 0), 100);
			changed = true;
		}
		if (keysPressed.current.has('ArrowRight')) {
			newValue.s = Math.max(Math.min(newValue.s + 1, 100), 0);
			changed = true;
		}
		if (changed) {
			updateLocalValues(newValue);
			onChange(hsvaToHsla(newValue));
		}
	}, [onChange, updateLocalValues]);

	const handleSaturationKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			keysPressed.current.add(e.key);
			updateSaturationFromKeysPressed();
		},
		[updateSaturationFromKeysPressed],
	);

	const handleSaturationKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		keysPressed.current.delete(e.key);
	}, []);

	const handleHueKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const newValue = { ...hslaRef.current };
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				e.stopPropagation();
				newValue.h = Math.max(newValue.h - 1, 0);
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				e.stopPropagation();
				newValue.h = Math.min(newValue.h + 1, 360);
			}
			updateLocalValues(hslaToHsva(newValue));
			onChange(newValue);
		},
		[onChange, updateLocalValues],
	);

	const colorName = useMemo(() => {
		const name = value
			? Object.values(namer(`hsl(${value.h}, ${value.s}%, ${value.l}%)`))
					.flat()
					.sort((a, b) => a.distance - b.distance)[0]
			: null;
		return name?.name ?? null;
	}, [value]);

	return (
		<Popover open={open && !disabled} onOpenChange={setOpen}>
			<PopoverTrigger asChild id={id} disabled={disabled}>
				<div className="flex">
					<Button
						variant="outline"
						className="flex flex-1 justify-start px-2"
						disabled={disabled}
						onClick={() => setOpen(true)}
					>
						<Palette className="mr-2 size-4" />
						<span className="capitalize">{colorName ? colorName : 'Pick a color'}</span>
						{value && (
							<>
								<Separator orientation="vertical" className="mx-2 h-4" />
								<div className="hidden space-x-1 lg:flex">
									<ColorSwatch value={value} />
								</div>
							</>
						)}
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className="z-50 flex w-80 flex-col justify-between gap-y-4">
				<Saturation
					hsva={hslaToHsva(value)}
					className="focusable aspect-square !w-full flex-shrink-0 !rounded-md"
					onChange={onChangeSaturation}
					onKeyDown={handleSaturationKeyDown}
					onKeyUp={handleSaturationKeyUp}
				/>
				<Hue
					hue={value.h}
					className="focusable flex-shrink-0 !rounded-md !bg-transparent [&>div]:!rounded-md"
					onChange={onChangeHue}
					onKeyDown={handleHueKeyDown}
				/>
				<div className="flex flex-shrink-0 flex-col space-y-1.5">
					<Label htmlFor="hex-input">Hex Color Code</Label>
					<Input id="hex-input" value={hex} onChange={onChangeHex} className="font-mono uppercase" />
				</div>
				<div className="grid flex-shrink-0 grid-cols-3 gap-1.5">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">Hue</Label>
						<Input
							id="color-input"
							type="number"
							className="font-mono"
							step="1"
							min={0}
							max={360}
							value={(Math.round(hsla.h * 100) / 100).toFixed(2)}
							onChange={onChangeH}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">Saturation</Label>
						<Input
							id="color-input"
							type="number"
							className="font-mono"
							step="1"
							min={0}
							max={100}
							value={(Math.round(hsla.s * 100) / 100).toFixed(2)}
							onChange={onChangeS}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">Lightness</Label>
						<Input
							id="color-input"
							className="font-mono"
							type="number"
							step="1"
							min={0}
							max={100}
							value={(Math.round(hsla.l * 100) / 100).toFixed(2)}
							onChange={onChangeL}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
