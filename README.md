# Taskboard Frontend

Frontend da aplicação Taskboard — uma interface web para gerenciar tarefas e quadros de tarefas.

**Descrição:**
- Projeto frontend construído com Next.js e TypeScript, organizado com a nova estrutura de `app/`. Fornece telas de autenticação (login/registro) e uma área principal para visualização e manipulação de tarefas.

**Funcionalidades principais:**
- Autenticação básica (login e registro) — formulários e fluxos de UI.
- Listagem e exibição de tarefas com componentes reutilizáveis.
- Componentes de interface (botões, inputs, diálogos, cartões, skeletons) prontos para compor a aplicação.
- Design modular: componentes organizados por domínio (`components/auth`, `components/tasks`, `components/ui`).

**Stack e tecnologias:**
- Next.js (app router) + React
- TypeScript
- PostCSS para processamento de estilos
- Arquitetura baseada em componentes e hooks

**Visão geral da estrutura do repositório:**
- `app/` — rotas e páginas da aplicação (inclui `login`, `register`, `tasks`).
- `components/` — componentes UI e de domínio (autenticação, lista de tarefas, elementos reutilizáveis).
- `hooks/` — hooks customizados (ex.: `use-mobile`).
- `lib/` — utilitários e helpers.
- `public/` e `styles/` — ativos estáticos e estilos globais.
