'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Book, HelpCircle } from 'lucide-react';
import { ReadingProgress } from '@/types';

interface ProgressTrackerProps {
  totalConfessionChapters: number;
  totalLargerCatechism: number;
  totalShorterCatechism: number;
}

export default function ProgressTracker({
  totalConfessionChapters,
  totalLargerCatechism,
  totalShorterCatechism
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ReadingProgress>({
    confessionChapters: [],
    confessionSections: [],
    largerCatechism: [],
    shorterCatechism: []
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem('westminster-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const confessionProgress = (progress.confessionChapters.length / totalConfessionChapters) * 100;
  const largerCatechismProgress = (progress.largerCatechism.length / totalLargerCatechism) * 100;
  const shorterCatechismProgress = (progress.shorterCatechism.length / totalShorterCatechism) * 100;

  const overallProgress = (
    (progress.confessionChapters.length + progress.largerCatechism.length + progress.shorterCatechism.length) /
    (totalConfessionChapters + totalLargerCatechism + totalShorterCatechism)
  ) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-amber-600" />
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
            <Book className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Confissão de Fé</span>
                <span className="text-xs text-muted-foreground">
                  {progress.confessionChapters.length}/{totalConfessionChapters}
                </span>
              </div>
              <Progress value={confessionProgress} className="h-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Catecismo Maior</span>
                <span className="text-xs text-muted-foreground">
                  {progress.largerCatechism.length}/{totalLargerCatechism}
                </span>
              </div>
              <Progress value={largerCatechismProgress} className="h-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-purple-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Catecismo Menor</span>
                <span className="text-xs text-muted-foreground">
                  {progress.shorterCatechism.length}/{totalShorterCatechism}
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