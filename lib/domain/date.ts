export const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function getMonthMatrix(currentDate: Date): Date[] {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function createDaySlots(step = 30): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour < 20; hour += 1) {
    for (let min = 0; min < 60; min += step) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    }
  }
  return slots;
}
