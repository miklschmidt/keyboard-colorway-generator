'use client';
import { proxy } from 'valtio';

export const uiState = proxy({
	showKeyboardSettings: true,
	isKeyboardPending: true,
	darkMode: true,
});
