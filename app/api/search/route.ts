import { NextRequest, NextResponse } from 'next/server';
import confessionData from '@/data/confession.json';
import largerCatechismData from '@/data/larger-catechism.json';
import shorterCatechismData from '@/data/shorter-catechism.json';

interface SearchResult {
  type: 'confession' | 'larger-catechism' | 'shorter-catechism';
  id: number;
  title: string;
  content: string;
  url: string;
  matches: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters long' },
      { status: 400 }
    );
  }

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // Search in Confession
  if (!type || type === 'confession') {
    confessionData.forEach(chapter => {
      chapter.articles.forEach(article => {
        const titleMatches = (chapter.title.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
        const contentMatches = (article.text.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
        
        if (titleMatches + contentMatches > 0) {
          results.push({
            type: 'confession',
            id: chapter.id,
            title: `Capítulo ${chapter.id}: ${chapter.title} - Artigo ${article.id}`,
            content: article.text,
            url: `/confissao#chapter-${chapter.id}`,
            matches: titleMatches + contentMatches
          });
        }
      });
    });
  }

  // Search in Larger Catechism
  if (!type || type === 'larger-catechism') {
    largerCatechismData.forEach(question => {
      const questionMatches = (question.question.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      const answerMatches = (question.answer.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      
      if (questionMatches + answerMatches > 0) {
        results.push({
          type: 'larger-catechism',
          id: question.id,
          title: `Pergunta ${question.id}: ${question.question}`,
          content: question.answer,
          url: `/catecismo-maior#question-${question.id}`,
          matches: questionMatches + answerMatches
        });
      }
    });
  }

  // Search in Shorter Catechism
  if (!type || type === 'shorter-catechism') {
    shorterCatechismData.forEach(question => {
      const questionMatches = (question.question.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      const answerMatches = (question.answer.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      
      if (questionMatches + answerMatches > 0) {
        results.push({
          type: 'shorter-catechism',
          id: question.id,
          title: `Pergunta ${question.id}: ${question.question}`,
          content: question.answer,
          url: `/catecismo-menor#question-${question.id}`,
          matches: questionMatches + answerMatches
        });
      }
    });
  }

  // Sort by relevance (number of matches)
  results.sort((a, b) => b.matches - a.matches);

  return NextResponse.json({
    query,
    results: results.slice(0, 50), // Limit to 50 results
    total: results.length
  });
}