'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Modal } from '@/components/ui';

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-border bg-coffee-cappuccino/45 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-coffee-espresso">Coffee Palette Design System</p>
        <h1 className="mt-2 text-3xl font-semibold text-coffee-darkRoast sm:text-4xl">
          Elegância acolhedora para a sua agenda de beleza
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Tema minimalista, profissional e confortável visualmente, com base em tons de café para destacar
          ações, conteúdo e navegação com ótima legibilidade.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Componentes reutilizáveis</CardTitle>
            <CardDescription>Botões e campos consistentes para cadastro, agenda e atendimento.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button>Salvar horário</Button>
              <Button variant="secondary">Ver agenda</Button>
              <Button variant="ghost">Cancelar</Button>
              <Button variant="destructive">Excluir cliente</Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Nome da cliente" name="client" placeholder="Ex.: Mariana Souza" />
              <Input label="Telefone" name="phone" placeholder="(11) 99999-9999" helperText="Somente WhatsApp" />
            </div>

            <Button onClick={() => setIsModalOpen(true)}>Abrir modal de confirmação</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens visuais</CardTitle>
            <CardDescription>Base semântica para consistência em todo o projeto.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-coffee-darkRoast">
              <li>
                <strong>Background:</strong> Latte
              </li>
              <li>
                <strong>Primary:</strong> Mocha
              </li>
              <li>
                <strong>Foreground:</strong> Black Coffee
              </li>
              <li>
                <strong>Border:</strong> Macchiato
              </li>
              <li>
                <strong>Muted:</strong> Cappuccino
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar alteração"
        description="Deseja confirmar este agendamento com horário e serviço selecionados?"
      >
        <div className="rounded-xl border border-border bg-coffee-cappuccino/35 p-4 text-sm text-coffee-darkRoast">
          Cliente: Mariana Souza • Design de sobrancelhas • 15:30
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsModalOpen(false)}>Confirmar</Button>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Ajustar dados
          </Button>
        </div>
      </Modal>
    </main>
  );
}
