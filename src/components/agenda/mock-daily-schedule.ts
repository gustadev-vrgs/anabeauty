export type ScheduleAppointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  procedureName: string;
};

export type ScheduleBlock = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
};

export const mockDailyAppointments: ScheduleAppointment[] = [
  {
    id: 'apt-001',
    date: '2026-03-09',
    startTime: '09:00',
    endTime: '10:00',
    clientName: 'Mariana Alves',
    procedureName: 'Corte + Escova',
  },
  {
    id: 'apt-002',
    date: '2026-03-09',
    startTime: '11:30',
    endTime: '12:30',
    clientName: 'Carla Menezes',
    procedureName: 'Coloração Raiz',
  },
  {
    id: 'apt-003',
    date: '2026-03-10',
    startTime: '14:00',
    endTime: '15:00',
    clientName: 'Sofia Martins',
    procedureName: 'Manicure Completa',
  },
  {
    id: 'apt-004',
    date: '2026-03-11',
    startTime: '16:30',
    endTime: '17:30',
    clientName: 'Renata Lima',
    procedureName: 'Design de Sobrancelhas',
  },
];

export const mockDailyBlocks: ScheduleBlock[] = [
  {
    id: 'blk-001',
    date: '2026-03-09',
    startTime: '13:00',
    endTime: '14:00',
    reason: 'Almoço',
  },
  {
    id: 'blk-002',
    date: '2026-03-10',
    startTime: '10:00',
    endTime: '10:30',
    reason: 'Pausa técnica',
  },
  {
    id: 'blk-003',
    date: '2026-03-11',
    startTime: '18:00',
    endTime: '19:00',
    reason: 'Horário reservado',
  },
];

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function generateHalfHourSlots(startHour = 8, endHour = 20) {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === endHour && minute > 0) {
        continue;
      }

      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }

  return slots;
}
