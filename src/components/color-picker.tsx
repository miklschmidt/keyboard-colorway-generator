'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Saturation from '@uiw/react-color-saturation';
import Hue from '@uiw/react-color-hue';
import { hslaToHsva, type HslaColor, hsvaToHsla } from '@uiw/color-convert';
import { Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { hslaToHex } from '@/lib/utils';

type ColorPickerProps = {
	value: HslaColor;
	id?: string;
	onChange: (color: HslaColor) => void;
};

export const ColorPicker = ({ value, onChange, id }: ColorPickerProps) => {
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
			<PopoverContent className="z-50 h-80 w-80">
				<Saturation
					hsva={hslaToHsva(value)}
					className="w-full"
					onChange={(newColor) => {
						onChange({ ...value, ...hsvaToHsla(newColor) });
					}}
				/>
				<Hue
					hue={value.h}
					onChange={(newHue) => {
						onChange({ ...value, ...newHue });
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};
