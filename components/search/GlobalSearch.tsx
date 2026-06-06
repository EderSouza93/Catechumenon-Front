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
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SearchResultType, type UnifiedSearchItem } from '@/types';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_RESULTS_PER_GROUP = 8;

function resultTitle(item: UnifiedSearchItem): string {
  if (item.title) return item.title;
  if (item.type === SearchResultType.ConfessionArticle) {
    const ref = item.ref;
    return ref ? `Confissão ${ref.chapterNumber}.${ref.articleNumber}` : 'Confissão';
  }
  const ref = item.ref;
  return ref ? `Pergunta ${ref.number}` : 'Pergunta';
}

function hrefForItem(item: UnifiedSearchItem): string {
  if (item.type === SearchResultType.ConfessionArticle) {
    return item.ref
      ? `/confissao?chapter=${item.ref.chapterNumber}&article=${item.id}`
      : '/confissao';
  }
  const base =
    item.type === SearchResultType.LargerCatechism ? '/catecismo-maior' : '/catecismo-menor';
  return item.ref ? `${base}?question=${item.ref.number}` : base;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setDebounced('');
    }
  }, [open]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { results } = useGlobalSearch({
    q: debounced,
    limit: 24,
    enabled: open && debounced.trim().length >= 2,
  });

  const grouped = useMemo(() => {
    const confession: UnifiedSearchItem[] = [];
    const larger: UnifiedSearchItem[] = [];
    const shorter: UnifiedSearchItem[] = [];
    for (const item of results) {
      if (item.type === SearchResultType.ConfessionArticle) confession.push(item);
      else if (item.type === SearchResultType.LargerCatechism) larger.push(item);
      else shorter.push(item);
    }
    return {
      confession: confession.slice(0, MAX_RESULTS_PER_GROUP),
      larger: larger.slice(0, MAX_RESULTS_PER_GROUP),
      shorter: shorter.slice(0, MAX_RESULTS_PER_GROUP),
    };
  }, [results]);

  const hasResults =
    grouped.confession.length > 0 ||
    grouped.larger.length > 0 ||
    grouped.shorter.length > 0;

  const handleSelect = (item: UnifiedSearchItem) => {
    onOpenChange(false);
    router.push(hrefForItem(item));
  };

  const renderItem = (item: UnifiedSearchItem) => (
    <CommandItem
      key={item.id}
      value={item.id}
      onSelect={() => handleSelect(item)}
    >
      {item.type === SearchResultType.ConfessionArticle ? (
        <Book className="mr-2 h-4 w-4 shrink-0 text-doc-confession" />
      ) : item.type === SearchResultType.LargerCatechism ? (
        <HelpCircle className="mr-2 h-4 w-4 shrink-0 text-doc-catecismo-maior" />
      ) : (
        <FileText className="mr-2 h-4 w-4 shrink-0 text-doc-catecismo-menor" />
      )}
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium truncate">{resultTitle(item)}</span>
        <span className="text-xs text-muted-foreground truncate">{item.snippet}</span>
      </div>
    </CommandItem>
  );

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
            {query.trim().length >= 2 && !hasResults && (
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            )}

            {grouped.confession.length > 0 && (
              <CommandGroup heading="Confissão de Fé">
                {grouped.confession.map(renderItem)}
              </CommandGroup>
            )}

            {grouped.larger.length > 0 && (
              <CommandGroup heading="Catecismo Maior">
                {grouped.larger.map(renderItem)}
              </CommandGroup>
            )}

            {grouped.shorter.length > 0 && (
              <CommandGroup heading="Catecismo Menor">
                {grouped.shorter.map(renderItem)}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
