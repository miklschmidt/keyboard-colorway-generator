'use client';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { Keyboard } from '@/components/keyboard/keyboard';
import { Loading } from '@/components/loading';
import { uiState } from '@/state/ui';
import { useSnapshot } from 'valtio/react';
import { twJoin } from 'tailwind-merge';
import { OrbitControls as OrbitControlsThree } from 'three/addons/controls/OrbitControls.js';

const OrbitControls = extend(OrbitControlsThree);

const LoadingOverlay = () => {
	const ui = useSnapshot(uiState);
	return (
		<div
			className={twJoin(
				'bg-background pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ease-in-out',
				ui.isKeyboardPending ? 'opacity-100' : 'opacity-0',
			)}
		>
			<Loading size="xl" />
		</div>
	);
};

const Controls = () => {
	const { camera, gl } = useThree((state) => ({ camera: state.camera, gl: state.gl }));
	return (
		<OrbitControls
			args={[camera, gl.domElement]}
			enablePan={false}
			enableRotate={false}
			maxDistance={20}
			minDistance={1}
		/>
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
				<Controls />
				<Keyboard />
			</Canvas>
			<LoadingOverlay />
		</div>
	);
};
