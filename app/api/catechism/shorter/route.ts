import { NextRequest, NextResponse } from 'next/server';
import shorterCatechismData from '@/data/shorter-catechism.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('question');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  if (question) {
    const questionData = shorterCatechismData.find(q => q.id === parseInt(question));
    if (!questionData) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(questionData);
  }

  // Pagination support
  if (page && limit) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    
    const paginatedData = shorterCatechismData.slice(start, end);
    
    return NextResponse.json({
      questions: paginatedData,
      total: shorterCatechismData.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(shorterCatechismData.length / limitNum)
    });
  }

  return NextResponse.json(shorterCatechismData);
}