'use client';
import { Canvas } from '@react-three/fiber';
import { Keyboard } from '@/components/keyboard/keyboard';

export const ThreeScene = () => {
	return (
		<Canvas className="min-h-full" style={{ height: 'auto' }} shadows>
			<ambientLight intensity={1} color="white" />
			<pointLight position={[-10, 0, 10]} />
			<directionalLight castShadow position={[-5, 5, 19]} intensity={1} shadow-mapSize={[1024, 1024]}>
				<perspectiveCamera attach="shadow-camera" />
			</directionalLight>
			<Keyboard />
		</Canvas>
	);
};
