'use client';

import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/ui/SearchBar';
import ContentCard from '@/components/ui/ContentCard';
import { useProgress } from '@/hooks/useProgress';
import shorterCatechismData from '@/data/shorter-catechism.json';
import { CatechismQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ShorterCatechismPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { progress, markShorterCatechismAsRead, markAllAsRead } = useProgress();
  const searchParams = useSearchParams();

  const catechism = shorterCatechismData as CatechismQuestion[];
  const allQuestionIds = catechism.map(q => q.id);

  useEffect(() => {
    const questionId = searchParams.get('q');
    if (questionId) {
      const element = document.getElementById(questionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return catechism;

    return catechism.filter(item => {
      const questionMatch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
      const answerMatch = item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return questionMatch || answerMatch;
    });
  }, [searchQuery, catechism]);

  const handleMarkAllAsRead = () => {
    markAllAsRead('shorterCatechism', allQuestionIds);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Catecismo Menor de Westminster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            O Catecismo Menor foi projetado para instrução básica na fé cristã, 
            apresentando as verdades fundamentais em formato conciso e memorável 
            através de 107 perguntas e respostas essenciais.
          </p>
          
          <div className="max-w-md mx-auto flex gap-2">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar no Catecismo Menor..."
              value={searchQuery}
            />
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todos como lido
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredContent.map((question) => (
            <ContentCard
              key={question.id}
              id={question.id}
              title={`Pergunta ${question.id}`}
              subtitle={question.question}
              content={question.answer}
              references={question.scriptureReferences}
              isCompleted={progress.shorterCatechism.includes(question.id)}
              onMarkAsRead={() => markShorterCatechismAsRead(question.id)}
              searchQuery={searchQuery}
              baseUrl="/catecismo-menor"
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum resultado encontrado para &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <p className="text-sm text-muted-foreground mb-4">
              Perguntas estudadas: {progress.shorterCatechism.length} de {catechism.length}
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(progress.shorterCatechism.length / catechism.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}