import { readLayout } from '@/actions/layouts';
import { Keycap } from '@/components/keyboard/keycap';
import { OrientAtCursor } from '@/components/keyboard/orient-at-cursor';
import { useSuspenseQuery } from '@tanstack/react-query';
import { deserialize } from '@kcf-hub/kle-serial';
import { useSnapshot } from 'valtio/react';
import { keyboardState } from '@/state/keyboard';
import { uiState } from '@/state/ui';

export const Keyboard = () => {
	const selectedKeyboard = useSnapshot(keyboardState);
	const { data } = useSuspenseQuery({
		queryKey: ['keyboard', selectedKeyboard.id],
		queryFn: async () => {
			const layout = await readLayout(selectedKeyboard.id);
			const serial = deserialize(JSON.parse(layout));
			return serial;
		},
	});

	const ui = useSnapshot(uiState);

	return (
		<>
			<OrientAtCursor>
				{data.keys.map((key, index) => (
					<Keycap key={index} keycap={key} />
				))}
			</OrientAtCursor>
			<OrientAtCursor>
				<mesh position={[0, 0, -14]} rotation={[0, 0, 0]} receiveShadow>
					<planeGeometry args={[1000, 1000]} />
					<meshStandardMaterial color={ui.darkMode ? '#222' : 'white'} flatShading metalness={0} roughness={1} />
				</mesh>
			</OrientAtCursor>
		</>
	);
};
