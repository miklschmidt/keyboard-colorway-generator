'use client';
import { type layoutZod } from '@/zods/layouts';
import { proxy } from 'valtio';
import { type z } from 'zod';

export const keyboardState = proxy<z.output<typeof layoutZod>>({
	id: 'alice',
	name: 'TGR Alice',
	notes: 'The original TGR Alice layout',
});

export const setKeyboardLayout = (layout: z.input<typeof layoutZod>) => {
	keyboardState.id = layout.id;
	keyboardState.name = layout.name;
	keyboardState.notes = layout.notes;
};
