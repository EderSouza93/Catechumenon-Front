import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, HelpCircle, FileText, ExternalLink } from 'lucide-react';
import ProgressTracker from '@/components/ui/ProgressTracker';

const TOTAL_CONFESSION_CHAPTERS = 33;
const TOTAL_LARGER_CATECHISM = 196;
const TOTAL_SHORTER_CATECHISM = 107;

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-6 leading-tight text-balance">
              Confissão de Fé de{' '}
              <span className="text-primary block">Westminster</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-body">
              Uma plataforma dedicada ao estudo sistemático das doutrinas reformadas,
              proporcionando acesso organizado à Confissão de Fé e aos Catecismos de Westminster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/confissao">
                  <Book className="mr-2 h-5 w-5" />
                  Começar Estudos
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/recursos">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Ver Recursos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Ornamental Divider */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="divider-ornament">
            <span className="text-muted-foreground/40 text-lg font-display">&#10053;</span>
          </div>
        </div>

        {/* Documents Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center text-foreground mb-14 text-balance">
              Documentos Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
              <Card className="group hover:shadow-warm-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-doc-confession/10 rounded-lg flex items-center justify-center mb-4">
                    <Book className="h-6 w-6 text-doc-confession" />
                  </div>
                  <CardTitle className="text-xl">Confissão de Fé</CardTitle>
                  <CardDescription className="font-body">
                    33 capítulos abordando as principais doutrinas cristãs reformadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 font-body leading-relaxed">
                    Documento fundamental que expressa sistematicamente as crenças
                    reformadas sobre Deus, salvação, escrituras e vida cristã.
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/confissao">Estudar Agora</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-warm-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-doc-catecismo-maior/10 rounded-lg flex items-center justify-center mb-4">
                    <HelpCircle className="h-6 w-6 text-doc-catecismo-maior" />
                  </div>
                  <CardTitle className="text-xl">Catecismo Maior</CardTitle>
                  <CardDescription className="font-body">
                    196 perguntas e respostas detalhadas sobre a fé cristã
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 font-body leading-relaxed">
                    Explanação mais completa e detalhada das doutrinas,
                    ideal para estudo aprofundado e ensino teológico.
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/catecismo-maior">Explorar</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-warm-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-doc-catecismo-menor/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-doc-catecismo-menor" />
                  </div>
                  <CardTitle className="text-xl">Catecismo Menor</CardTitle>
                  <CardDescription className="font-body">
                    107 perguntas essenciais para instrução básica na fé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 font-body leading-relaxed">
                    Formato conciso e memorável, perfeito para educação cristã
                    básica e memorização das verdades fundamentais.
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/catecismo-menor">Começar</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="py-20 px-4 section-warm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground mb-4 text-balance">
                Acompanhe seu Progresso
              </h2>
              <p className="text-muted-foreground font-body">
                Mantenha registro dos seus estudos e celebre cada etapa concluída
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <ProgressTracker
                totalConfessionChapters={TOTAL_CONFESSION_CHAPTERS}
                totalLargerCatechism={TOTAL_LARGER_CATECHISM}
                totalShorterCatechism={TOTAL_SHORTER_CATECHISM}
              />
            </div>
          </div>
        </section>

        {/* Ornamental Divider */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="divider-ornament">
            <span className="text-muted-foreground/40 text-lg font-display">&#10053;</span>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center text-foreground mb-14 text-balance">
              Recursos para Estudo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-children">
              <div className="text-center">
                <div className="w-16 h-16 bg-doc-confession/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Book className="h-8 w-8 text-doc-confession" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Navegação Intuitiva</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  Interface limpa e organizada para facilitar o acesso aos conteúdos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-doc-catecismo-maior/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FileText className="h-8 w-8 text-doc-catecismo-maior" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Busca Avançada</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  Encontre rapidamente qualquer tópico ou versículo em todos os documentos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-doc-catecismo-menor/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <HelpCircle className="h-8 w-8 text-doc-catecismo-menor" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Progresso Pessoal</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
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
