# Ana Beauty Agenda

Base inicial de um sistema web responsivo de agendamento para profissional da área da beleza.

## Stack

- Next.js 14 com **App Router**
- TypeScript
- Tailwind CSS com paleta **Coffee** (Mocha como cor principal)
- Firebase Authentication
- Firebase Firestore
- Estrutura preparada para deploy na Vercel

## Rotas iniciais

- `/login`
- `/agenda`
- `/clientes`
- `/servicos`
- `/dashboard`

## Estrutura de pastas

```txt
src/
  app/
    (auth)/login/
    (dashboard)/agenda/
    (dashboard)/clientes/
    (dashboard)/servicos/
    (dashboard)/dashboard/
  components/
    ui/
    layout/
    calendar/
    appointments/
    clients/
    services/
  lib/
  hooks/
  types/
  services/
  firebase/
  utils/
```

## Variáveis de ambiente

Configure `.env.local` com:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Faça push do projeto para GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente acima.
4. Faça o deploy.
