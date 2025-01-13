import { NextResponse } from 'next/server';
import { readLayout } from '@/app/api/layouts/helpers';
import { layoutIdZod } from '@/zods/layouts';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	if (!layoutIdZod.safeParse(id).success) {
		return NextResponse.json({ error: 'Invalid layout id' }, { status: 404 });
	}
	const layout = await readLayout(id);
	return NextResponse.json(JSON.parse(layout));
}
