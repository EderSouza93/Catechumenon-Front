# Catechumenon Front-End

![Versão](https://img.shields.io/badge/version-0.1.1-blue)  
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)  
![Feature](https://img.shields.io/badge/feature-API%20Bíblia%20(alpha)-orange)

### 🚀 **[Acessar a aplicação](https://catechumenon-front.vercel.app/)** 🚀

Catechumenon é uma aplicação web front-end dedicada a fornecer acesso a documentos históricos da fé cristã. O foco do projeto é tornar os princípios da teologia reformada mais acessíveis para pessoas comuns, a fim de que possa auxiliar no conhecimento da fé reformada, servindo como uma ferramenta de estudo e referência para todos os interessados.

O projeto está atualmente na **versão 0.1.0** e em fase inicial de desenvolvimento, com foco na construção da interface e na apresentação dos dados.

## ✨ Funcionalidades Atuais

- **Visualização de Documentos:**
  - Catecismo Maior de Westminster (dados ainda não implementados)
  - Catecismo Menor de Westminster
  - Confissão de Fé de Westminster
- **Interface Responsiva:** Layout adaptável para visualização em desktops e dispositivos móveis.
- **Integração com API da Bíblia (alpha):**  
  - Referências bíblicas nos textos começam a se tornar clicáveis.  
  - Exibição do versículo correspondente via API externa (em fase de ajustes).
- **Busca (em desenvolvimento):** Componentes de busca sendo estruturados para futuras implementações.


## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Gerenciador de Pacotes:** [Yarn](https://yarnpkg.com/)

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/EderSouza93/Catechumenon-Front.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd catechumenon-front
    ```

3.  **Instale as dependências:**
    ```bash
    yarn install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    yarn dev
    ```

5.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 🗺️ Roadmap (Próximas Atualizações)

O projeto tem um caminho claro para evolução, focado em adicionar mais interatividade e robustez.

-   [x] **Integração com API da Bíblia(melhorias):**
    -   Verificar possíveis erros ao clicar nos versículos das referências.

-   [ ] **Desenvolvimento do Back-end:**
    -   Criação de uma API dedicada utilizando **Nest.js**.
    -   Migração dos dados mockados (atualmente em arquivos `.json`) para um banco de dados **MongoDB**.

-   [ ] **Autenticação de Usuário:**
    -   Implementar um sistema completo de autenticação e gerenciamento de usuários.
    -   Isso abrirá caminho para funcionalidades personalizadas, como salvar anotações, marcar progresso de leitura, etc.

-   [x] **Melhoria da Busca:**
    -   Finalizar a implementação da busca para permitir que os usuários pesquisem termos e perguntas dentro dos documentos.

## 🤝 Contribuições

Contribuições são bem-vindas! Se você tem sugestões ou quer colaborar, por favor, abra uma *issue* para discutirmos as ideias.
