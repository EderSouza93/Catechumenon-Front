'use client';

import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthProvider';
import { useProgress } from '@/hooks/useProgress';
import ProgressTracker from '@/components/ui/ProgressTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const TOTAL_CONFESSION_CHAPTERS = 33;
const TOTAL_LARGER_CATECHISM = 196;
const TOTAL_SHORTER_CATECHISM = 107;

const documents = [
  {
    title: 'Confissão de Fé',
    description: '33 capítulos sobre as doutrinas cristãs reformadas',
    href: '/confissao',
    icon: Book,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    title: 'Catecismo Maior',
    description: '196 perguntas e respostas detalhadas',
    href: '/catecismo-maior',
    icon: HelpCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    title: 'Catecismo Menor',
    description: '107 perguntas essenciais da fé',
    href: '/catecismo-menor',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { progress, isLoading: progressLoading } = useProgress();

  const isLoading = authLoading || progressLoading;

  const getLastAccessed = () => {
    const items = [];
    if (progress.confessionChapters.length > 0) {
      items.push({
        label: 'Confissão de Fé',
        detail: `${progress.confessionChapters.length} capítulos lidos`,
        href: '/confissao',
      });
    }
    if (progress.largerCatechism.length > 0) {
      items.push({
        label: 'Catecismo Maior',
        detail: `${progress.largerCatechism.length} perguntas estudadas`,
        href: '/catecismo-maior',
      });
    }
    if (progress.shorterCatechism.length > 0) {
      items.push({
        label: 'Catecismo Menor',
        detail: `${progress.shorterCatechism.length} perguntas estudadas`,
        href: '/catecismo-menor',
      });
    }
    return items;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Greeting */}
        <div className="mb-8">
          {isLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <h1 className="text-3xl font-bold text-foreground">
              Olá, {user?.name || 'Estudante'}!
            </h1>
          )}
          <p className="text-muted-foreground mt-2">
            Bem-vindo de volta. Continue seus estudos de onde parou.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content (left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue where you left off */}
            {!isLoading && getLastAccessed().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Continue de onde parou</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getLastAccessed().map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick access cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Documentos</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {documents.map((doc) => (
                  <Card key={doc.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`w-10 h-10 ${doc.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                        <doc.icon className={`h-5 w-5 ${doc.color}`} />
                      </div>
                      <CardTitle className="text-base">{doc.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {doc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full" size="sm" variant="outline">
                        <Link href={doc.href}>Estudar</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Tracker (right col) */}
          <div>
            <ProgressTracker
              totalConfessionChapters={TOTAL_CONFESSION_CHAPTERS}
              totalLargerCatechism={TOTAL_LARGER_CATECHISM}
              totalShorterCatechism={TOTAL_SHORTER_CATECHISM}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
