'use client';

import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/ui/SearchBar';
import ContentCard from '@/components/ui/ContentCard';
import { useProgress } from '@/hooks/useProgress';
import { useShorterCatechism } from '@/hooks/useShorterCatechism';
import { useDocumentsSearch } from '@/hooks/useDocumentsSearch';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/ui/PaginationControls';
import { SearchDocumentType, SearchResultType } from '@/types';

const PAGE_SIZE = 10;

export default function ShorterCatechismPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isSearching = searchQuery.trim().length >= 2;

  const { progress, resume, toggleShorterCatechism, isLoading } = useProgress();

  const [resumeTargetPage, setResumeTargetPage] = useState<number | null>(null);
  const hasRestoredRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const list = useShorterCatechism({
    page: isSearching ? 1 : currentPage,
    limit: PAGE_SIZE,
  });
  const search = useDocumentsSearch({
    q: searchQuery,
    type: SearchDocumentType.Shorter,
    page: currentPage,
    limit: PAGE_SIZE,
    enabled: isSearching,
  });

  const isFetching = isSearching ? search.isLoading : list.isLoading;
  const fetchError = isSearching ? search.isError : list.isError;
  const total = isSearching ? search.total : list.total;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    if (hasRestoredRef.current || isSearching) return;
    if (isLoading || list.isLoading || total === 0) return;

    hasRestoredRef.current = true;

    const next = resume.shorterCatechism;
    if (!next) return;

    const targetPage = Math.min(Math.ceil(next.number / PAGE_SIZE), totalPages);
    setResumeTargetPage(targetPage);
    if (targetPage !== currentPage) setCurrentPage(targetPage);
  }, [isSearching, isLoading, list.isLoading, total, totalPages, currentPage, resume.shorterCatechism]);

  useEffect(() => {
    if (resumeTargetPage === null || hasScrolledRef.current) return;
    if (isSearching || currentPage !== resumeTargetPage) return;
    if (list.isLoading || list.items.length === 0) return;

    if (Math.ceil(list.items[0].number / PAGE_SIZE) !== resumeTargetPage) return;

    hasScrolledRef.current = true;
    const next = resume.shorterCatechism;
    if (next) {
      const el = document.getElementById(`q-${next.number}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [resumeTargetPage, currentPage, isSearching, list.isLoading, list.items, resume.shorterCatechism]);

  const renderSkeletons = () => (
    <div className="grid gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-56 w-full rounded-xl" />
      ))}
    </div>
  );

  const renderCards = () => {
    if (isSearching) {
      return search.results
        .filter((r) => r.type === SearchResultType.ShorterCatechism)
        .map((r) => {
          const number = 'number' in r ? r.number : 0;
          return (
            <ContentCard
              key={r.id}
              title={`Pergunta ${number}`}
              content={r.snippet}
              isCompleted={progress.shorterCatechism.includes(r.id)}
              onMarkAsRead={() => toggleShorterCatechism(r.id)}
              searchQuery={searchQuery}
            />
          );
        });
    }
    return list.items.map((question) => (
      <div key={question.id} id={`q-${question.number}`} className="scroll-mt-24">
        <ContentCard
          title={`Pergunta ${question.number}`}
          subtitle={question.question}
          content={question.answer}
          references={question.bibleRefs}
          isCompleted={progress.shorterCatechism.includes(question.id)}
          onMarkAsRead={() => toggleShorterCatechism(question.id)}
          searchQuery={searchQuery}
        />
      </div>
    ));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4 text-balance">
            Catecismo Menor de Westminster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 font-body leading-relaxed">
            O Catecismo Menor foi projetado para instrução básica na fé cristã,
            apresentando as verdades fundamentais em formato conciso e memorável
            através de 107 perguntas e respostas essenciais.
          </p>

          <div className="max-w-md mx-auto">
            <SearchBar
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Buscar no Catecismo Menor..."
              value={searchQuery}
            />
          </div>
        </div>

        {isLoading || isFetching ? renderSkeletons() : fetchError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">
              Não foi possível carregar o Catecismo Menor. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {renderCards()}
            </div>

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

            {!isSearching && (
              <div className="mt-16 text-center">
                <div className="bg-secondary rounded-lg p-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Perguntas estudadas: {progress.shorterCatechism.length} de {total}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-doc-catecismo-menor h-2 rounded-full transition-all duration-300"
                      style={{
                        width: total > 0
                          ? `${(progress.shorterCatechism.length / total) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
