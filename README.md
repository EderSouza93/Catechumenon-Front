# Catechumenon Front-End

![Versão](https://img.shields.io/badge/version-0.2.0-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Feature](https://img.shields.io/badge/feature-Auth%20Mock%20%2B%20Dashboard-green)

### [Acessar a aplicação](https://catechumenon-front.vercel.app/)

Catechumenon é uma aplicação web front-end dedicada a fornecer acesso a documentos históricos da fé cristã. O foco do projeto é tornar os princípios da teologia reformada mais acessíveis para pessoas comuns, a fim de que possa auxiliar no conhecimento da fé reformada, servindo como uma ferramenta de estudo e referência para todos os interessados.

## Funcionalidades

- **Visualização de Documentos:**
  - Confissão de Fé de Westminster (33 capítulos)
  - Catecismo Maior de Westminster (196 perguntas)
  - Catecismo Menor de Westminster (107 perguntas)
- **Interface Responsiva:** Layout adaptável para desktops e dispositivos móveis.
- **Integração com API da Bíblia:** Referências bíblicas clicáveis com exibição do versículo correspondente.
- **Busca Global (Ctrl+K):** Command palette que pesquisa em todos os documentos simultaneamente, com resultados agrupados por documento.
- **Highlight nos Resultados:** Termos buscados são destacados nos cards de conteúdo.
- **Autenticação (Mock):** Sistema de login com cookies httpOnly, proteção de rotas via middleware, e gerenciamento de sessão.
- **Dashboard Personalizado:** Tela inicial após login com saudação, progresso de leitura e acesso rápido aos documentos.
- **Acompanhamento de Progresso:** Sistema de marcação de leitura com persistência local.
- **Tema Claro/Escuro:** Suporte completo a dark mode.

## Credenciais de Teste

| E-mail | Senha |
|--------|-------|
| admin@catechumenon.com | 123456 |
| estudante@catechumenon.com | 123456 |

## Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/EderSouza93/Catechumenon-Front.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd Catechumenon-Front
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Estrutura do Projeto

```
app/
  api/auth/          # Mock API de autenticação (login, logout, me)
  api/bible/         # Proxy para API da Bíblia
  api/search/        # API de busca nos documentos
  api/catechism/     # APIs dos catecismos
  api/confession/    # API da confissão
  dashboard/         # Dashboard (protegido)
  login/             # Página de login
  confissao/         # Confissão de Fé (protegido)
  catecismo-maior/   # Catecismo Maior (protegido)
  catecismo-menor/   # Catecismo Menor (protegido)
  recursos/          # Recursos de estudo (protegido)
components/
  layout/            # Navbar, Footer, Layout
  search/            # GlobalSearch (command palette)
  ui/                # Componentes reutilizáveis (shadcn/ui + custom)
contexts/
  AuthProvider.tsx    # Contexto de autenticação
  ThemeProvider.tsx   # Contexto de tema
hooks/               # Hooks customizados (useProgress, useAuth)
data/                # Dados JSON dos documentos
middleware.ts        # Proteção de rotas
```

## Roadmap

-   [x] **Busca Global:** Command palette (Ctrl+K) com busca em todos os documentos e highlight nos resultados.
-   [x] **Autenticação Mock:** Sistema de login com cookies, proteção de rotas e dashboard personalizado.
-   [x] **Melhorias de UI/Acessibilidade:** Aria-labels, navegação por teclado, paginação consistente, indicador de página ativa.
-   [ ] **Integração com API da Bíblia (melhorias):** Verificar possíveis erros ao clicar nos versículos das referências.
-   [ ] **Desenvolvimento do Back-end:** Criação de uma API dedicada utilizando **Nest.js**. Migração dos dados mockados para **MongoDB**. Substituição da auth mock por autenticação real.
-   [ ] **Registro de Usuário:** Implementar tela de cadastro e fluxo de registro completo.
-   [ ] **Persistência de Progresso no Servidor:** Migrar o progresso de leitura do localStorage para o banco de dados, permitindo acesso entre dispositivos.
-   [ ] **Anotações Pessoais:** Permitir que o usuário faça anotações nos textos estudados.

## Sugestões de Melhorias

- **Lazy loading dos JSONs no GlobalSearch:** Importar os dados dinamicamente (`import()`) apenas quando o usuário abrir a busca, reduzindo o bundle inicial.
- **Componentizar o menu mobile:** Usar o componente `Sheet` do shadcn/ui para animação, backdrop e focus trap no menu mobile.
- **Skip navigation link:** Adicionar link "Pular para o conteúdo" para acessibilidade (WCAG 2.4.1).
- **Scroll to top na paginação:** Rolar automaticamente para o topo ao mudar de página.
- **Padronizar linting:** Configurar ESLint/Prettier para uniformizar aspas e ponto-e-vírgula.

## Contribuições

Contribuições são bem-vindas! Se você tem sugestões ou quer colaborar, por favor, abra uma *issue* para discutirmos as ideias.
