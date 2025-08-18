import Link from 'next/link';
import { Book } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-6 w-6 text-amber-600" />
              <span className="text-lg font-bold">Catechumenon</span>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              Uma plataforma dedicada ao estudo da Confissão de Fé de Westminster
              e seus catecismos, promovendo o conhecimento das doutrinas reformadas
              de forma acessível e organizada.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Documentos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/confissao" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Confissão de Fé
                </Link>
              </li>
              <li>
                <Link 
                  href="/catecismo-maior" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Catecismo Maior
                </Link>
              </li>
              <li>
                <Link 
                  href="/catecismo-menor" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Catecismo Menor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/recursos" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Materiais de Estudo
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.westminsterconfession.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Westminster Assembly
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 Catechumenon Study Platform. Desenvolvido para a glória de Deus.
          </p>
        </div>
      </div>
    </footer>
  );
}