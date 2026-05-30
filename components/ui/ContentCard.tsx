import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { bibleClient } from '@/services/bibleClient';
import HighlightText from '@/components/ui/HighlightText';

interface Section {
  title: string;
  items: string[];
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
  searchQuery?: string;
}

function toColumns(items: string[], columns = 3): string[][] {
  const flat = items.filter(Boolean);
  const cols: string[][] = Array.from({ length: columns }, () => []);
  flat.forEach((item, i) => {
    cols[i % columns].push(item);
  });
  return cols;
}

function SectionGrid({ section }: { section: Section }) {
  const cols = useMemo(
    () => toColumns(section.items, section.columns ?? 3),
    [section.items, section.columns]
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
      const data = await bibleClient.getReference(reference);
      if (data.text) {
        setContent(data.text.trim());
      } else {
        setContent("O texto para esta referência não foi encontrado.");
      }
    } catch (error) {
      console.error(`Erro ao buscar a referência "${reference}":`, error);
      setContent('Falha ao carregar referência biblica');
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
  onMarkAsRead,
  searchQuery = '',
}: ContentCardProps) {
  const [read, setRead] = useState(isCompleted);

  const hasSections = Array.isArray(sections) && sections.length > 0;

  const handleToggleRead = () => {
    setRead((prev) => !prev);
    onMarkAsRead?.(!read);
  };

  const Body = (
    <>
      {content && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          <HighlightText text={content} query={searchQuery} />
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
    <Card
      className={`transition-all duration-200 hover:shadow-warm-lg ${
        read ? 'ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              <HighlightText text={title} query={searchQuery} />
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                <HighlightText text={subtitle} query={searchQuery} />
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleToggleRead}
            aria-pressed={read}
            aria-label={read ? 'Desmarcar como lido' : 'Marcar como lido'}
            className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Badge
              variant={read ? 'secondary' : 'outline'}
              className={`cursor-pointer transition-colors ${
                read
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {read ? 'Lido' : 'Marcar como lido'}
            </Badge>
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {Body}
      </CardContent>
    </Card>
  );
}
