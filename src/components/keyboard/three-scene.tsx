'use client';
import { Canvas } from '@react-three/fiber';
import { Keyboard } from '@/components/keyboard/keyboard';
import { Loading } from '@/components/loading';
import { uiState } from '@/state/ui';
import { useSnapshot } from 'valtio/react';
import { twJoin } from 'tailwind-merge';

const LoadingOverlay = () => {
	const ui = useSnapshot(uiState);
	return (
		<div
			className={twJoin(
				'bg-background pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ease-in-out',
				ui.isKeyboardPending ? 'opacity-100' : 'opacity-0',
			)}
		>
			<Loading />
		</div>
	);
};

export const ThreeScene = () => {
	return (
		<div className="relative flex-1 overflow-hidden rounded-t-xl">
			<Canvas resize={{ scroll: true }} shadows className="overflow-hidden">
				<ambientLight intensity={1} color="white" />
				<pointLight position={[-10, 0, 10]} />
				<directionalLight castShadow position={[-15, 15, 12]} intensity={1} shadow-mapSize={[1024, 1024]}>
					<perspectiveCamera attach="shadow-camera" />
				</directionalLight>
				<Keyboard />
			</Canvas>
			<LoadingOverlay />
		</div>
	);
};
