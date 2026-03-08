import { Client } from '@/types';
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from './base';

const COLLECTION_NAME = 'clients';

export async function createClient(payload: Client): Promise<Client> {
  return createDocument<Client>(COLLECTION_NAME, payload);
}

export async function listClients(): Promise<Client[]> {
  return listDocuments<Client>(COLLECTION_NAME);
}

export async function getClientById(id: string): Promise<Client | null> {
  return getDocumentById<Client>(COLLECTION_NAME, id);
}

export async function updateClient(id: string, payload: Partial<Omit<Client, 'id'>>): Promise<void> {
  return updateDocument<Client>(COLLECTION_NAME, id, payload);
}

export async function deleteClient(id: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, id);
}
