import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/client';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore não configurado neste ambiente.');
  }

  return db;
}

export async function createDocument<T extends { id: string }>(
  collectionName: string,
  payload: T,
): Promise<T> {
  const firestore = ensureDb();
  const documentRef = doc(collection(firestore, collectionName), payload.id);
  await setDoc(documentRef, payload);
  return payload;
}

export async function listDocuments<T>(collectionName: string): Promise<T[]> {
  const firestore = ensureDb();
  const collectionRef = collection(firestore, collectionName);
  const snapshot = await getDocs(query(collectionRef, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((document) => document.data() as T);
}

export async function getDocumentById<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const firestore = ensureDb();
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as T;
}

export async function updateDocument<T extends { id: string }>(
  collectionName: string,
  id: string,
  payload: Partial<Omit<T, 'id'>>,
): Promise<void> {
  const firestore = ensureDb();
  await setDoc(doc(firestore, collectionName, id), payload, { merge: true });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const firestore = ensureDb();
  await deleteDoc(doc(firestore, collectionName, id));
}
