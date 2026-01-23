import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Collection, CollectionType } from '../db/models';

export function useCollections(type?: CollectionType) {
  return useLiveQuery(
    () => {
      let query = db.collections.orderBy('sortOrder');
      if (type) {
        query = db.collections.where('type').equals(type);
      }
      return query.toArray();
    },
    [type],
    []
  );
}

export function useCollection(id: number | undefined) {
  return useLiveQuery(
    () => (id != null ? db.collections.get(id) : undefined),
    [id],
    undefined
  );
}

export async function addCollection(params: {
  title: string;
  type?: CollectionType;
  description?: string;
  icon?: string;
}): Promise<number | undefined> {
  const count = await db.collections.count();
  const now = Date.now();
  return db.collections.add({
    type: params.type ?? 'custom',
    title: params.title,
    date: null,
    description: params.description ?? '',
    icon: params.icon ?? '',
    createdAt: now,
    updatedAt: now,
    sortOrder: count,
    isArchived: false,
  });
}

export async function updateCollection(id: number, changes: Partial<Collection>) {
  return db.collections.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteCollection(id: number) {
  await db.entries.where('collectionId').equals(id).delete();
  return db.collections.delete(id);
}
