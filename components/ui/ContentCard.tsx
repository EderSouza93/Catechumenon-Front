import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { getBibleUrl } from '@/lib/bibleUtils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';

interface ContentCardProps {
  id: number;
  title: string;
  content: string;
  subtitle?: string;
  references?: string[];
  isCompleted?: boolean;
  onMarkAsRead?: (read: boolean) => void;
  searchQuery?: string;
  baseUrl: string;
}

export default function ContentCard({
  id,
  title,
  content,
  subtitle,
  references,
  isCompleted = false,
  onMarkAsRead,
  searchQuery,
  baseUrl
}: ContentCardProps) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(isCompleted);
  const [copiedText, copy] = useCopyToClipboard();
  const { toast } = useToast();

  const handleClick = () => {
      setOpen(true);
  };

  const handleDialogClose = (markRead: boolean) => {
    setOpen(false);
    if (markRead && !read) {
      setRead(true);
      onMarkAsRead?.(true);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}${baseUrl}#${id}`;
    copy(url);
    toast({
      title: "Link copiado!",
      description: "O link para este conteúdo foi copiado para a sua área de transferência.",
    });
  };

  const highlightText = (text: string, query?: string) => {
    if (!query || !text) {
      return text;
    }
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderReferences = () => (
    <>
      {references && references.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Referências:</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {references.map((ref, index) => (
              <a
                key={index}
                href={getBibleUrl(ref)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                onClick={(e) => e.stopPropagation()} // Impede que o clique no link abra o diálogo
              >
                {ref}
              </a>
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
          id={id.toString()}
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
                  <p className="text-sm text-muted-foreground mt-1">{highlightText(subtitle, searchQuery)}</p>
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
            {read ? (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {highlightText(content, searchQuery)}
                </p>
                {renderReferences()}
              </>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Responder
              </p>
            )}
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{highlightText(subtitle, searchQuery)}</p>
          )}
          <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
            {highlightText(content, searchQuery)}
          </p>
          {renderReferences()}
          <DialogFooter>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            {!read && (
              <Button variant='secondary' onClick={() => handleDialogClose(true)}>Marcar como lido</Button>
            )}
            <Button variant='outline' onClick={() => handleDialogClose(false)}>Fechar</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}