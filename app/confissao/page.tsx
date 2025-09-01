'use client';

import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/ui/SearchBar';
import ContentCard from '@/components/ui/ContentCard';
import { useProgress } from '@/hooks/useProgress';
import confessionData from '@/data/confession.json';
import { ConfessionChapter } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ConfessionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { progress, markConfessionChapterAsRead, markAllAsRead } = useProgress();
  const searchParams = useSearchParams();

  const confession = confessionData as ConfessionChapter[];
  const allChapterIds = confession.map(c => c.id);

  useEffect(() => {
    const chapterId = searchParams.get('q');
    if (chapterId) {
      const element = document.getElementById(chapterId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return confession;

    return confession.filter(chapter => {
      const titleMatch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
      const articleMatch = chapter.articles.some(article =>
        article.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return titleMatch || articleMatch;
    });
  }, [searchQuery, confession]);

  const handleMarkAllAsRead = () => {
    markAllAsRead('confessionChapters', allChapterIds);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Confissão de Fé de Westminster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            A Confissão de Fé de Westminster foi elaborada pela Assembleia de Westminster 
            entre 1643 e 1649, constituindo uma das mais importantes declarações doutrinárias 
            do cristianismo reformado.
          </p>
          
          <div className="max-w-md mx-auto flex gap-2">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar na Confissão de Fé..."
              value={searchQuery}
            />
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todos como lido
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-8">
          {filteredContent.map((chapter) => (
            <div key={chapter.id} id={chapter.id.toString()} className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3">
                Capítulo {chapter.id}: {chapter.title}
              </h2>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {chapter.articles.map((article) => (
                  <ContentCard
                    key={`${chapter.id}-${article.id}`}
                    id={chapter.id}
                    title={`Artigo ${article.id}`}
                    content={article.text}
                    references={article.scriptureReferences}
                    isCompleted={progress.confessionChapters.includes(chapter.id)}
                    onMarkAsRead={() => markConfessionChapterAsRead(chapter.id)}
                    searchQuery={searchQuery}
                    baseUrl="/confissao"
                  />
                ))}
              </div>
            </div>
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
              Capítulos concluídos: {progress.confessionChapters.length} de {confession.length}
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(progress.confessionChapters.length / confession.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}