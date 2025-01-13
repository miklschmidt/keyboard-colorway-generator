import { NextResponse } from 'next/server';
import { getLayouts } from '@/app/api/layouts/helpers';

export async function GET() {
	const layouts = await getLayouts();
	return NextResponse.json(layouts);
}
