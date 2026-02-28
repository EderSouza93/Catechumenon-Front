'use client';

import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, HelpCircle, FileText, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Confissão de Fé de
              <span className="text-amber-600 block">Westminster</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Uma plataforma dedicada ao estudo sistemático das doutrinas reformadas,
              proporcionando acesso organizado à Confissão de Fé e aos Catecismos de Westminster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isLoading && isAuthenticated ? (
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/dashboard">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Ir para o Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                    <Link href="/login">
                      <LogIn className="mr-2 h-5 w-5" />
                      Fazer Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#documentos">
                      <Book className="mr-2 h-5 w-5" />
                      Ver Documentos
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Documents Grid */}
        <section id="documentos" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Documentos Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Confissão de Fé</CardTitle>
                  <CardDescription>
                    33 capítulos abordando as principais doutrinas cristãs reformadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Documento fundamental que expressa sistematicamente as crenças
                    reformadas sobre Deus, salvação, escrituras e vida cristã.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <HelpCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Catecismo Maior</CardTitle>
                  <CardDescription>
                    196 perguntas e respostas detalhadas sobre a fé cristã
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explanação mais completa e detalhada das doutrinas,
                    ideal para estudo aprofundado e ensino teológico.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Catecismo Menor</CardTitle>
                  <CardDescription>
                    107 perguntas essenciais para instrução básica na fé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Formato conciso e memorável, perfeito para educação cristã
                    básica e memorização das verdades fundamentais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Recursos para Estudo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Navegação Intuitiva</h3>
                <p className="text-muted-foreground text-sm">
                  Interface limpa e organizada para facilitar o acesso aos conteúdos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Busca Avançada</h3>
                <p className="text-muted-foreground text-sm">
                  Encontre rapidamente qualquer tópico ou versículo em todos os documentos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Progresso Pessoal</h3>
                <p className="text-muted-foreground text-sm">
                  Acompanhe seu avanço nos estudos com sistema de progresso integrado
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
