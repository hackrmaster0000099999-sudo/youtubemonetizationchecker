import { NextRequest, NextResponse } from 'next/server';
import { recentChecksStore, RecentCheckItem } from '@/lib/recent-checks/store';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as RecentCheckItem['category'] | null;
    const tool = searchParams.get('tool') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 5, 1), 25) : 5;

    const items = recentChecksStore.getRecentChecks({
      category: category || undefined,
      tool,
      limit,
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
      updatedAt: Date.now(),
    });
  } catch (err: unknown) {
    console.error('Error fetching recent checks:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve recent checks.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.title || !body.url) {
      return NextResponse.json(
        { success: false, error: 'Title and URL are required.' },
        { status: 400 }
      );
    }

    const item = recentChecksStore.addCheck({
      id: body.id || `check-${Date.now()}`,
      targetType: body.targetType || 'CHANNEL',
      title: body.title,
      handle: body.handle,
      avatarUrl:
        body.avatarUrl ||
        'https://yt3.ggpht.com/Elp5coYuSyFHR7rfsx5ueYdi8jlOXyuOpP0_GZ6iGEI5QNROxlJm8gKpWo4rr9L255FzU7Iwgg=s88-c-k-c0x00ffffff-no-rj',
      url: body.url,
      tool: body.tool || 'monetization-checker',
      category: body.category || 'Monetization',
      statusText: body.statusText || 'Monetized',
      statusType: body.statusType || 'success',
      metaText: body.metaText,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (err: unknown) {
    console.error('Error recording recent check:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to record recent check.' },
      { status: 500 }
    );
  }
}
