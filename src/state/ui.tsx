'use client';
import { proxy } from 'valtio';

export const uiState = proxy({
	showKeyboardSettings: false,
	darkMode: true,
});
