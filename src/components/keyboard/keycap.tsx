'use client';
import { type KleKey } from '@kcf-hub/kle-serial';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useSuspenseQuery } from '@tanstack/react-query';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { useMemo, useRef } from 'react';
import { type Group } from 'three';
import { keyboardState } from '@/state/keyboard';
import { hslaToHex } from '@/lib/utils';
import { isAlphaKey, isModifierKey, isSpaceKey } from '@/lib/keyboard';
import { motion } from 'framer-motion-3d';
import { useSnapshot } from 'valtio/react';
import { useKeyPress } from '@/hooks/use-keypress';

// Extend TextGeometry so it's available as a JSX element
const Text = extend(TextGeometry);

// Extend RoundedBoxGeometry so it's available as a JSX element
const RoundedBox = extend(RoundedBoxGeometry);

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

	const meta = useMemo(() => {
		return {
			isModifierKey: isModifierKey(keycap.labels),
			isAlphaKey: isAlphaKey(keycap.labels),
			isSpaceKey: isSpaceKey(keycap.labels),
		};
	}, [keycap.labels]);

	const keycapRef = useRef<Group>(null);

	const colorway = useSnapshot(keyboardState.colorway);
	const settings = useSnapshot(keyboardState.settings);

	const isPressed = useKeyPress(keycap.labels);

	useFrame(({ clock }) => {
		// Animate keycap
		if (keycapRef.current == null || !keyboardState.settings.animateKeycaps) {
			return;
		}
		const z = Math.sin(clock.getElapsedTime() * 2 * Math.PI + keycap.x + keycap.y) * 0.1;
		const pos = keycapRef.current?.position;
		if (pos == null) {
			return;
		}
		keycapRef.current?.position.set(pos.x, pos.y, z);
	});

	const rotation = keycap.rotation_angle !== 0 ? keycap.rotation_angle * (Math.PI / 180) * -1 : 0;
	const labels = keycap.labels.filter((l) => l != '');

	return (
		<motion.group
			initial={{ rotateZ: 0, x: 0, z: 0 }}
			transition={{ duration: 0.05 }}
			animate={{ rotateZ: rotation, x: rotation === 0 ? 0 : rotation < 0 ? -1 : 1, z: isPressed ? -0.15 : 0 }}
		>
			<motion.group
				initial={{ x: 0, y: 0, scale: 0.5, z: -0.1 }}
				animate={{
					x: keycap.x + keycap.width / 2,
					y: 5 - keycap.y,
					z: settings.animateKeycaps ? undefined : 0,
					scale: 1,
				}}
				/* @ts-expect-error i'm assuming the ref shenanigans are because of the bleeding edge version of react-three-fiber */
				ref={keycapRef}
			>
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
					<motion.meshStandardMaterial
						initial={{ color: 'white' }}
						animate={{
							color: meta.isModifierKey
								? hslaToHex(colorway.primary)
								: meta.isAlphaKey
									? hslaToHex(colorway.secondary)
									: hslaToHex(colorway.tertiary),
						}}
					/>
				</mesh>

				{/* Text */}
				{labels.length == 2 ? (
					<>
						<mesh position={[-keycap.width / 2 + 0.3, keycap.height / 2 - 0.35, 0.31]}>
							<Text args={[labels[0]?.trim() || '', { font: fonts.mono, size: 0.15, depth: 0.01 }]} />

							<motion.meshStandardMaterial
								initial={{ color: 'black' }}
								animate={{
									color: meta.isModifierKey
										? hslaToHex(colorway.primaryForeground)
										: meta.isAlphaKey
											? hslaToHex(colorway.secondaryForeground)
											: hslaToHex(colorway.tertiaryForeground),
								}}
							/>
						</mesh>
						<mesh position={[-keycap.width / 2 + 0.3, keycap.height / 2 - 0.65, 0.31]}>
							<Text args={[labels[1]?.trim() || '', { font: fonts.mono, size: 0.15, depth: 0.01 }]} />

							<motion.meshStandardMaterial
								initial={{ color: 'black' }}
								animate={{
									color: meta.isModifierKey
										? hslaToHex(colorway.primaryForeground)
										: meta.isAlphaKey
											? hslaToHex(colorway.secondaryForeground)
											: hslaToHex(colorway.tertiaryForeground),
								}}
							/>
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

						<motion.meshStandardMaterial
							initial={{ color: 'black' }}
							animate={{
								color: meta.isModifierKey
									? hslaToHex(colorway.primaryForeground)
									: meta.isAlphaKey
										? hslaToHex(colorway.secondaryForeground)
										: hslaToHex(colorway.tertiaryForeground),
							}}
						/>
					</mesh>
				)}
			</motion.group>
		</motion.group>
	);
};
