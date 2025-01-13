import { hslaToHex } from '@/lib/utils';

import { type HslColor } from '@uiw/color-convert';
import { Badge } from '@/components/ui/badge';

export function ColorSwatch({ value }: { value: HslColor }) {
	return (
		<Badge
			color="gray"
			size="sm"
			className="gap-2 rounded-sm font-mono font-normal uppercase"
			style={{
				color: `hsl(${value.h}, ${value.s}%, 80%)`,
				backgroundColor: `hsla(${value.h}, ${value.s}%, 50%, 0.1)`,
				boxShadow: `0 0 0 1px hsla(${value.h}, ${value.s}%, 50%, 0.2)`,
			}}
		>
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: `hsl(${value.h}, ${value.s}%, ${value.l}%)` }}
			></div>
			{hslaToHex({ h: value.h, s: value.s, l: value.l, a: 1 })}
		</Badge>
	);
}
