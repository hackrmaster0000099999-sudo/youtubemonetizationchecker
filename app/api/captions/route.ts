import { NextRequest, NextResponse } from 'next/server';
import { getCaptions } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const language = (searchParams.get('language') as 'bangla' | 'english') || undefined;
    const withImageOnly = searchParams.get('imageOnly') === 'true';

    const items = await getCaptions({
      category,
      language,
      withImageOnly,
    });

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message, data: [] },
      { status: 500 }
    );
  }
}
