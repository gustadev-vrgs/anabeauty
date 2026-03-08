export type ProcedureCategory =
  | 'piercing'
  | 'cabelo'
  | 'maquiagem'
  | 'sobrancelha'
  | 'outros';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceProcedure {
  id: string;
  name: string;
  category: ProcedureCategory;
  durationInMinutes: number;
  basePrice: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  price: number;
  notes?: string;
  status: 'confirmed' | 'blocked' | 'done' | 'canceled';
}

export interface TimeBlock {
  id: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
}
