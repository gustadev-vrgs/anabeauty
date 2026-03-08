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

export async function createDocument<T extends { id: string }>(
  collectionName: string,
  payload: T,
): Promise<T> {
  const documentRef = doc(collection(db, collectionName), payload.id);
  await setDoc(documentRef, payload);
  return payload;
}

export async function listDocuments<T>(collectionName: string): Promise<T[]> {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(query(collectionRef, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((document) => document.data() as T);
}

export async function getDocumentById<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const snapshot = await getDoc(doc(db, collectionName, id));
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
  await setDoc(doc(db, collectionName, id), payload, { merge: true });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}
