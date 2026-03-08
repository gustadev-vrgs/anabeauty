import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ana Beauty Agenda',
  description: 'Sistema de agendamentos para profissionais da beleza',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
