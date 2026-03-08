import { Appointment } from '@/types';
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from './base';

const COLLECTION_NAME = 'appointments';

export async function createAppointment(payload: Appointment): Promise<Appointment> {
  return createDocument<Appointment>(COLLECTION_NAME, payload);
}

export async function listAppointments(): Promise<Appointment[]> {
  return listDocuments<Appointment>(COLLECTION_NAME);
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  return getDocumentById<Appointment>(COLLECTION_NAME, id);
}

export async function updateAppointment(
  id: string,
  payload: Partial<Omit<Appointment, 'id'>>,
): Promise<void> {
  return updateDocument<Appointment>(COLLECTION_NAME, id, payload);
}

export async function deleteAppointment(id: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, id);
}
