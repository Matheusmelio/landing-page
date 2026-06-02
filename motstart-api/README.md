# MotStart API (Express)

API REST em **Node.js** com **Express** e persistência em **Supabase/Postgres**.

> Fase atual: API conectada ao Supabase. Cadastros, progresso, compras, vagas e cursos criados ficam persistidos no Postgres.

## Estrutura de pastas

```
motstart-api/
├── api/index.js          ← entrada serverless (Vercel)
├── vercel.json
├── package.json
├── .env.example          ← copie para .env
└── src/
    ├── index.js          ← entrada local (porta 4000)
    ├── app.js            ← Express + rotas
    ├── middleware/
    ├── routes/           ← endpoints
    ├── config/           ← cliente Supabase
    └── utils/
```

## Rodar a API

```bash
cp .env.example .env
npm install
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)  
Health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

Variáveis principais:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_ou_publishable
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API |
| POST | `/api/profiles/register` | Cadastro |
| POST | `/api/profiles/login` | Login |
| POST | `/api/checkout` | Assinatura de plano |
| POST | `/api/course-purchases` | Compra de curso |
| GET | `/api/profiles/:email` | Perfil |
| PUT | `/api/profiles` | Criar/atualizar perfil |
| GET | `/api/progress?email=` | Progresso dos cursos |
| PUT | `/api/progress` | Atualizar progresso |
| GET | `/api/jobs` | Listar vagas |
| POST | `/api/jobs` | Publicar vaga |
| DELETE | `/api/jobs/:id` | Remover vaga |
| GET | `/api/creator-courses` | Cursos do criador |
| POST | `/api/creator-courses` | Publicar curso |

## Deploy na Vercel

1. Importe o repositório `MotStart_api` em [vercel.com](https://vercel.com).
2. **Framework Preset:** Other (sem build do Next).
3. Em **Environment Variables**, configure:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`
   - `CLIENT_ORIGIN` (URL do frontend, ex. `https://seu-app.vercel.app`)
   - `PASSWORD_PEPPER`
4. Faça o deploy.

A pasta `api/index.js` exporta o Express como função serverless; `vercel.json` encaminha todas as rotas para ela.

URLs de teste após o deploy:

- `https://seu-projeto.vercel.app/api/health`
- `https://seu-projeto.vercel.app/`

Origens `*.vercel.app` são aceitas automaticamente no CORS (além de `CLIENT_ORIGIN`).

## Integrar com o Next.js

No `.env.local` do frontend (`motstart/`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Em produção na Vercel:

```env
NEXT_PUBLIC_API_URL=https://seu-projeto-api.vercel.app
```

Reinicie `npm run dev` do frontend após alterar variáveis locais.
