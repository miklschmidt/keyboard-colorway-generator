'use client';
import { type ThreeElements, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Center } from '@/components/keyboard/center';

export const OrientAtCursor = ({ children, cacheKey }: { children: React.ReactNode; cacheKey?: string }) => {
	const mousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	const groupRef = useRef<ThreeElements['group']>(null);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			mousePosition.current = { x: event.clientX, y: event.clientY };
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	useFrame(() => {
		const { x, y } = mousePosition.current;
		if (
			groupRef.current == null ||
			groupRef.current.rotation == null ||
			!(groupRef.current.rotation instanceof THREE.Euler)
		) {
			return;
		}
		groupRef.current.rotation.x = ((1 - y / (window.innerHeight / 2)) * -1) / Math.PI;
		groupRef.current.rotation.y = ((1 - x / (window.innerWidth / 2)) * -1) / Math.PI;
	});

	return (
		<Center ref={groupRef} rotation={[0, 0, 0, 'XYZ']} cacheKey={cacheKey}>
			{children}
		</Center>
	);
};
