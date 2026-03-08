export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professional';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  durationInMinutes: number;
  price: number;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  price: number;
  notes?: string;
  status: 'confirmed' | 'done' | 'canceled' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlock {
  id: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}
