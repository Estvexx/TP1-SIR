# TP1 — SIR: Gestão de alunos e cursos

Aplicação de gestão escolar com uma API REST em Node.js/Express, persistência em MongoDB através de Mongoose e frontend em HTML, CSS e JavaScript. Permite criar, consultar, editar e eliminar alunos e cursos, pesquisar nas listas e consultar resumos estatísticos.

## Links

- [Repositório](https://github.com/Estvexx/TP1-SIR)
- [Aplicação no Render](https://tp1-sir-klbw.onrender.com)
- [API de alunos em produção](https://tp1-sir-klbw.onrender.com/alunos)
- [API de cursos em produção](https://tp1-sir-klbw.onrender.com/cursos)
- [Aplicação local](http://localhost:3000)
- [Swagger local](http://localhost:3000/docs) — apenas com `NODE_ENV=development`.

## Estrutura

```text
backend/       API, modelos, rotas, controladores e configuração do MongoDB
frontend/      Páginas, estilos e JavaScript do cliente
mock-data/     Dados de exemplo para JSON Server
mock-server/   Coleção Postman do mock
tests/         Coleção Postman da API
```

## Executar localmente

Requisitos: Node.js 22.12 ou superior, npm e uma base de dados MongoDB local ou no Atlas.

1. Clonar o repositório:

   ```bash
   git clone https://github.com/Estvexx/TP1-SIR.git
   cd TP1-SIR
   ```

2. Instalar as dependências do backend:

   ```bash
   cd backend
   npm install
   ```

3. Criar `backend/.env` com os seguintes valores de exemplo:

   ```dotenv
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/academicas
   ```

   Para usar MongoDB Atlas, substituir `MONGODB_URI` pela string de ligação do cluster e configurar as permissões de acesso. O ficheiro `.env` está excluído do Git; não publicar credenciais.

4. Iniciar a aplicação a partir da pasta `backend`:

   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000). O Express serve também o frontend, sem necessidade de outro servidor.

O comando `npm run dev` reinicia o servidor quando os ficheiros mudam. `npm start` executa sem esse modo de observação; ambos carregam o ficheiro `.env`. O servidor só começa a aceitar pedidos depois de estabelecer a ligação ao MongoDB.

### Seleção da API

O endereço é definido em [frontend/js/script.js](frontend/js/script.js):

| Onde o frontend é aberto | API utilizada |
| --- | --- |
| `localhost`, `127.0.0.1` ou `[::1]` | `http://localhost:3000` |
| Outros domínios | `https://tp1-sir-klbw.onrender.com` |

Também é possível abrir o frontend com Live Server em localhost; o backend permite pedidos desses endereços por CORS. Abrir as páginas através de HTTP. Se a porta local da API mudar, atualizar também a configuração do frontend.

## Endpoints

Os corpos dos pedidos de criação e atualização usam JSON e o cabeçalho `Content-Type: application/json`. Os identificadores da API são UUIDs.

| Método | Rota | Operação |
| --- | --- | --- |
| GET | `/alunos` | Listar alunos com o curso associado |
| POST | `/alunos` | Criar aluno |
| GET | `/alunos/summary` | Total de alunos, cursos ativos e idade média |
| GET | `/alunos/:id` | Consultar aluno |
| PUT | `/alunos/:id` | Atualizar aluno |
| DELETE | `/alunos/:id` | Eliminar aluno |
| GET | `/cursos` | Listar cursos |
| POST | `/cursos` | Criar curso |
| GET | `/cursos/summary` | Total de cursos, alunos e média de alunos por curso |
| GET | `/cursos/:id` | Consultar curso |
| PUT | `/cursos/:id` | Atualizar curso |
| DELETE | `/cursos/:id` | Eliminar curso sem alunos associados |

Exemplo de criação de curso:

```json
{
  "nome": "Informática"
}
```

Exemplo de criação de aluno: substituir `curso` pelo UUID de um curso existente.

```json
{
  "nome": "Francisco",
  "apelido": "Esteves",
  "idade": 21,
  "curso": "89cb5817-b7d1-4bf9-9201-6a67717a3df2",
  "ano": 1
}
```

### Regras dos modelos

- O nome do curso é obrigatório, tem entre 1 e 23 caracteres e usa `trim` e um índice único.
- Nome e apelido do aluno são obrigatórios, têm entre 1 e 23 caracteres e usam `trim`.
- A idade tem de estar entre 1 e 130; o ano tem de ser pelo menos 1.
- Não é permitido eliminar um curso com alunos associados.
- Os documentos incluem `createdAt` e `updatedAt`.

O índice único dos cursos exige que os dados existentes não tenham nomes duplicados. A configuração atual não define unicidade sem distinção entre maiúsculas e minúsculas.

## Swagger

Disponível em [http://localhost:3000/docs](http://localhost:3000/docs) apenas quando `NODE_ENV=development`. Nos restantes ambientes, a rota não é registada.

Para regenerar o documento, executar na pasta `backend`:

```bash
node swagger.cjs
```

Rever o ficheiro gerado `backend/swagger-output.json` antes de o guardar no repositório.

## Pedidos e verificações com Postman

Importar [tests/tp1-sir.postman_collection.json](tests/tp1-sir.postman_collection.json) no Postman.

A coleção contém pedidos de exemplo e precisa de revisão antes de ser usada com a API atual: existem pedidos com `cursoId` em vez de `curso`, caminhos que não correspondem ao nome do pedido e identificadores fixos. Ajustar os métodos, URLs, corpos e UUIDs de acordo com a tabela de endpoints acima.

Não existem scripts de asserção na coleção atual. O comando `npm test` do backend também ainda não está configurado; a coleção não constitui uma suite automática de testes.

## Mock com JSON Server

O mock é uma alternativa para experimentar dados sem MongoDB. A partir da raiz do repositório:

```bash
npm install
npx json-server --watch mock-data/db.json --port 3001
```

Consultar `http://localhost:3001/alunos` e `http://localhost:3001/cursos`. A coleção de exemplo está em [mock-server/json_server.postman_collection.json](mock-server/json_server.postman_collection.json); ajustar a porta dos pedidos para `3001`.

O frontend atual aponta para a API Express na porta `3000`. O mock usa dados e identificadores diferentes, incluindo `cursoId` e IDs numéricos, e não reproduz automaticamente as validações, relações e resumos da API real.

## Deploy no Render

Configuração para servir a API e o frontend no mesmo serviço:

| Campo | Valor |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm ci --omit=dev` |
| Start Command | `node src/server.js` |
| Variável `NODE_ENV` | `production` |
| Variável `MONGODB_URI` | String de ligação da base de dados de produção |

O comando de build pressupõe que `backend/package-lock.json` está versionado. Configurar as variáveis no painel do Render. O comando de arranque acima não depende de um ficheiro `.env`; o servidor lê a porta de `PORT` quando fornecida pelo alojamento.

O frontend é servido a partir de `../frontend`, pelo que essa pasta tem de continuar disponível junto de `backend` no checkout. Em produção, `/docs` fica indisponível.

As pastas `mock-data`, `mock-server` e `tests` não são usadas pelo arranque da aplicação. `--omit=dev` exclui dependências de desenvolvimento da instalação, mas não remove essas pastas do checkout. O `.gitignore` também não exclui ficheiros já versionados do deploy; para um artefacto que os exclua fisicamente, é necessário configurar empacotamento próprio ou Docker.

## Notas

- Se a primeira abertura após um período sem utilização for lenta, verificar o estado do serviço no Render e os respetivos logs.
- Se a API não arrancar, verificar `MONGODB_URI`, a disponibilidade do MongoDB e as permissões de rede.
- Alterações locais só chegam à aplicação publicada depois de serem enviadas para o repositório e feito um novo deploy.
