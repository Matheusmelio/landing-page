# MotStart API (Express)

API REST em **Node.js** com **Express** e persistência em **Supabase/Postgres**.

> Fase atual: API conectada ao Supabase. Cadastros, progresso, compras, vagas e cursos criados ficam persistidos no Postgres.

## Estrutura de pastas

```
motstart-api/
├── package.json
├── .env.example          ← copie para .env
└── src/
    ├── index.js          ← entrada (porta 4000)
    ├── app.js            ← Express + rotas
    ├── middleware/
    ├── routes/           ← endpoints
    │   ├── health.js
    │   ├── checkout.js
    │   ├── coursePurchases.js
    │   ├── profiles.js
    │   ├── progress.js
    │   ├── jobs.js
    │   └── creatorCourses.js
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

## Integrar com o Next.js

No `.env.local` do frontend (`motstart/`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Reinicie `npm run dev` do frontend.
