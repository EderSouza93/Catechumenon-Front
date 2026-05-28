'use client';

import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center items-center space-x-4">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant={currentPage === 1 ? 'outline' : 'default'}
      >
        Anterior
      </Button>
      <span className="text-sm font-medium">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant={currentPage === totalPages ? 'outline' : 'default'}
      >
        Próximo
      </Button>
    </div>
  );
}
