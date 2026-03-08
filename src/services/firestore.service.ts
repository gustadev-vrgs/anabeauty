import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Appointment, Client, Service } from '@/types';

export async function listClients() {
  const snapshot = await getDocs(query(collection(db, 'clients')));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Client, 'id'>) }));
}

export async function listServices() {
  const snapshot = await getDocs(query(collection(db, 'services')));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Service, 'id'>) }));
}

export async function createAppointment(payload: Omit<Appointment, 'id'>) {
  await addDoc(collection(db, 'appointments'), payload);
}
