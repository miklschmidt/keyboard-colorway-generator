import { type Config } from 'tailwindcss';
import twAnimate from 'tailwindcss-animate';
import twScrollbar from 'tailwind-scrollbar';
import twContainerQueries from '@tailwindcss/container-queries';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	darkMode: ['class'],
	content: ['./src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
				mono: ['var(--font-geist-mono)', ...fontFamily.mono],
			},
			fontSize: {
				'2xs': '0.6rem',
			},
			animation: {
				dotring: 'dotring 2s ease-out infinite',
				dropbounce: 'dropbounce 2s ease-out infinite',
			},
			keyframes: {
				dotring: {
					'0%': { strokeDasharray: '0 257 0 0 1 0 0 258' },
					'25%': { strokeDasharray: '0 0 0 0 257 0 258 0' },
					'50%, 100%': { strokeDasharray: '0 0 0 0 0 515 0 0' },
				},
				dropbounce: {
					'0%, 50%': { strokeDashoffset: '1', animationTimingFunction: 'ease-in' },
					'64%': { strokeDashoffset: '-109', animationTimingFunction: 'ease-in' },
					'78%': { strokeDashoffset: '-145', animationTimingFunction: 'ease-in' },
					'92%': { strokeDashoffset: '-157', animationTimingFunction: 'ease-in' },
					'57%, 71%, 85%, 99%, 100%': { strokeDashoffset: '-163', animationTimingFunction: 'ease-out' },
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			containers: {
				'2xs': '240px',
				'screen-sm': '640px',
				'screen-md': '768px',
				'screen-lg': '1024px',
				'screen-xl': '1280px',
				'screen-2xl': '1536px',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
				},
				quaternary: {
					DEFAULT: 'hsl(var(--quaternary))',
					foreground: 'hsl(var(--quaternary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
		},
	},
	plugins: [twAnimate, twContainerQueries, twScrollbar({ nocompatible: true })],
} satisfies Config;
