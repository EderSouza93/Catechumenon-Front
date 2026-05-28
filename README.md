# Catechumenon Front-End

![Versão](https://img.shields.io/badge/version-0.4.0-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Feature](https://img.shields.io/badge/feature-Backend%20NestJS%20%2B%20Progresso%20Persistente-green)

### **[Acessar a aplicação](https://catechumenon-front.vercel.app/)**

Catechumenon é uma aplicação web dedicada a tornar os princípios da teologia reformada mais acessíveis para pessoas comuns. Reúne em um só lugar os principais documentos históricos da fé cristã Confissão de Fé e Catecismos de Westminster e oferece uma experiência de leitura moderna, com referências bíblicas interativas, acompanhamento de progresso por usuário e busca em todo o conteúdo.

O projeto nasceu como um front-end estático servindo dados de arquivos `.json` e evoluiu para uma aplicação full-stack consumindo um back-end Nest.js próprio com autenticação JWT, paginação server-side e persistência por usuário no PostgreSQL.

> Este repositório contém apenas o front-end (Next.js). O back-end (Nest.js + PostgreSQL) é mantido em repositório privado.

## Funcionalidades

- **Visualização de Documentos Históricos:**
  - Confissão de Fé de Westminster (33 capítulos)
  - Catecismo Maior de Westminster (196 perguntas)
  - Catecismo Menor de Westminster (107 perguntas)
- **Paginação Server-Side:** o conteúdo dos documentos é paginado direto pelo back-end Nest.js, reduzindo o payload entregue ao navegador e mantendo a navegação fluida.
- **Referências Bíblicas Interativas:** versículos citados ao longo dos textos são clicáveis e exibem o conteúdo correspondente, consumido a partir do endpoint `/bible` do back-end.
- **Autenticação (JWT via NestJS):** login e cadastro integrados ao back-end, com cookies httpOnly, proteção de rotas via middleware do Next.js e gerenciamento de sessão pelo `AuthProvider`.
- **Cadastro de Usuário:** tela `/register` com validação completa (React Hook Form + Zod) e fluxo de criação de conta.
- **Dashboard Personalizado:** tela inicial após login com saudação, progresso de leitura por documento e acesso rápido aos conteúdos.
- **Progresso de Leitura Persistente:** marcação por capítulo/pergunta salva no servidor, disponível em qualquer dispositivo após o login.
- **Tema Claro/Escuro:** suporte completo a dark mode via `ThemeProvider`.
- **Interface Responsiva:** layout adaptável para desktops, tablets e dispositivos móveis.

> A **busca global (Ctrl+K)** e a busca dentro dos documentos estão presentes na aplicação, mas passarão por uma refatoração no back-end (correção de bugs e melhorias de relevância) antes de serem promovidas como funcionalidade estável. Veja o [Roadmap](#roadmap).

## Tecnologias Utilizadas

### Front-end (este repositório)

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Route Handlers como proxy para o back-end)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) + componentes customizados
- **Formulários & Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Hospedagem:** [Vercel](https://vercel.com/)

### Back-end (repositório privado)

- **Framework:** [Nest.js](https://nestjs.com/)
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT
- **Responsabilidades:** documentos paginados, busca, integração com API da Bíblia, autenticação, persistência de progresso de leitura por usuário.

## Arquitetura

O front-end Next.js atua como **BFF (Backend for Frontend)**: cada chamada do cliente passa por uma Route Handler do App Router (`app/api/*`) que repassa a requisição autenticada para o back-end Nest.js. Esse desenho mantém o token JWT em cookies httpOnly (nunca expostos ao browser) e centraliza o acesso à API privada em uma única camada de `services`.

```
Browser ──► Next.js Route Handler (/api/*) ──► Nest.js API ──► PostgreSQL
                 │
                 └── injeta JWT a partir do cookie httpOnly
```

### Estrutura do Projeto

```
app/
  api/auth/          # Proxy de autenticação (login, register, logout, me)
  api/bible/         # Proxy para o endpoint /bible do back-end
  api/documents/     # Proxy de busca global nos documentos
  api/progress/      # Proxy de progresso de leitura (GET/PATCH)
  api/catechism/     # Proxies paginados dos catecismos (maior/menor)
  api/confession/    # Proxy paginado da confissão
  api/search/        # API legada de busca (será removida na refatoração)
  dashboard/         # Dashboard pós-login (protegido)
  login/             # Página de login
  register/          # Página de cadastro
  confissao/         # Confissão de Fé (protegido)
  catecismo-maior/   # Catecismo Maior (protegido)
  catecismo-menor/   # Catecismo Menor (protegido)
  recursos/          # Recursos de estudo (protegido)
components/
  layout/            # Navbar, Footer, Layout
  search/            # GlobalSearch (command palette)
  ui/                # Componentes reutilizáveis (shadcn/ui + custom)
contexts/
  AuthProvider.tsx   # Contexto de autenticação
  ThemeProvider.tsx  # Contexto de tema
hooks/               # useConfession, useLargerCatechism, useShorterCatechism,
                     # useDocumentsSearch, useProgress, useVerseDialog, useAuth
services/            # Camada de acesso ao back-end:
                     #   api.ts       → fetch base + BACKEND_API_URL
                     #   *Services.ts → chamadas server-side (route handlers)
                     #   *Client.ts   → chamadas client-side (rotas internas /api)
data/                # Dados estáticos remanescentes (ex.: recursos)
middleware.ts        # Proteção de rotas autenticadas
```

## Decisões de Design

- **BFF com Route Handlers:** evita expor a URL do back-end privado e mantém o JWT fora do JavaScript do navegador.
- **Separação `*Services.ts` × `*Client.ts`:** padroniza a origem da chamada server-side (a partir de route handlers) versus client-side (a partir de hooks). A camada `api.ts` centraliza a base URL e os headers.
- **Paginação no servidor:** documentos longos (196 perguntas do Catecismo Maior, 33 capítulos da Confissão) trafegam em páginas, não em arquivos JSON inteiros como na versão original.
- **Hooks por domínio:** cada documento tem seu próprio hook (`useConfession`, `useLargerCatechism`, `useShorterCatechism`), isolando estado de paginação e fetch.

## Roadmap

### Concluído

- [x] Visualização dos documentos de Westminster (Confissão + Catecismos Maior e Menor).
- [x] Integração com API da Bíblia para versículos clicáveis.
- [x] Autenticação completa com back-end Nest.js (JWT, cookies httpOnly, middleware de proteção).
- [x] Cadastro de usuário com validação (`/register`).
- [x] Dashboard personalizado pós-login.
- [x] Migração dos JSONs para PostgreSQL via back-end Nest.js, com paginação server-side.
- [x] Integração da Bíblia via back-end (endpoint `/bible`), eliminando utilitários client-side.
- [x] Persistência do progresso de leitura no servidor (acesso entre dispositivos).
- [x] Tema claro/escuro.

### Em andamento / Próximos passos

- [ ] **Refatoração da busca (back-end):** correção de bugs identificados na busca global (Ctrl+K) e na busca por documento, melhorando relevância e desempenho.
- [ ] **Anotações Pessoais:** permitir que o usuário registre anotações nos textos estudados.
- [ ] **Melhorias de Acessibilidade:** skip navigation link (WCAG 2.4.1), foco visível consistente e refinamento de aria-labels.
- [ ] **Menu mobile com `Sheet` do shadcn/ui:** animação, backdrop e focus trap.
- [ ] **Scroll to top na paginação.**
- [ ] **Padronização de linting:** ESLint + Prettier para aspas e ponto-e-vírgula uniformes.

## Contribuições

Contribuições são bem-vindas! Se você tem sugestões ou quer colaborar, abra uma *issue* para discutirmos as ideias.
