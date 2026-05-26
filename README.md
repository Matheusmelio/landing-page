# MotStart

Plataforma de demonstração (cursos, planos, vagas, área empresarial) em **Next.js** (App Router) + **React 19** + **TypeScript**.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000). No Windows, também pode usar `run-dev.cmd`.

## Build

```bash
npm run build
npm start
```

## Estrutura

- `src/app/` — rotas (App Router)
- `src/views/` — telas (componentes de página)
- `src/components/`, `src/lib/`, `src/data/` — UI e lógica compartilhada
- `public/` — assets estáticos

## API

A API Express fica em uma pasta separada, ao lado deste frontend: `../motstart-api/`.

```bash
# Terminal 1 — frontend
npm run dev

# Terminal 2 — API (veja ../motstart-api/README.md)
cd ../motstart-api
npm install
cp .env.example .env
npm run dev
```

No `.env.local` do frontend: `NEXT_PUBLIC_API_URL=http://localhost:4000`

Com `NEXT_PUBLIC_API_URL` configurada:

| Recurso | Comportamento |
|---------|----------------|
| Login / cadastro | Usa a API em memória |
| Progresso dos cursos | Usa API em memória + cache local |
| Vagas | Lista e publica via API |
| Checkout / compra de curso | Registra via API |

Sem a variável de ambiente, tudo continua em modo demo (`localStorage` + mock).
