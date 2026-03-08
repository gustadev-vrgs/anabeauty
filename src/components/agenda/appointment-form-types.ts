export type AppointmentService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
};

export type AppointmentClient = {
  id: string;
  name: string;
  phone: string;
};

export type AppointmentFormValues = {
  date: string;
  horaInicio: string;
  servicoId: string;
  clienteId: string;
  duracao: number;
  valor: number;
  observacoes: string;
};

export type AppointmentConflict = {
  startTime: string;
  endTime: string;
  label: string;
};
