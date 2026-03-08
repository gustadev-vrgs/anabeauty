import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { PageTitle } from '@/components/ui/page-title';

const summaryCards = [
  {
    title: 'Faturamento do dia',
    value: 'R$ 1.280,00',
    support: '+18% vs. ontem',
  },
  {
    title: 'Faturamento do mês',
    value: 'R$ 26.450,00',
    support: '74% da meta mensal',
  },
  {
    title: 'Atendimentos de hoje',
    value: '17',
    support: '2 encaixes confirmados',
  },
  {
    title: 'Serviço mais realizado',
    value: 'Design de sobrancelhas',
    support: '9 atendimentos hoje',
  },
];

const topServices = [
  { name: 'Design de sobrancelhas', quantity: 42, share: '31%' },
  { name: 'Escova modelada', quantity: 28, share: '21%' },
  { name: 'Hidratação capilar', quantity: 22, share: '16%' },
  { name: 'Manicure premium', quantity: 18, share: '13%' },
];

const upcomingAppointments = [
  {
    time: '13:30',
    client: 'Marina Costa',
    service: 'Design de sobrancelhas + henna',
    professional: 'Ana Paula',
  },
  {
    time: '14:15',
    client: 'Camila Rocha',
    service: 'Escova modelada',
    professional: 'Fernanda',
  },
  {
    time: '15:00',
    client: 'Aline Souza',
    service: 'Limpeza de pele profunda',
    professional: 'Ana Paula',
  },
  {
    time: '16:40',
    client: 'Julia Martins',
    service: 'Manicure premium',
    professional: 'Patrícia',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard"
        subtitle="Visão resumida do desempenho diário e mensal do estúdio de beleza."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="bg-white/90">
            <CardHeader className="mb-2">
              <CardDescription className="text-xs uppercase tracking-[0.14em] text-coffee-espresso">
                {card.title}
              </CardDescription>
              <CardTitle className="text-xl leading-tight text-coffee-darkRoast sm:text-2xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <p className="inline-flex rounded-full bg-coffee-mocha/10 px-3 py-1 text-xs font-medium text-coffee-mocha">
                {card.support}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr,1fr]">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Próximos agendamentos</CardTitle>
            <CardDescription>Lista mockada com os horários mais próximos para acompanhamento rápido.</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <li
                  key={`${appointment.time}-${appointment.client}`}
                  className="flex flex-col gap-2 rounded-2xl border border-coffee-cappuccino/60 bg-coffee-latte/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-coffee-darkRoast">{appointment.client}</p>
                    <p className="text-xs text-coffee-espresso sm:text-sm">{appointment.service}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="rounded-full bg-coffee-mocha px-2.5 py-1 font-semibold text-coffee-latte">
                      {appointment.time}
                    </span>
                    <span className="text-coffee-hazelnut">{appointment.professional}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Serviços mais realizados</CardTitle>
            <CardDescription>Resumo dos serviços com maior volume no mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topServices.map((service) => (
                <li key={service.name} className="rounded-xl border border-coffee-cappuccino/60 bg-coffee-latte/60 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-coffee-darkRoast">
                    <span>{service.name}</span>
                    <span>{service.quantity}</span>
                  </div>
                  <div className="h-2 rounded-full bg-coffee-cappuccino/70">
                    <div className="h-2 rounded-full bg-coffee-mocha" style={{ width: service.share }} />
                  </div>
                  <p className="mt-1 text-xs text-coffee-espresso">{service.share} do total de atendimentos</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Receita por semana (em breve)</CardTitle>
            <CardDescription>Espaço reservado para gráfico de tendência de faturamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-52 items-end gap-2 rounded-2xl border border-dashed border-coffee-macchiato/80 bg-coffee-latte/60 p-4">
              {[30, 45, 38, 55, 68, 48, 62].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-lg bg-coffee-mocha/35" style={{ height: `${height}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Ocupação da agenda (em breve)</CardTitle>
            <CardDescription>Área preparada para gráfico de distribuição por período.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-coffee-macchiato/80 bg-coffee-latte/60 text-center">
              <p className="max-w-64 text-sm text-coffee-espresso">
                Integração futura com indicadores em tempo real para apoiar decisões do dia a dia.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
