import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '3cfbc6a944c10a70d848cebae4b8245b';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await response.json();

    if (data && data.success && data.data && data.data.url) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        display_url: data.data.display_url || data.data.url,
        thumb_url: data.data.thumb?.url || data.data.url,
        delete_url: data.data.delete_url || '',
      });
    }

    return NextResponse.json(
      { success: false, error: data?.error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
