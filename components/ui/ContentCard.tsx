import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from '@/components/ui/dialog';

interface ContentCardProps {
  title: string;
  content: string;
  subtitle?: string;
  references?: string[];
  isCompleted?: boolean;
  onMarkAsRead?: (read: boolean) => void;
}

export default function ContentCard({
  title,
  content,
  subtitle,
  references,
  isCompleted = false,
  onMarkAsRead
}: ContentCardProps) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(isCompleted);

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
            {read ? (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {content}
                </p>
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
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
            {content}
          </p>
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
          <DialogFooter>
            {!read && (
              <Button variant='secondary' onClick={() => handleDialogClose(true)}>Marcar como lido</Button>
            )}
            <Button variant='outline' onClick={() => handleDialogClose(false)}>Fechar</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}