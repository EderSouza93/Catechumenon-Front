'use client';

import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/ui/SearchBar';
import ContentCard from '@/components/ui/ContentCard';
import { useProgress } from '@/hooks/useProgress';
import confessionData from '@/data/confession.json';
import { ConfessionChapter } from '@/types';
import { paginate } from '@/utils/paginate';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConfessionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const { progress, toggleConfessionSectionAsRead, isLoading } = useProgress();

  const confession = confessionData as ConfessionChapter[];

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

  const paginatedContent = useMemo(() => {
    return paginate(filteredContent, currentPage, pageSize);
  }, [filteredContent, currentPage]);

  const totalPages = Math.ceil(filteredContent.length / pageSize);

  const renderSkeletons = () => (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-6">
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
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
            
            <div className="max-w-md mx-auto">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar na Confissão de Fé..."
                value={searchQuery}
              />
            </div>
          </div>

          {isLoading ? renderSkeletons() : (
            <>
              {/* Content Grid */}
              <div className="space-y-8">
                {paginatedContent.map((chapter) => (
                  <div key={chapter.id} className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3">
                      Capítulo {chapter.id}: {chapter.title}
                    </h2>
                    
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      {chapter.articles.map((article) => {
                        return (
                          <ContentCard
                            key={`${chapter.id}-${article.id}`}
                            title={`Seção ${article.id}`}
                            content={article.text}
                            sections={article.sections}
                            references={article.scriptureReferences}
                            isCompleted={progress.confessionSections.includes(`${chapter.id}-${article.id}`)}
                            onMarkAsRead={() => toggleConfessionSectionAsRead(chapter.id, article.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              <div className='mt-8 flex justify-center space-x-4'>
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`px-4 py-2 rounded transition-colors duration-200 
                    ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-700'}
                  `}
                >
                  Anterior
                </Button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`px-4 py-2 rounded transition-colors duration-200 
                    ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-700'}
                  `}
                >
                  Próximo
                </Button>
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
            </>
          )}
        </div>
      </Layout>
    </>
  );
}