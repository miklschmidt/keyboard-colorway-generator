'use client';
import { type KleKey } from '@kcf-hub/kle-serial';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useSuspenseQuery } from '@tanstack/react-query';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { useRef } from 'react';
import { type Group } from 'three';

// Extend TextGeometry so it's available as a JSX element
const Text = extend(TextGeometry);

// Extend RoundedBoxGeometry so it's available as a JSX element
const RoundedBox = extend(RoundedBoxGeometry);

// Load the font - you'll need to adjust the path to your font file
const fontLoader = new FontLoader();
export const Keycap = ({ keycap }: { keycap: KleKey }) => {
	const { data: fonts } = useSuspenseQuery({
		queryKey: ['font'],
		queryFn: async () => {
			const [sans, mono] = await Promise.allSettled([
				fontLoader.loadAsync('/fonts/geist_medium.json'),
				fontLoader.loadAsync('/fonts/geist_mono_medium.json'),
			] as const);
			if (sans.status === 'rejected' || mono.status === 'rejected') {
				throw new Error('Failed to load fonts');
			}
			return {
				sans: sans.value,
				mono: mono.value,
			};
		},
	});

	const keycapRef = useRef<Group>(null);

	useFrame(({ clock }) => {
		// Tween z position to 0
		if (keycapRef.current == null) return;
		const z = Math.sin(clock.getElapsedTime() * 2 * Math.PI + keycap.x + keycap.y) * 0.1;
		const pos = keycapRef.current?.position;
		if (pos == null) return;
		keycapRef.current?.position.set(pos.x, pos.y, z);
	});

	const rotation = keycap.rotation_angle !== 0 ? keycap.rotation_angle * (Math.PI / 180) * -1 : 0;
	const labels = keycap.labels.filter((l) => l != '');

	return (
		<group position={[rotation === 0 ? 0 : rotation < 0 ? -1 : 1, 0, 0]} rotation={[0, 0, rotation]}>
			<group position={[keycap.x + keycap.width / 2, 5 - keycap.y, 0]} ref={keycapRef} scale={[1, 1, 1]}>
				<mesh position={[0.05, 0.05, 0]} castShadow receiveShadow>
					<RoundedBox
						args={[
							keycap.width - 0.1,
							keycap.height - 0.1,
							0.5,
							4, // segments
							0.1, // radius of the rounded corners
						]}
					/>
					<meshStandardMaterial color="white" />
				</mesh>

				{/* Text */}
				{labels.length == 2 ? (
					<>
						<mesh position={[-keycap.width / 2 + 0.3, keycap.height / 2 - 0.35, 0.31]}>
							<Text args={[labels[0]?.trim() || '', { font: fonts.mono, size: 0.15, depth: 0.01 }]} />
							<meshStandardMaterial color="black" />
						</mesh>
						<mesh position={[-keycap.width / 2 + 0.3, keycap.height / 2 - 0.65, 0.31]}>
							<Text args={[labels[1]?.trim() || '', { font: fonts.mono, size: 0.15, depth: 0.01 }]} />
							<meshStandardMaterial color="black" />
						</mesh>
					</>
				) : (
					<mesh position={[-keycap.width / 2 + 0.3, keycap.height / 2 - 0.4, 0.31]}>
						<Text
							args={[
								labels[0]?.trim() || '',
								{ font: fonts.sans, size: (labels[0]?.length ?? 0) > 1 ? 0.17 : 0.2, depth: 0.01 },
							]}
						/>
						<meshStandardMaterial color="black" />
					</mesh>
				)}
			</group>
		</group>
	);
};
