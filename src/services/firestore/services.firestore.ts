import { Service } from '@/types';
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from './base';

const COLLECTION_NAME = 'services';

export async function createService(payload: Service): Promise<Service> {
  return createDocument<Service>(COLLECTION_NAME, payload);
}

export async function listServices(): Promise<Service[]> {
  return listDocuments<Service>(COLLECTION_NAME);
}

export async function getServiceById(id: string): Promise<Service | null> {
  return getDocumentById<Service>(COLLECTION_NAME, id);
}

export async function updateService(id: string, payload: Partial<Omit<Service, 'id'>>): Promise<void> {
  return updateDocument<Service>(COLLECTION_NAME, id, payload);
}

export async function deleteService(id: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, id);
}
