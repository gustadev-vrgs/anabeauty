# Ana Beauty Agenda

Sistema web responsivo para gestão de agendamentos de uma profissional da beleza, construído com **Next.js + TypeScript + Tailwind CSS + Firebase (Auth e Firestore)** e pronto para deploy na **Vercel**.

## Stack

- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS (Coffee Palette)
- Firebase Authentication
- Firebase Firestore

## Fluxo principal implementado

1. Tela de login (`/login`)
2. Após autenticar, acesso direto à agenda (`/agenda`)
3. Calendário principal grande e centralizado
4. Seleção de dia exibe grade de horários
5. Criação de agendamento, bloqueio de horário, edição de status
6. Agendamentos com cliente, serviço, horário, valor e observações

## Módulos

- Login
- Agenda principal com calendário
- Horários do dia
- Cadastro de clientes
- Cadastro de serviços/procedimentos
- Agendamento
- Bloqueio de horários
- Dashboard financeiro (placeholder para evolução)

## Variáveis de ambiente

Crie um arquivo `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Suba o repositório no GitHub.
2. Importe na Vercel.
3. Configure as mesmas variáveis de ambiente no projeto da Vercel.
4. Deploy.

## Estrutura

- `app/(auth)/login`: módulo de autenticação
- `app/(dashboard)/agenda`: agenda principal
- `components/agenda`: calendário, grade de horários e shell da agenda
- `lib/firebase`: inicialização e acesso às coleções
- `types/domain.ts`: modelos de domínio tipados
