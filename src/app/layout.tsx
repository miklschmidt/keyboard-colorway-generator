import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Keycap Colorway Designer',
	description: 'Design your own keycap colorways',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body className="bg-background text-foreground">{children}</body>
		</html>
	);
}
