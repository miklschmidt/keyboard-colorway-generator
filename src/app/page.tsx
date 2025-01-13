'use client';
import { ColorschemeSettings } from '@/components/color-scheme-settings';
import { KeyboardSettings } from '@/components/keyboard-settings';
import { ThreeScene } from '@/components/keyboard/three-scene';
import { KeycapSettings } from '@/components/colorway-settings';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';

const queryClient = new QueryClient();

export default function HomePage() {
	useColorScheme();
	return (
		<QueryClientProvider client={queryClient}>
			<main
				className={twJoin(
					'flex h-screen max-h-screen w-full flex-col items-stretch justify-center overflow-hidden bg-background text-white',
				)}
			>
				<div className="grid flex-grow-0 grid-cols-3 gap-4 p-4">
					<KeyboardSettings />
					<ColorschemeSettings />
					<KeycapSettings />
				</div>
				<div className="flex flex-1 overflow-hidden">
					<ThreeScene />
				</div>
			</main>
		</QueryClientProvider>
	);
}
