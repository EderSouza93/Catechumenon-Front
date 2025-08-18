import { NextRequest, NextResponse } from 'next/server';
import confessionData from '@/data/confession.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapter = searchParams.get('chapter');

  if (chapter) {
    const chapterData = confessionData.find(c => c.id === parseInt(chapter));
    if (!chapterData) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(chapterData);
  }

  return NextResponse.json(confessionData);
}