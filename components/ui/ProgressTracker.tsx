'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Book, HelpCircle } from 'lucide-react';

interface ProgressTrackerProps {
  confessionChaptersCompleted: number;
  totalConfessionChapters: number;
  largerCatechismCompleted: number;
  totalLargerCatechism: number;
  shorterCatechismCompleted: number;
  totalShorterCatechism: number;
}

function pct(done: number, total: number): number {
  if (total <= 0) return 0;
  return (done / total) * 100;
}

export default function ProgressTracker({
  confessionChaptersCompleted,
  totalConfessionChapters,
  largerCatechismCompleted,
  totalLargerCatechism,
  shorterCatechismCompleted,
  totalShorterCatechism,
}: ProgressTrackerProps) {
  const confessionProgress = pct(confessionChaptersCompleted, totalConfessionChapters);
  const largerCatechismProgress = pct(largerCatechismCompleted, totalLargerCatechism);
  const shorterCatechismProgress = pct(shorterCatechismCompleted, totalShorterCatechism);

  const overallProgress = pct(
    confessionChaptersCompleted + largerCatechismCompleted + shorterCatechismCompleted,
    totalConfessionChapters + totalLargerCatechism + totalShorterCatechism,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Progresso de Estudos
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Book className="h-4 w-4 text-doc-confession" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Confissão de Fé</span>
                <span className="text-xs text-muted-foreground">
                  {confessionChaptersCompleted}/{totalConfessionChapters}
                </span>
              </div>
              <Progress value={confessionProgress} className="h-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-doc-catecismo-maior" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Catecismo Maior</span>
                <span className="text-xs text-muted-foreground">
                  {largerCatechismCompleted}/{totalLargerCatechism}
                </span>
              </div>
              <Progress value={largerCatechismProgress} className="h-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-doc-catecismo-menor" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Catecismo Menor</span>
                <span className="text-xs text-muted-foreground">
                  {shorterCatechismCompleted}/{totalShorterCatechism}
                </span>
              </div>
              <Progress value={shorterCatechismProgress} className="h-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
