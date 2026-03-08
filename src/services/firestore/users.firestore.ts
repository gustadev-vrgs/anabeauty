import { User } from '@/types';
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from './base';

const COLLECTION_NAME = 'users';

export async function createUser(payload: User): Promise<User> {
  return createDocument<User>(COLLECTION_NAME, payload);
}

export async function listUsers(): Promise<User[]> {
  return listDocuments<User>(COLLECTION_NAME);
}

export async function getUserById(id: string): Promise<User | null> {
  return getDocumentById<User>(COLLECTION_NAME, id);
}

export async function updateUser(id: string, payload: Partial<Omit<User, 'id'>>): Promise<void> {
  return updateDocument<User>(COLLECTION_NAME, id, payload);
}

export async function deleteUser(id: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, id);
}
