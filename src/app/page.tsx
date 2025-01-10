'use client';
import { KeyboardSettings } from '@/components/keyboard-settings';
import { ThreeScene } from '@/components/keyboard/three-scene';
import { uiState } from '@/state/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';
import { useSnapshot } from 'valtio/react';

const queryClient = new QueryClient();

export default function HomePage() {
	const ui = useSnapshot(uiState);
	return (
		<QueryClientProvider client={queryClient}>
			<main
				className={twJoin(
					'from-background to-background/50 flex h-screen w-full flex-col items-stretch justify-center bg-gradient-to-b text-white',
					ui.darkMode ? 'dark' : 'light',
				)}
			>
				<div className="grid flex-grow-0 grid-cols-3 gap-4 p-4">
					<KeyboardSettings />
					<KeyboardSettings />
					<KeyboardSettings />
				</div>
				<div className="flex flex-1">
					<ThreeScene />
				</div>
			</main>
		</QueryClientProvider>
	);
}
