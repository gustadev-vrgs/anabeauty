import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';
import { Appointment, Client, ServiceProcedure, TimeBlock } from '@/types/domain';

const clientsRef = collection(db, 'clients');
const servicesRef = collection(db, 'services');
const appointmentsRef = collection(db, 'appointments');
const blocksRef = collection(db, 'timeBlocks');

const toIso = (value: unknown) => (value instanceof Timestamp ? value.toDate().toISOString() : String(value));

export async function listClients(): Promise<Client[]> {
  const snapshot = await getDocs(query(clientsRef, orderBy('name')));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Client, 'id'>) }));
}

export async function createClient(payload: Omit<Client, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(clientsRef, { ...payload, createdAt: new Date().toISOString() });
}

export async function listServices(): Promise<ServiceProcedure[]> {
  const snapshot = await getDocs(query(servicesRef, orderBy('name')));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ServiceProcedure, 'id'>) }));
}

export async function createService(payload: Omit<ServiceProcedure, 'id'>): Promise<void> {
  await addDoc(servicesRef, payload);
}

export async function listAppointmentsByDate(dateKey: string): Promise<Appointment[]> {
  const snapshot = await getDocs(
    query(appointmentsRef, where('dateKey', '==', dateKey), orderBy('startsAt', 'asc')),
  );

  return snapshot.docs.map((item) => {
    const raw = item.data() as Omit<Appointment, 'id'>;
    return {
      ...raw,
      id: item.id,
      startsAt: toIso(raw.startsAt),
      endsAt: toIso(raw.endsAt),
    };
  });
}

export async function createAppointment(payload: Omit<Appointment, 'id'>): Promise<void> {
  await addDoc(appointmentsRef, {
    ...payload,
    dateKey: payload.startsAt.slice(0, 10),
  });
}

export async function updateAppointment(id: string, payload: Partial<Appointment>): Promise<void> {
  await updateDoc(doc(db, 'appointments', id), payload);
}

export async function listBlocksByDate(dateKey: string): Promise<TimeBlock[]> {
  const snapshot = await getDocs(query(blocksRef, where('dateKey', '==', dateKey), orderBy('startsAt', 'asc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<TimeBlock, 'id'>) }));
}

export async function createBlock(payload: Omit<TimeBlock, 'id'>): Promise<void> {
  await addDoc(blocksRef, {
    ...payload,
    dateKey: payload.startsAt.slice(0, 10),
  });
}
