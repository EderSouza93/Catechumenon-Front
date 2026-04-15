import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Book, Globe, Headphones } from 'lucide-react';
import resourcesData from '@/data/resources.json';
import { Resource } from '@/types';

const getIconForType = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5" />;
    case 'book':
      return <Book className="h-5 w-5" />;
    case 'website':
      return <Globe className="h-5 w-5" />;
    case 'audio':
      return <Headphones className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'bg-doc-confession/10 text-doc-confession';
    case 'book':
      return 'bg-doc-catecismo-maior/10 text-doc-catecismo-maior';
    case 'website':
      return 'bg-doc-catecismo-menor/10 text-doc-catecismo-menor';
    case 'audio':
      return 'bg-doc-resources/10 text-doc-resources';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function ResourcesPage() {
  const resources = resourcesData as Resource[];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4 text-balance">
            Recursos de Estudo
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
            Uma coleção cuidadosamente selecionada de materiais complementares
            para aprofundar seus estudos sobre a Confissão de Fé de Westminster
            e os catecismos reformados.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {resources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-warm-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                    {getIconForType(resource.type)}
                  </div>
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="font-body">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Acessar Recurso
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ornamental Divider */}
        <div className="my-16">
          <div className="divider-ornament">
            <span className="text-muted-foreground/40 text-lg font-display">&#10053;</span>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center text-balance">
            Categorias de Recursos
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 stagger-children">
            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <div className="w-16 h-16 bg-doc-confession/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-doc-confession" />
              </div>
              <h3 className="font-semibold mb-2">Documentos PDF</h3>
              <p className="text-sm text-muted-foreground font-body">
                Textos originais e traduções oficiais
              </p>
            </div>

            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <div className="w-16 h-16 bg-doc-catecismo-maior/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-doc-catecismo-maior" />
              </div>
              <h3 className="font-semibold mb-2">Livros e Comentários</h3>
              <p className="text-sm text-muted-foreground font-body">
                Obras teológicas e comentários especializados
              </p>
            </div>

            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <div className="w-16 h-16 bg-doc-catecismo-menor/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-doc-catecismo-menor" />
              </div>
              <h3 className="font-semibold mb-2">Sites Especializados</h3>
              <p className="text-sm text-muted-foreground font-body">
                Portais e recursos online confiáveis
              </p>
            </div>

            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <div className="w-16 h-16 bg-doc-resources/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-doc-resources" />
              </div>
              <h3 className="font-semibold mb-2">Áudios e Palestras</h3>
              <p className="text-sm text-muted-foreground font-body">
                Sermões e estudos em formato de áudio
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-secondary rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-center text-balance">
            Sugestão de Uso
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-4 font-body">
              Para um estudo mais proveitoso, recomendamos a seguinte abordagem:
            </p>
            <ul className="space-y-2 text-muted-foreground font-body">
              <li className="flex items-start">
                <span className="inline-flex w-6 h-6 bg-primary/15 rounded-full text-xs items-center justify-center mr-3 mt-0.5 text-primary font-medium font-ui shrink-0">1</span>
                Leia primeiro o texto da Confissão ou Catecismo diretamente na plataforma
              </li>
              <li className="flex items-start">
                <span className="inline-flex w-6 h-6 bg-primary/15 rounded-full text-xs items-center justify-center mr-3 mt-0.5 text-primary font-medium font-ui shrink-0">2</span>
                Consulte os comentários e materiais complementares para aprofundamento
              </li>
              <li className="flex items-start">
                <span className="inline-flex w-6 h-6 bg-primary/15 rounded-full text-xs items-center justify-center mr-3 mt-0.5 text-primary font-medium font-ui shrink-0">3</span>
                Use os recursos de áudio para reforçar o aprendizado durante outras atividades
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
