'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/ui/SearchBar';
import ContentCard from '@/components/ui/ContentCard';
import { useProgress } from '@/hooks/useProgress';
import { useConfession } from '@/hooks/useConfession';
import { useDocumentsSearch } from '@/hooks/useDocumentsSearch';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/ui/PaginationControls';
import { SearchDocumentType, SearchResultType } from '@/types';

const PAGE_SIZE = 1;
const SEARCH_PAGE_SIZE = 10;

export default function ConfessionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isSearching = searchQuery.trim().length >= 2;

  const { progress, toggleConfessionArticle, isLoading } = useProgress();

  const list = useConfession({
    page: isSearching ? 1 : currentPage,
    limit: PAGE_SIZE,
  });
  const search = useDocumentsSearch({
    q: searchQuery,
    type: SearchDocumentType.Confession,
    page: currentPage,
    limit: SEARCH_PAGE_SIZE,
    enabled: isSearching,
  });

  const isFetching = isSearching ? search.isLoading : list.isLoading;
  const fetchError = isSearching ? search.isError : list.isError;
  const total = isSearching ? search.total : list.total;
  const pageSize = isSearching ? SEARCH_PAGE_SIZE : PAGE_SIZE;
  const totalPages = Math.ceil(total / pageSize);

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

  const renderSearchResults = () => (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {search.results
        .filter((r) => r.type === SearchResultType.ConfessionArticle)
        .map((r) => {
          if (r.type !== SearchResultType.ConfessionArticle) return null;
          return (
            <ContentCard
              key={r.id}
              title={`Capítulo ${r.chapterNumber} – Seção ${r.articleNumber}`}
              content={r.snippet}
              isCompleted={progress.confessionArticles.includes(r.id)}
              onMarkAsRead={() => toggleConfessionArticle(r.id)}
              searchQuery={searchQuery}
            />
          );
        })}
    </div>
  );

  const renderList = () => (
    <div className="space-y-8">
      {list.items.map((chapter) => {
        const totalArticles = chapter.articles.length;
        const articlesRead = chapter.articles.reduce(
          (count, article) =>
            progress.confessionArticles.includes(article.id) ? count + 1 : count,
          0,
        );
        const chapterProgress = totalArticles > 0 ? (articlesRead / totalArticles) * 100 : 0;

        return (
          <div key={chapter.id} className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-3">
              Capítulo {chapter.number}: {chapter.title}
            </h2>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {chapter.articles.map((article) => (
                <ContentCard
                  key={article.id}
                  title={`Seção ${article.number}`}
                  content={article.text}
                  sections={article.sections ?? undefined}
                  references={article.bibleRefs}
                  isCompleted={progress.confessionArticles.includes(article.id)}
                  onMarkAsRead={() => toggleConfessionArticle(article.id)}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {totalArticles > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Capítulo {chapter.number}: {articlesRead} de {totalArticles} artigos lidos
                  {articlesRead === totalArticles && <span> · concluído</span>}
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-doc-confession h-2 rounded-full transition-all duration-300"
                    style={{ width: `${chapterProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4 text-balance">
            Confissão de Fé de Westminster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 font-body leading-relaxed">
            A Confissão de Fé de Westminster foi elaborada pela Assembleia de Westminster
            entre 1643 e 1649, constituindo uma das mais importantes declarações doutrinárias
            do cristianismo reformado.
          </p>

          <div className="max-w-md mx-auto">
            <SearchBar
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Buscar na Confissão de Fé..."
              value={searchQuery}
            />
          </div>
        </div>

        {isLoading || isFetching ? renderSkeletons() : fetchError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">
              Não foi possível carregar a Confissão de Fé. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <>
            {isSearching ? renderSearchResults() : renderList()}

            {total > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {total === 0 && isSearching && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-body">
                  Nenhum resultado encontrado para &quot;{searchQuery}&quot;.
                </p>
              </div>
            )}

          </>
        )}
      </div>
    </Layout>
  );
}
