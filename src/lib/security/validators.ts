import { Client, Service } from '@/types';

export type ValidationResult<T> = { success: true; data: T } | { success: false; message: string };

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeString(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function sanitizeClientPayload(payload: Omit<Client, 'id' | 'createdAt'>): ValidationResult<Omit<Client, 'id' | 'createdAt'>> {
  const normalizedPhone = payload.phone.replace(/\D/g, '');

  const data: Omit<Client, 'id' | 'createdAt'> = {
    name: normalizeString(payload.name),
    phone: normalizedPhone,
    email: payload.email ? normalizeString(payload.email).toLowerCase() : undefined,
    instagram: payload.instagram ? normalizeString(payload.instagram) : undefined,
    notes: payload.notes ? payload.notes.trim() : undefined,
    address: payload.address ? normalizeString(payload.address) : undefined,
    birthDate: payload.birthDate || undefined,
  };

  if (!data.name) {
    return { success: false, message: 'Nome da cliente é obrigatório.' };
  }

  if (data.phone.length < 10) {
    return { success: false, message: 'Telefone inválido. Informe DDD + número.' };
  }

  if (data.email && !isValidEmail(data.email)) {
    return { success: false, message: 'E-mail da cliente inválido.' };
  }

  return { success: true, data };
}

export function sanitizeServicePayload(payload: Omit<Service, 'id' | 'createdAt'>): ValidationResult<Omit<Service, 'id' | 'createdAt'>> {
  const price = Number(payload.price);
  const durationMinutes = Number(payload.durationMinutes);

  const data: Omit<Service, 'id' | 'createdAt'> = {
    name: normalizeString(payload.name),
    category: normalizeString(payload.category ?? ''),
    description: payload.description?.trim() || undefined,
    availableForBooking: Boolean(payload.availableForBooking),
    imageUrl: payload.imageUrl?.trim() || undefined,
    price,
    durationMinutes,
  };

  if (!data.name || !data.category) {
    return { success: false, message: 'Nome e categoria do serviço são obrigatórios.' };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { success: false, message: 'Valor do serviço inválido.' };
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes < 1) {
    return { success: false, message: 'Duração do serviço inválida.' };
  }

  if (data.imageUrl && !/^https:\/\//.test(data.imageUrl)) {
    return { success: false, message: 'A imagem precisa ser uma URL segura (https://).' };
  }

  return { success: true, data };
}
