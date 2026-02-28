"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/ui/SearchBar";
import ContentCard from "@/components/ui/ContentCard";
import { useProgress } from "@/hooks/useProgress";
import largerCatechismData from "@/data/larger-catechism.json";
import { CatechismQuestion } from "@/types";
import { paginate } from "@/utils/paginate"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PaginationControls from "@/components/ui/PaginationControls";

export default function LargerCatechismPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { progress, markLargerCatechismAsRead, isLoading } = useProgress();

  const catechism = largerCatechismData as CatechismQuestion[];

  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return catechism;

    return catechism.filter((item) => {
      const questionMatch = item.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const answerMatch = item.answer
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return questionMatch || answerMatch;
    });
  }, [searchQuery, catechism]);

  const paginatedContent = useMemo(() => {
    return paginate(filteredContent, currentPage, pageSize);
  }, [filteredContent, currentPage]);

  const totalPages = Math.ceil(filteredContent.length / pageSize);

  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-56 w-full rounded-xl" />
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Catecismo Maior de Westminster
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            O Catecismo Maior foi criado para pastores e professores, oferecendo
            explanações mais detalhadas e completas das doutrinas cristãs
            fundamentais através de 196 perguntas e respostas.
          </p>

          <div className="max-w-md mx-auto">
            <SearchBar
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Buscar no Catecismo Maior..."
              value={searchQuery}
            />
          </div>
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : (
          <>
            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {paginatedContent.map((question) => (
                <ContentCard
                  key={question.id}
                  title={`Pergunta ${question.id}`}
                  subtitle={question.question}
                  content={question.answer}
                  references={question.scriptureReferences}
                  isCompleted={progress.largerCatechism.includes(question.id)}
                  onMarkAsRead={() => markLargerCatechismAsRead(question.id)}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {/* Paginação */}
            {filteredContent.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum resultado encontrado para {searchQuery}.
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="mt-16 text-center">
              <div className="bg-muted/50 rounded-lg p-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Perguntas estudadas: {progress.largerCatechism.length} de{" "}
                  {catechism.length}
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(progress.largerCatechism.length / catechism.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
