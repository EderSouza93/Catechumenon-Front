import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getBibleApiUrl } from '@/lib/bibleUtils';

type BooksInput = string[] | string[][];
interface Section {
  title: string;
  books: BooksInput;        
  columns?: number;     
}

interface ContentCardProps {
  title: string;
  content?: string;
  sections?: Section[];
  subtitle?: string;
  references?: string[];
  isCompleted?: boolean;
  onMarkAsRead?: (read: boolean) => void;
}

/** Normaliza books em colunas */
function toColumns(books: BooksInput, columns = 3): string[][] {
  if (Array.isArray(books) && books.length > 0 && Array.isArray(books[0])) {
    return books as string[][];
  }
  const flat = (books as string[]).filter(Boolean);
  const cols: string[][] = Array.from({ length: columns }, () => []);
  flat.forEach((item, i) => {
    cols[i % columns].push(item);
  });
  return cols;
}

function SectionGrid({ section }: { section: Section }) {
  const cols = useMemo(
    () => toColumns(section.books, section.columns ?? 3),
    [section.books, section.columns]
  );

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cols.map((col, colIndex) => (
          <ul key={colIndex} className="space-y-1">
            {col.map((book, bIndex) => (
              <li key={bIndex} className="text-sm text-muted-foreground">
                {book}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

const ReferencePopover = ({ reference }: { reference: string }) => {
  const [content, setContent] = useState<string | null>("Carregando...");
  const [isOpen, setIsOpen] = useState(false);

  const fetchVerse = async () => {
    if (content !== "Carregando...") return;
    try {
      const apiUrl = getBibleApiUrl(reference);
      if (!apiUrl || !apiUrl.includes("reference=")) {
        throw new Error("Referência inválida.");
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.text) {
        setContent(data.text.trim());
      } else {
        setContent("O texto para esta referência não foi encontrado.");
      }
    } catch (error) {
      console.error(`Erro ao buscar a referência "${reference}":`, error);
      setContent(`Falha ao carregar. ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-auto px-2 py-1"
          onClick={(e) => {
            e.stopPropagation();
            fetchVerse();
          }}
        >
          {reference}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()} // Impede que o clique feche o dialog principal
        className="w-80"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{reference}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


export default function ContentCard({
  title,
  content,
  sections,
  subtitle,
  references,
  isCompleted = false,
  onMarkAsRead
}: ContentCardProps) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(isCompleted);

  const hasSections = Array.isArray(sections) && sections.length > 0;

  const handleClick = () => setOpen(true);

  const handleDialogClose = (markRead: boolean) => {
    setOpen(false);
    if (markRead && !read) {
      setRead(true);
      onMarkAsRead?.(true);
    }
  };

  const Body = (
    <>
      {content && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          {content}
        </p>
      )}
      {hasSections && sections!.map((s, i) => <SectionGrid key={i} section={s} />)}

      {references && references.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Referências:</p>
          <div className="flex flex-wrap gap-1">
            {references.map((ref, index) => (
              <ReferencePopover key={index} reference={ref} />
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            read ? 'ring-2 ring-amber-200 bg-amber-50/50 dark:bg-amber-900/10' : ''
          }`}
          onClick={handleClick}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {title}
                </CardTitle>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              {read && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Lido
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {read ? Body : (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Ver mais...
              </p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}

        <ScrollArea className="max-h-[70vh] pr-6">
          {Body}
        </ScrollArea>

        <DialogFooter>
          {!read && (
            <Button variant="secondary" onClick={() => handleDialogClose(true)}>
              Marcar como lido
            </Button>
          )}
          <Button variant="outline" onClick={() => handleDialogClose(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
