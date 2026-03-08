import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '@/firebase/client';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore não configurado neste ambiente.');
  }

  return db;
}

function getAuthenticatedUserId() {
  const userId = auth?.currentUser?.uid;

  if (!userId) {
    throw new Error('Acesso negado. Faça login para continuar.');
  }

  return userId;
}

export async function createDocument<T extends { id: string }>(
  collectionName: string,
  payload: T,
): Promise<T> {
  const firestore = ensureDb();
  const userId = getAuthenticatedUserId();
  const now = new Date().toISOString();
  const documentRef = doc(collection(firestore, collectionName), payload.id);

  await setDoc(documentRef, {
    ...payload,
    ownerId: userId,
    createdBy: userId,
    updatedAt: now,
  });

  return payload;
}

export async function listDocuments<T>(collectionName: string): Promise<T[]> {
  const firestore = ensureDb();
  const userId = getAuthenticatedUserId();
  const collectionRef = collection(firestore, collectionName);
  const snapshot = await getDocs(
    query(collectionRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc')),
  );
  return snapshot.docs.map((document) => document.data() as T);
}

export async function getDocumentById<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const firestore = ensureDb();
  const userId = getAuthenticatedUserId();
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as { ownerId?: string } & T;

  if (data.ownerId !== userId) {
    throw new Error('Você não tem permissão para acessar este registro.');
  }

  return data;
}

export async function updateDocument<T extends { id: string }>(
  collectionName: string,
  id: string,
  payload: Partial<Omit<T, 'id'>>,
): Promise<void> {
  const firestore = ensureDb();
  getAuthenticatedUserId();

  await setDoc(doc(firestore, collectionName, id), {
    ...payload,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const firestore = ensureDb();
  getAuthenticatedUserId();
  await deleteDoc(doc(firestore, collectionName, id));
}
