'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Saturation from '@uiw/react-color-saturation';
import Hue from '@uiw/react-color-hue';
import { hslaToHsva, type HslaColor, hsvaToHsla, hexToHsva, type HsvaColor } from '@uiw/color-convert';
import { Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { hslaToHex } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useCallback, useRef, useState } from 'react';

type ColorPickerProps = {
	value: HslaColor;
	id?: string;
	onChange: (color: HslaColor) => void;
};

export const ColorPicker = ({ value, onChange, id }: ColorPickerProps) => {
	const [hex, setHex] = useState(hslaToHex(value));
	const [hsla, setHsla] = useState(value);
	const valueRef = useRef(value);
	valueRef.current = value;

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
	return (
		<Popover>
			<PopoverTrigger asChild id={id}>
				<div className="inline-flex">
					<Button variant="outline" className="pl-2 pr-1">
						<Palette className="mr-2 h-4 w-4" />
						Pick a color
						{value && (
							<>
								<Separator orientation="vertical" className="mx-2 h-4" />
								<div className="hidden space-x-1 lg:flex">
									<Badge
										color="gray"
										size="sm"
										className="gap-2 rounded-sm font-normal"
										style={{
											color: `hsl(${value.h}, ${value.s}%, 80%)`,
											backgroundColor: `hsla(${value.h}, ${value.s}%, 50%, 0.1)`,
											boxShadow: `0 0 0 1px hsla(${value.h}, ${value.s}%, 50%, 0.2)`,
										}}
									>
										<div
											className="h-4 w-4 rounded-full"
											style={{ backgroundColor: `hsl(${value.h}, ${value.s}%, ${value.l}%)` }}
										></div>
										{hslaToHex(value)}
									</Badge>
								</div>
							</>
						)}
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className="z-50 flex w-80 flex-col !gap-1.5">
				<Saturation
					hsva={hslaToHsva(value)}
					className="focusable aspect-square !w-full flex-shrink-0 !rounded-md"
					onChange={onChangeSaturation}
				/>
				<Hue
					hue={value.h}
					className="focusable flex-shrink-0 rounded-md !bg-transparent [&>div]:!rounded-md"
					onChange={onChangeHue}
				/>
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="hex-input">Hex</Label>
					<Input id="hex-input" value={hex} onChange={onChangeHex} />
				</div>
				<div className="grid grid-cols-3 gap-1.5">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">H</Label>
						<Input id="color-input" type="number" step="1" min={0} max={360} value={hsla.h} onChange={onChangeH} />
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">S</Label>
						<Input id="color-input" type="number" step="1" min={0} max={100} value={hsla.s} onChange={onChangeS} />
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="color-input">L</Label>
						<Input id="color-input" type="number" step="1" min={0} max={100} value={hsla.l} onChange={onChangeL} />
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
