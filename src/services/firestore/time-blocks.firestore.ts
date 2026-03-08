import { TimeBlock } from '@/types';
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from './base';

const COLLECTION_NAME = 'timeBlocks';

export async function createTimeBlock(payload: TimeBlock): Promise<TimeBlock> {
  return createDocument<TimeBlock>(COLLECTION_NAME, payload);
}

export async function listTimeBlocks(): Promise<TimeBlock[]> {
  return listDocuments<TimeBlock>(COLLECTION_NAME);
}

export async function getTimeBlockById(id: string): Promise<TimeBlock | null> {
  return getDocumentById<TimeBlock>(COLLECTION_NAME, id);
}

export async function updateTimeBlock(
  id: string,
  payload: Partial<Omit<TimeBlock, 'id'>>,
): Promise<void> {
  return updateDocument<TimeBlock>(COLLECTION_NAME, id, payload);
}

export async function deleteTimeBlock(id: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, id);
}
