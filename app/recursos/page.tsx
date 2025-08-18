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
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'book':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'website':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'audio':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function ResourcesPage() {
  const resources = resourcesData as Resource[];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Recursos de Estudo
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Uma coleção cuidadosamente selecionada de materiais complementares 
            para aprofundar seus estudos sobre a Confissão de Fé de Westminster 
            e os catecismos reformados.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    {getIconForType(resource.type)}
                  </div>
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-amber-600 transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription>
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

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Categorias de Recursos
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Documentos PDF</h3>
              <p className="text-sm text-muted-foreground">
                Textos originais e traduções oficiais
              </p>
            </div>
            
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Livros e Comentários</h3>
              <p className="text-sm text-muted-foreground">
                Obras teológicas e comentários especializados
              </p>
            </div>
            
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Sites Especializados</h3>
              <p className="text-sm text-muted-foreground">
                Portais e recursos online confiáveis
              </p>
            </div>
            
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Áudios e Palestras</h3>
              <p className="text-sm text-muted-foreground">
                Sermões e estudos em formato de áudio
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Sugestão de Uso
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-4">
              Para um estudo mais proveitoso, recomendamos a seguinte abordagem:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 text-amber-800 dark:text-amber-200 font-medium">1</span>
                Leia primeiro o texto da Confissão ou Catecismo diretamente na plataforma
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 text-amber-800 dark:text-amber-200 font-medium">2</span>
                Consulte os comentários e materiais complementares para aprofundamento
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 text-amber-800 dark:text-amber-200 font-medium">3</span>
                Use os recursos de áudio para reforçar o aprendizado durante outras atividades
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}