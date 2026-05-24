# MotStart API (Express + Supabase)

API REST em **Node.js** com **Express** e banco **Supabase** (PostgreSQL).

## Estrutura de pastas

```
motstart-api/
├── package.json
├── .env.example          ← copie para .env
├── supabase/
│   └── schema.sql      ← rode no painel Supabase
└── src/
    ├── index.js          ← entrada (porta 4000)
    ├── app.js            ← Express + rotas
    ├── config/
    │   └── supabase.js   ← cliente Supabase (service role)
    ├── middleware/
    ├── routes/           ← endpoints
    │   ├── health.js
    │   ├── checkout.js
    │   ├── coursePurchases.js
    │   ├── profiles.js
    │   ├── progress.js
    │   ├── jobs.js
    │   └── creatorCourses.js
    └── utils/
```

## Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor** → cole e execute `supabase/schema.sql`.
3. **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     ⚠️ Nunca exponha a service role no frontend.

## Rodar a API

```bash
cp .env.example .env
# edite .env com suas chaves Supabase
npm install
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)  
Health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API e do banco |
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
