'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, HelpCircle, FileText } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import confessionData from '@/data/confession.json';
import largerCatechismData from '@/data/larger-catechism.json';
import shorterCatechismData from '@/data/shorter-catechism.json';
import { ConfessionChapter, CatechismQuestion } from '@/types';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const MAX_RESULTS_PER_GROUP = 8;

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const confession = confessionData as ConfessionChapter[];
  const largerCatechism = largerCatechismData as CatechismQuestion[];
  const shorterCatechism = shorterCatechismData as CatechismQuestion[];

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { confession: [], larger: [], shorter: [] };

    const confessionResults: SearchResult[] = [];
    for (const chapter of confession) {
      if (confessionResults.length >= MAX_RESULTS_PER_GROUP) break;
      const titleMatch = chapter.title.toLowerCase().includes(q);
      const matchingArticle = chapter.articles.find((a) =>
        a.text.toLowerCase().includes(q)
      );
      if (titleMatch || matchingArticle) {
        confessionResults.push({
          id: `conf-${chapter.id}`,
          title: `Capítulo ${chapter.id}: ${chapter.title}`,
          subtitle: matchingArticle
            ? matchingArticle.text.substring(0, 100) + '...'
            : chapter.articles[0]?.text.substring(0, 100) + '...',
          href: '/confissao',
        });
      }
    }

    const largerResults: SearchResult[] = [];
    for (const item of largerCatechism) {
      if (largerResults.length >= MAX_RESULTS_PER_GROUP) break;
      const questionMatch = item.question.toLowerCase().includes(q);
      const answerMatch = item.answer.toLowerCase().includes(q);
      if (questionMatch || answerMatch) {
        largerResults.push({
          id: `lc-${item.id}`,
          title: `Pergunta ${item.id}`,
          subtitle: item.question.substring(0, 100) + (item.question.length > 100 ? '...' : ''),
          href: '/catecismo-maior',
        });
      }
    }

    const shorterResults: SearchResult[] = [];
    for (const item of shorterCatechism) {
      if (shorterResults.length >= MAX_RESULTS_PER_GROUP) break;
      const questionMatch = item.question.toLowerCase().includes(q);
      const answerMatch = item.answer.toLowerCase().includes(q);
      if (questionMatch || answerMatch) {
        shorterResults.push({
          id: `sc-${item.id}`,
          title: `Pergunta ${item.id}`,
          subtitle: item.question.substring(0, 100) + (item.question.length > 100 ? '...' : ''),
          href: '/catecismo-menor',
        });
      }
    }

    return {
      confession: confessionResults,
      larger: largerResults,
      shorter: shorterResults,
    };
  }, [query, confession, largerCatechism, shorterCatechism]);

  const hasResults =
    results.confession.length > 0 ||
    results.larger.length > 0 ||
    results.shorter.length > 0;

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">Buscar em todos os documentos</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Buscar em todos os documentos..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.trim() && !hasResults && (
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            )}

            {results.confession.length > 0 && (
              <CommandGroup heading="Confissão de Fé">
                {results.confession.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <Book className="mr-2 h-4 w-4 shrink-0 text-blue-500" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{item.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.larger.length > 0 && (
              <CommandGroup heading="Catecismo Maior">
                {results.larger.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{item.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.shorter.length > 0 && (
              <CommandGroup heading="Catecismo Menor">
                {results.shorter.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <FileText className="mr-2 h-4 w-4 shrink-0 text-purple-500" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{item.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
