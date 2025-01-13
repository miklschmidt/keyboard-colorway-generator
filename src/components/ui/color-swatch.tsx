import { hslaToHex } from '@/lib/utils';

import { type HslColor } from '@uiw/color-convert';
import { Badge } from '@/components/ui/badge';
import { useClipboard } from '@/hooks/use-clipboard';

export function ColorSwatch({ value }: { value: HslColor }) {
	const { copy } = useClipboard();
	const hex = hslaToHex({ h: value.h, s: value.s, l: value.l, a: 1 });
	return (
		<Badge
			color="gray"
			size="sm"
			onClick={(e) => {
				e.stopPropagation();
				copy(hex);
			}}
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
			{hex}
		</Badge>
	);
}
