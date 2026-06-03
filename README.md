# FinTrack — Gerenciador de Finanças Pessoais

FinTrack é uma aplicação web de gerenciamento de finanças pessoais. O usuário pode se cadastrar, fazer login e registrar suas transações financeiras (ganhos, gastos e investimentos) com filtro por período, visualizando o saldo consolidado em tempo real.

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Como o Projeto Funciona](#como-o-projeto-funciona)
- [Pré-requisitos](#pré-requisitos)
- [Como Clonar e Rodar o Projeto](#como-clonar-e-rodar-o-projeto)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Dependências](#dependências)
- [Boas Práticas de Clean Code](#boas-práticas-de-clean-code)
- [Configuração de IDE](#configuração-de-ide)

---

## Sobre o Projeto

O FinTrack permite ao usuário:

- **Cadastrar-se** e fazer **login** com autenticação JWT (access token + refresh token).
- **Adicionar, editar e remover** transações financeiras categorizadas como `EARNING` (ganho), `EXPENSE` (gasto) ou `INVESTMENT` (investimento).
- **Visualizar o dashboard** com saldo total, total de ganhos, gastos e investimentos no período selecionado.
- **Filtrar transações** por intervalo de datas.

> **Atenção:** O backend deve estar em execução para que o frontend funcione corretamente.
> Repositório do backend: [https://github.com/silvamaarcus/finance-app](https://github.com/silvamaarcus/finance-app)

### Como rodar o backend

```bash
# 1. Suba o banco de dados com Docker
docker compose up -d postgres

# 2. Execute as migrações
npx prisma migrate deploy

# 3. Inicie o servidor (desenvolvimento)
npm run start:dev

# OU modo produção
npm start
```

---

## Como o Projeto Funciona

### Fluxo de Autenticação

```
Usuário → LoginPage → useLoginForm (validação Zod) → AuthContext.login()
       → UserService.login() → POST /api/users/login
       → Salva accessToken + refreshToken no localStorage
       → Redireciona para /
```

O `AuthContext` é o coração da autenticação. Ele:

1. Ao inicializar, verifica se existem tokens no `localStorage` e chama `GET /api/users/me` para restaurar a sessão.
2. Expõe as funções `login`, `signup` e `logout` para toda a árvore de componentes.
3. Controla o estado `isInitializing` para evitar flash de conteúdo não autenticado.

### Renovação Automática de Token (Refresh Token)

O interceptor configurado em `src/lib/axios.js` no cliente `protectedApi`:

1. Adiciona o `accessToken` em cada requisição via header `Authorization: Bearer`.
2. Se receber **401**, tenta automaticamente renovar o token via `POST /api/users/refresh-token`.
3. Refaz a requisição original com o novo token.
4. Se o refresh também falhar, rejeita a promise.

### Fluxo de Transações

```
HomePage → useGetTransactions({ from, to })
         → TransactionService.getAll() → GET /api/transactions/me?from=...&to=...
         → TanStack Query armazena em cache e expõe os dados
         → TransactionsTable renderiza a listagem
         → Balance / BalanceItem exibem saldo consolidado
```

- **Criar:** `AddTransactionButton` → `useCreateTransactionForm` → `useCreateTransaction` → `TransactionService.create()`
- **Editar:** `EditTransactionButton` → `useEditTransactionForm` → `useEditTransaction` → `TransactionService.update()`
- Após mutações bem-sucedidas, o TanStack Query invalida o cache automaticamente, forçando recarregamento dos dados.

### Proxy Vite

O Vite está configurado para redirecionar toda rota `/api/*` para `http://localhost:8080`, evitando problemas de CORS em desenvolvimento.

---

## Pré-requisitos

- **Node.js** >= 18
- **npm** >= 9
- Backend do FinTrack rodando em `http://localhost:8080`

---

## Como Clonar e Rodar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/silvamaarcus/fintrack.git

# 2. Acesse a pasta
cd fintrack

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts disponíveis

| Script            | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com HMR |
| `npm run build`   | Gera o build de produção na pasta `dist/`    |
| `npm run preview` | Serve o build de produção localmente         |
| `npm run lint`    | Executa o ESLint em todos os arquivos        |

---

## Arquitetura do Projeto

```
src/
├── api/
│   ├── hooks/          # React Query hooks (interface para a UI)
│   └── services/       # Funções puras de chamada HTTP (Axios)
├── assets/             # Fontes e imagens estáticas
├── components/         # Componentes reutilizáveis da aplicação
│   └── ui/             # Componentes de UI genéricos (shadcn/ui)
├── constants/          # Valores constantes (ex: chaves do localStorage)
├── contexts/           # Contextos React (estado global)
├── forms/
│   ├── hooks/          # Hooks de formulário (react-hook-form)
│   └── schemas/        # Esquemas de validação (Zod)
├── helpers/            # Funções utilitárias puras
├── lib/                # Configurações de bibliotecas externas
├── pages/              # Componentes de página (rotas)
└── main.jsx            # Ponto de entrada da aplicação
```

### Responsabilidade de cada camada

#### `src/pages/`

Componentes de nível de rota. Cada arquivo corresponde a uma URL da aplicação (`/`, `/login`, `/signup`). São responsáveis apenas por compor os componentes de layout e delegar lógica para hooks e contextos. **Princípio: Single Responsibility (S do SOLID).**

#### `src/components/`

Componentes reutilizáveis específicos do domínio da aplicação (ex: `TransactionsTable`, `Balance`, `Header`). Recebem dados via props ou buscam diretamente via hooks. Não contêm lógica de negócio.

#### `src/components/ui/`

Componentes de UI 100% genéricos, gerados pelo [shadcn/ui](https://ui.shadcn.com/). Não possuem conhecimento do domínio da aplicação. São completamente reutilizáveis em qualquer projeto.

#### `src/api/services/`

Camada de acesso a dados. Cada arquivo representa um recurso da API (ex: `transaction.js`, `user.js`). Contém apenas funções que realizam chamadas HTTP e adaptam os dados da API para o formato do frontend (camelCase). **Princípio: Interface Segregation (I do SOLID) — cada service conhece apenas seu próprio recurso.**

#### `src/api/hooks/`

Camada de integração com o TanStack Query. Encapsula `useQuery` e `useMutation` para cada operação da API, gerenciando cache, estado de loading e invalidação. A UI nunca chama os services diretamente — sempre passa pelos hooks.

#### `src/forms/schemas/`

Esquemas de validação declarativos com Zod. Centralizam as regras de validação dos formulários, tornando-as reutilizáveis e testáveis independentemente dos componentes.

#### `src/forms/hooks/`

Hooks que combinam `react-hook-form` com os schemas Zod via `@hookform/resolvers`. Encapsulam toda a lógica de formulário (valores padrão, validação, submit), mantendo os componentes limpos.

#### `src/contexts/`

Estado global da aplicação via Context API. O `AuthContext` gerencia o estado de autenticação e é o único lugar que conhece os tokens JWT. **Princípio: Open/Closed (O do SOLID) — novos contextos podem ser adicionados sem alterar os existentes.**

#### `src/lib/`

Configurações e instâncias de bibliotecas de terceiros. O `axios.js` cria duas instâncias do Axios (`publicApi` e `protectedApi`) com interceptors, evitando repetição de lógica de autenticação.

#### `src/constants/`

Valores literais nomeados para evitar "magic strings" espalhadas pelo código.

#### `src/helpers/`

Funções utilitárias puras e reutilizáveis (ex: `formatCurrency`). Não possuem efeitos colaterais.

---

## Dependências

### Produção

| Dependência                      | Versão | Propósito                                                                         |
| -------------------------------- | ------ | --------------------------------------------------------------------------------- |
| `react`                          | ^18.3  | Biblioteca principal de UI                                                        |
| `react-dom`                      | ^18.3  | Renderização do React no DOM                                                      |
| `react-router`                   | ^7.1   | Roteamento client-side (SPA)                                                      |
| `axios`                          | ^1.7   | Cliente HTTP para comunicação com a API REST                                      |
| `@tanstack/react-query`          | ^5.64  | Gerenciamento de estado assíncrono, cache e sincronização de dados do servidor    |
| `@tanstack/react-query-devtools` | ^5.100 | Ferramenta de debug visual para inspecionar o cache do React Query                |
| `react-hook-form`                | ^7.76  | Gerenciamento de formulários com alta performance (sem re-renders desnecessários) |
| `@hookform/resolvers`            | ^5.4   | Integração entre react-hook-form e bibliotecas de validação (ex: Zod)             |
| `zod`                            | ^3.24  | Validação de esquemas de dados com tipagem forte em runtime                       |
| `@radix-ui/react-*`              | vários | Componentes de UI acessíveis e sem estilo (primitivos usados pelo shadcn/ui)      |
| `class-variance-authority`       | ^0.7   | Gerenciamento de variantes de classes CSS com type safety                         |
| `clsx`                           | ^2.1   | Utilitário para compor nomes de classes CSS condicionalmente                      |
| `tailwind-merge`                 | ^3.6   | Resolve conflitos de classes Tailwind ao fazer merge                              |
| `tailwindcss-animate`            | ^1.0   | Plugin Tailwind com animações pré-prontas                                         |
| `lucide-react`                   | ^1.16  | Biblioteca de ícones SVG para React                                               |
| `sonner`                         | ^2.0   | Biblioteca de notificações toast elegante                                         |
| `next-themes`                    | ^0.4   | Suporte a temas (dark/light mode)                                                 |
| `date-fns`                       | ^4.3   | Utilitários para manipulação e formatação de datas                                |
| `react-day-picker`               | ^10.0  | Componente de calendário/seleção de datas                                         |
| `react-number-format`            | ^5.4   | Formatação de campos numéricos (ex: valores monetários)                           |
| `query-string`                   | ^9.1   | Serialização e deserialização de query strings na URL                             |

### Desenvolvimento

| Dependência                        | Versão | Propósito                                                           |
| ---------------------------------- | ------ | ------------------------------------------------------------------- |
| `vite`                             | ^6.0   | Bundler ultrarrápido com HMR para desenvolvimento                   |
| `@vitejs/plugin-react`             | ^4.3   | Plugin Vite para suporte a React com Fast Refresh                   |
| `tailwindcss`                      | ^3.4   | Framework CSS utilitário                                            |
| `postcss`                          | ^8.4   | Processador CSS (necessário para o Tailwind)                        |
| `autoprefixer`                     | ^10.4  | Adiciona prefixos CSS automaticamente para compatibilidade          |
| `eslint`                           | ^9.17  | Linter JavaScript para encontrar e corrigir problemas de código     |
| `eslint-config-prettier`           | ^10.0  | Desativa regras do ESLint que conflitam com o Prettier              |
| `eslint-plugin-react`              | ^7.37  | Regras ESLint específicas para React                                |
| `eslint-plugin-react-hooks`        | ^5.0   | Garante o uso correto das regras dos Hooks do React                 |
| `eslint-plugin-react-refresh`      | ^0.4   | Garante que componentes sejam exportados corretamente para o HMR    |
| `eslint-plugin-simple-import-sort` | ^12.1  | Ordena automaticamente os imports de forma consistente              |
| `prettier`                         | ^3.8   | Formatador de código automático                                     |
| `prettier-plugin-tailwindcss`      | ^0.6   | Plugin Prettier que ordena as classes Tailwind automaticamente      |
| `husky`                            | ^9.1   | Configura Git hooks para executar scripts antes de commits/pushes   |
| `lint-staged`                      | ^15.3  | Executa linters apenas nos arquivos modificados antes do commit     |
| `git-commit-msg-linter`            | ^5.0   | Valida que mensagens de commit seguem o padrão Conventional Commits |

---

## Boas Práticas de Clean Code

### 1. Separação de responsabilidades (SoC)

Cada camada tem uma responsabilidade única e bem definida. Um componente de página não faz chamadas HTTP diretamente — ele usa um hook, que usa um service.

### 2. Nomes descritivos e intencionais

Funções, variáveis e componentes são nomeados para revelar sua intenção:

```js
// ❌ Ruim
const d = new Date();

// ✅ Bom
const transactionDate = new Date();
```

### 3. Evite "magic strings"

Constantes nomeadas em vez de literais espalhados pelo código:

```js
// ❌ Ruim
localStorage.getItem('accessToken');

// ✅ Bom
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '@/constants/local-storage';
localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
```

### 4. Funções pequenas com uma única responsabilidade

Cada função faz uma coisa. O `setTokens` apenas salva tokens, o `removeTokens` apenas os remove.

### 5. Camada de adaptação na service layer

A API retorna `first_name`, mas o frontend usa `firstName`. Essa transformação ocorre exclusivamente nos services, isolando o resto da aplicação do contrato da API:

```js
return {
  firstName: response.data.first_name,
  lastName: response.data.last_name,
};
```

### 6. Custom hooks para encapsular lógica

Lógica de formulário, fetching e estado ficam em hooks customizados, tornando os componentes declarativos e fáceis de ler.

### 7. Path aliases com `@`

Imports absolutos com `@/` (configurado no Vite e jsconfig) evitam caminhos relativos frágeis (`../../../components`):

```js
import { useAuthContext } from '@/contexts/auth';
```

---

### Configurações do VS Code

Crie o arquivo `.vscode/settings.json` para padronizar o ambiente de todos os desenvolvedores do projeto:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "tailwindCSS.experimental.classRegex": []
}
```

| Configuração                          | O que faz                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `editor.defaultFormatter`             | Define o Prettier como o formatador padrão do editor                                    |
| `editor.formatOnSave`                 | Formata o arquivo automaticamente ao salvar (`Ctrl+S`)                                  |
| `editor.codeActionsOnSave`            | Executa correções automáticas do ESLint ao salvar                                       |
| `eslint.validate`                     | Ativa a validação do ESLint para arquivos `.js` e `.jsx`                                |
| `editor.tabSize`                      | Tamanho da indentação (2 espaços, conforme config do Prettier)                          |
| `editor.insertSpaces`                 | Usa espaços em vez de tabs                                                              |
| `files.eol`                           | Padroniza quebras de linha para `\n` (LF), evitando conflitos entre Windows e Linux/Mac |
| `tailwindCSS.experimental.classRegex` | Extensão para suporte avançado ao Tailwind IntelliSense                                 |

### ESLint

O projeto usa ESLint com as seguintes configurações (`eslint.config.js`):

- **`eslint-plugin-react`**: valida boas práticas do React (ex: keys em listas, JSX correto).
- **`eslint-plugin-react-hooks`**: garante que as regras dos Hooks sejam seguidas (ex: não chamar hooks condicionalmente).
- **`eslint-plugin-simple-import-sort`**: ordena os imports automaticamente em grupos (bibliotecas externas → internas → relativas).
- **`eslint-config-prettier`**: desativa todas as regras do ESLint que poderiam conflitar com a formatação do Prettier.

### Prettier

O Prettier é configurado por padrão (sem arquivo de config explícito neste projeto, usa os defaults). Com o plugin `prettier-plugin-tailwindcss`, as classes CSS são ordenadas automaticamente na sequência recomendada pela documentação do Tailwind.

### Git Hooks com Husky + lint-staged

O projeto usa `husky` para executar verificações antes de cada commit:

- **`lint-staged`**: executa o ESLint + Prettier apenas nos arquivos alterados (em stage), tornando o processo rápido.
- **`git-commit-msg-linter`**: valida que a mensagem de commit segue o padrão **Conventional Commits** (ex: `feat: adiciona botão de logout`, `fix: corrige cálculo de saldo`).

---

### Autor
Marcus Silva
