import { readLayout } from '@/actions/layouts';
import { Keycap } from '@/components/keyboard/keycap';
import { OrientAtCursor } from '@/components/keyboard/orient-at-cursor';
import { useQuery } from '@tanstack/react-query';
import { deserialize } from '@kcf-hub/kle-serial';
import { useSnapshot } from 'valtio/react';
import { keyboardState } from '@/state/keyboard';
import { uiState } from '@/state/ui';
import { useRef } from 'react';

export const Keyboard = () => {
	const selectedKeyboard = useSnapshot(keyboardState.layout);
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

	const ui = useSnapshot(uiState);
	const cacheKey = isPending && loadedKeyboardId.current ? loadedKeyboardId.current : selectedKeyboard.id;
	// We can do this because it's a proxy object and because valtio will only re-render dependent components when the value changes.
	// Should we? Probably not. We only need this further up in the render tree because we're currently in a three.js scene, and we
	// need to render a DOM component to show the loading state. This could also be achieved via a portal, which arguably isn't much better.
	uiState.isKeyboardPending = isPending;

	return (
		<group position={[0, 0, -5]}>
			<OrientAtCursor cacheKey={cacheKey}>
				{data?.keys.map((key, index) => <Keycap key={index} keycap={key} />)}
			</OrientAtCursor>
			<OrientAtCursor cacheKey={cacheKey}>
				<mesh position={[0, 0, -15]} rotation={[0, 0, 0]} receiveShadow>
					<planeGeometry args={[1000, 1000]} />
					<meshStandardMaterial color={ui.darkMode ? '#222' : 'white'} />
				</mesh>
			</OrientAtCursor>
		</group>
	);
};
