'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const [viewingResult, setViewingResult] = useState(false);
  const searchActive = searchQuery.trim().length >= 2;
  const showSearchResults = searchActive && !viewingResult;
  const preSearchRef = useRef<{ page: number; scrollY: number } | null>(null);

  const { progress, resume, toggleConfessionArticle, isLoading } = useProgress();

  const router = useRouter();
  const searchParams = useSearchParams();
  const deepLinkChapter = searchParams.get('chapter');
  const deepLinkArticle = searchParams.get('article');
  const lastDeepLinkRef = useRef<string | null>(null);
  const restoringRef = useRef(false);

  const [resumeTargetPage, setResumeTargetPage] = useState<number | null>(null);
  const hasRestoredRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const handleSearchInput = (q: string) => {
    const active = q.trim().length >= 2;
    if (active && !searchActive) {
      preSearchRef.current = { page: currentPage, scrollY: window.scrollY };
    }
    setViewingResult(false);
    setSearchQuery(q);
    if (active) {
      setCurrentPage(1);
    } else if (searchActive) {
      const prev = preSearchRef.current;
      restoringRef.current = true;
      hasRestoredRef.current = true;
      if (deepLinkChapter) router.replace('/confissao');
      setCurrentPage(prev?.page ?? 1);
      if (prev) requestAnimationFrame(() => window.scrollTo({ top: prev.scrollY }));
      preSearchRef.current = null;
    }
  };

  const list = useConfession({
    page: showSearchResults ? 1 : currentPage,
    limit: PAGE_SIZE,
  });
  const search = useDocumentsSearch({
    q: searchQuery,
    type: SearchDocumentType.Confession,
    page: currentPage,
    limit: SEARCH_PAGE_SIZE,
    enabled: searchActive,
  });

  const isFetching = showSearchResults ? search.isLoading : list.isLoading;
  const fetchError = showSearchResults ? search.isError : list.isError;
  const total = showSearchResults ? search.total : list.total;
  const pageSize = showSearchResults ? SEARCH_PAGE_SIZE : PAGE_SIZE;
  const totalPages = Math.ceil(total / pageSize);

  // Navegação via busca global: abre o capítulo e rola até o artigo da URL.
  useEffect(() => {
    if (restoringRef.current) {
      if (!deepLinkChapter) restoringRef.current = false;
      return;
    }
    if (!deepLinkChapter || showSearchResults) return;
    if (list.isLoading || total === 0) return;
    const chapterNumber = Number(deepLinkChapter);
    if (!Number.isFinite(chapterNumber) || chapterNumber <= 0) return;

    const targetPage = Math.min(chapterNumber, totalPages);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
      return;
    }
    const chapter = list.items[0];
    if (!chapter || chapter.number !== targetPage) return;
    if (lastDeepLinkRef.current === deepLinkArticle) return;

    lastDeepLinkRef.current = deepLinkArticle;
    if (deepLinkArticle) {
      document
        .getElementById(`a-${deepLinkArticle}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [deepLinkChapter, deepLinkArticle, showSearchResults, list.isLoading, list.items, total, totalPages, currentPage]);

  useEffect(() => {
    if (deepLinkChapter) return;
    if (hasRestoredRef.current || searchActive) return;
    if (isLoading || list.isLoading || total === 0) return;

    hasRestoredRef.current = true;

    const next = resume.confession;
    if (!next) return;

    const targetPage = Math.min(next.chapterNumber, totalPages);
    setResumeTargetPage(targetPage);
    if (targetPage !== currentPage) setCurrentPage(targetPage);
  }, [deepLinkChapter, searchActive, isLoading, list.isLoading, total, totalPages, currentPage, resume.confession]);

  useEffect(() => {
    if (resumeTargetPage === null || hasScrolledRef.current) return;
    if (searchActive || currentPage !== resumeTargetPage) return;
    if (list.isLoading || list.items.length === 0) return;

    const chapter = list.items[0];
    if (!chapter || chapter.number !== resumeTargetPage) return;

    hasScrolledRef.current = true;
    const next = resume.confession;
    if (next) {
      const el = document.getElementById(`a-${next.articleId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [resumeTargetPage, currentPage, searchActive, list.isLoading, list.items, resume.confession]);

  const renderSkeletons = () => (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-6">
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <div className="grid gap-6">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSearchResults = () => (
    <div className="grid gap-6">
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
              onClick={() => {
                setViewingResult(true);
                router.push(`/confissao?chapter=${r.chapterNumber}&article=${r.id}`);
              }}
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

            <div className="grid gap-6">
              {chapter.articles.map((article) => (
                <div key={article.id} id={`a-${article.id}`} className="scroll-mt-24">
                  <ContentCard
                    title={`Seção ${article.number}`}
                    content={article.text}
                    sections={article.sections ?? undefined}
                    references={article.bibleRefs}
                    isCompleted={progress.confessionArticles.includes(article.id)}
                    onMarkAsRead={() => toggleConfessionArticle(article.id)}
                    searchQuery={searchQuery}
                  />
                </div>
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
              onSearch={handleSearchInput}
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
            {showSearchResults ? renderSearchResults() : renderList()}

            {total > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {total === 0 && showSearchResults && (
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
