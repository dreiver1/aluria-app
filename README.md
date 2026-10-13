# Alúria — frontend

O Alúria é um sistema de gestão escolar open-source e self-hosted. Este repositório contém a aplicação web usada por escolas para autenticar administradores, configurar uma instalação nova e consultar/manter os módulos acadêmicos que já possuem integração com a API.

O frontend é uma aplicação Vue 3 com Quasar. Ele não substitui as validações do backend: a visibilidade de menus e páginas é uma conveniência de uso, enquanto a API continua responsável pela autenticação e pelas regras de acesso disponíveis hoje.

## Estado atual

Disponível no código atual:

- login de administrador por e-mail e senha, com token JWT armazenado em cookie;
- fluxo de primeira instalação em `/setup`, com código temporário fornecido pelo operador e criação do primeiro administrador;
- redirecionamento automático para `/setup` quando a API informa que a instalação ainda não está configurada;
- painel inicial protegido em `/me`;
- listagem e criação de turmas;
- listagem e cadastro de alunos, incluindo associação a turma e registros de frequência/mês usados pela tela;
- visualização de uma turma e seus alunos;
- componentes visuais de notícias e calendário acadêmico.

Os módulos de professores, notas e parte da frequência existem como serviços/componentes de apoio, mas nem todos têm uma tela completa conectada ao menu. Permissões granulares e escopo por turma/disciplina ainda estão planejados na ALU-003 e não são uma funcionalidade implementada neste frontend.

## Fluxos de uso

```mermaid
flowchart TD
  A[Abre a aplicação] --> B{GET /setup/status}
  B -->|não configurada| C[/setup]
  C --> D[Informa código e dados do administrador]
  D --> E[POST /setup/bootstrap]
  E --> F[/login]
  B -->|configurada| F
  F --> G[POST /admin/login]
  G --> H[Cookie JWT]
  H --> I[Área protegida /me]
```

Na instalação inicial, o código não é gerado pelo navegador: o operador executa `npm run setup-code` no backend e informa o valor exibido no terminal ao responsável. Depois da configuração, a rota `/setup` deixa de ser um fluxo de cadastro e o servidor redireciona essa navegação para o login.

## Tecnologias

As versões abaixo são as declaradas no [package.json](./package.json):

| Tecnologia | Versão declarada | Uso no projeto |
| --- | --- | --- |
| Vue | `^3.0.0` | Componentes e ciclo de vida da interface. |
| Quasar | `^2.6.0` | Componentes visuais, layout, CLI e build Vite. |
| `@quasar/app-vite` | `^1.0.0` | Integração do Quasar com Vite. |
| Vue Router | `^4.0.0` | Rotas públicas, setup e área protegida. |
| Pinia | `^2.0.29` | Estado compartilhado disponível na aplicação. |
| Axios | `^0.21.1` | Cliente HTTP para a API. |
| js-cookie | `^3.0.1` | Persistência e remoção do token JWT no navegador. |
| ESLint | `^8.10.0` | Lint dos arquivos JavaScript e Vue. |

O ambiente declarado aceita Node `14.19+`, `16` ou `18`, e npm `6.13.4+`. Para uma instalação nova, prefira uma versão LTS compatível com o backend.

## Estrutura relevante

```text
src/
├── boot/          configuração do Axios e URL da API
├── components/    formulários, tabelas, calendário, notícias e autenticação
├── composables/   abstrações de autenticação e chamadas HTTP
├── layouts/       layouts de login e da área principal
├── pages/         login, setup, dashboard, alunos e turmas
├── router/        rotas e guarda de instalação/autenticação
└── services/      chamadas específicas de alunos, turmas, professor e acadêmico
```

O diretório `src/pages` representa as telas navegáveis. O diretório `src/services` não cria uma API própria: ele apenas organiza chamadas para os endpoints do backend.

## Instalação e execução

### Pré-requisitos

- Node.js compatível com a declaração de `engines`;
- npm;
- backend Alúria em execução, por padrão em `http://localhost:3002`.

### Dependências

```bash
npm install
```

### Variável da API

Copie [.env.example](./.env.example) para `.env` e ajuste `SERVER` quando a API estiver em outro endereço:

```dotenv
SERVER=http://localhost:3002
```

O arquivo `.env` é local e não deve ser versionado. O valor é usado pelo boot do Axios e pela configuração do histórico do roteador.

### Desenvolvimento

```bash
npm run dev
```

O Quasar informa no terminal a URL local, normalmente `http://localhost:9000`. A primeira navegação consulta `/setup/status`; configure o backend antes de testar login ou setup.

### Build de produção

```bash
npm run build
```

O resultado é gerado pelo Quasar no diretório de build configurado pelo CLI. O frontend precisa ser servido com acesso à URL pública da API definida no ambiente de execução.

### Lint e testes

```bash
npm run lint
npm test
```

O script `test` declarado atualmente é apenas um placeholder que retorna sucesso; não há suíte de testes frontend configurada no `package.json`.

## Rotas da interface

| Rota | Acesso | Função |
| --- | --- | --- |
| `/` e `/login` | Público quando configurado | Login do administrador. |
| `/setup` | Fluxo público condicionado ao estado da instalação | Criação do primeiro administrador. |
| `/me` | JWT | Painel inicial. |
| `/turmas` | JWT | Lista de turmas. |
| `/turma/create` | JWT | Criação de turma. |
| `/turma/id/:Id` | JWT | Detalhe de turma. |
| `/alunos` | JWT | Lista de alunos. |
| `/alunos/create` | JWT | Cadastro de aluno. |

Itens como “Atividades”, “Calendário” e “Configurações” aparecem na navegação atual, mas alguns apontam para o dashboard ou são componentes visuais sem um módulo administrativo completo. Eles não são descritos como funcionalidades concluídas.

## Integração com o backend

As chamadas autenticadas acrescentam `Authorization: Bearer <token>` a partir do cookie `_myAppToken`. O login usa `POST /admin/login`; a validação de instalação usa `GET /setup/status`; e a criação inicial usa `POST /setup/bootstrap`. Os endpoints acadêmicos são consumidos pela camada em `src/services`.

Para executar o fluxo completo, consulte o [README da API](https://github.com/dreiver1/aluria-api/blob/main/README.md). Não use credenciais reais nem compartilhe o conteúdo de `.env`.

## Distribuição e limitações

Cada escola pode hospedar sua própria instalação, sem depender de um serviço central. A ALU-002 cobre o bootstrap protegido. A autorização granular de administradores e professores, incluindo escopo por turma e disciplina, está documentada como planejamento da ALU-003 e não está implementada aqui.
