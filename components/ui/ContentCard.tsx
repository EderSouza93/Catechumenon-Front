import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
              <Badge key={index} variant="outline" className="text-xs">
                {ref}
              </Badge>
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
