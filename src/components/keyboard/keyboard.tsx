import { readLayout } from '@/actions/layouts';
import { Keycap } from '@/components/keyboard/keycap';
import { OrientAtCursor } from '@/components/keyboard/orient-at-cursor';
import { useQuery } from '@tanstack/react-query';
import { deserialize } from '@kcf-hub/kle-serial';
import { useSnapshot } from 'valtio/react';
import { keyboardState } from '@/state/keyboard';
import { uiState } from '@/state/ui';
import { useRef } from 'react';
import { motion } from 'framer-motion-3d';
import { hslaToHex } from '@/lib/utils';

export const Keyboard = () => {
	const { layout: selectedKeyboard, backgroundColor } = useSnapshot(keyboardState);
	const loadedKeyboardId = useRef<string | null>(null);
	const { data, isPending } = useQuery({
		queryKey: ['keyboard', selectedKeyboard.id],
		queryFn: async () => {
			const layout = await readLayout(selectedKeyboard.id);
			const serial = deserialize(JSON.parse(layout));
			loadedKeyboardId.current = selectedKeyboard.id;
			return serial;
		},
	});

	// We can do this because it's a proxy object and because valtio will only re-render dependent components when the value changes.
	// Should we? Probably not. We only need this further up in the render tree because we're currently in a three.js scene, and we
	// need to render a DOM component to show the loading state. This could also be achieved via a portal, which arguably isn't much better.
	uiState.isKeyboardPending = isPending;

	const keyboardWidth =
		data?.keys.reduce((acc, key) => {
			if (key.x + key.width > acc) {
				return key.x + key.width;
			}
			return acc;
		}, 0) ?? 0;

	return (
		<group position={[0, 0, -5]} name="keyboard">
			<OrientAtCursor name="keys">
				{data?.keys.map((key, index) => <Keycap key={index} keycap={key} keyboardWidth={keyboardWidth} />)}
			</OrientAtCursor>
			<OrientAtCursor name="background">
				<mesh position={[0, 0, -0.1]} rotation={[0, 0, 0]} receiveShadow>
					<planeGeometry args={[1000, 1000]} />
					<motion.meshStandardMaterial
						initial={{ color: hslaToHex(backgroundColor) }}
						animate={{ color: hslaToHex(backgroundColor) }}
					/>
				</mesh>
			</OrientAtCursor>
		</group>
	);
};
