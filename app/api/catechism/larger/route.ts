import { NextRequest, NextResponse } from 'next/server';
import largerCatechismData from '@/data/larger-catechism.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('question');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  if (question) {
    const questionData = largerCatechismData.find(q => q.id === parseInt(question));
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
    
    const paginatedData = largerCatechismData.slice(start, end);
    
    return NextResponse.json({
      questions: paginatedData,
      total: largerCatechismData.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(largerCatechismData.length / limitNum)
    });
  }

  return NextResponse.json(largerCatechismData);
}