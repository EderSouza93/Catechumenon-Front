"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VerseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  isLoading: boolean;
}

export function VerseDialog({
  isOpen,
  onClose,
  title,
  content,
  isLoading,
}: VerseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Versículos obtidos da API bible-api.com (tradução: Almeida).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <p className="whitespace-pre-wrap">{content || "Nenhum conteúdo para exibir."}</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}