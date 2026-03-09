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
  blockType?: 'horario_unico' | 'intervalo' | 'dia_inteiro';
  notes?: string;
};

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
