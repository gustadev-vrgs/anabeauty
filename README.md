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

- `/login` (pública)
- `/agenda` (privada)
- `/clientes` (privada)
- `/servicos` (privada)
- `/dashboard` (privada)

## Segurança implementada

- Proteção de rotas privadas com `middleware.ts` + guard no App Router.
- Redirecionamento automático de não autenticado para `/login`.
- Tratamento de loading de autenticação para evitar quebra de UX.
- Base para RBAC com permissões por papel (`admin`, `professional`).
- Sanitização/normalização de payloads antes de persistir no Firestore.
- Confirmação obrigatória para exclusões de clientes e serviços.
- Regras Firestore preparadas para leitura/escrita apenas por usuário autenticado proprietário.

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
    auth/
    ui/
    layout/
    calendar/
    appointments/
    clients/
    services/
  lib/
    security/
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

> Somente variáveis com `NEXT_PUBLIC_` devem ser expostas ao cliente.

## Firestore Security Rules

- Arquivo recomendado: `firestore.rules`.
- Faça deploy das regras com Firebase CLI (`firebase deploy --only firestore:rules`).

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
