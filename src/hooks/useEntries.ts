import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Entry, BulletType, TaskState, Signifier } from '../db/models';

export function useEntriesByDate(date: string) {
  return useLiveQuery(
    () => db.entries.where('date').equals(date).sortBy('sortOrder'),
    [date],
    []
  );
}

export function useEntriesByCollection(collectionId: number | undefined) {
  return useLiveQuery(
    () =>
      collectionId != null
        ? db.entries.where('collectionId').equals(collectionId).sortBy('sortOrder')
        : [],
    [collectionId],
    []
  );
}

export function useEntriesForMonth(yearMonth: string) {
  // Get all entries for a given month (YYYY-MM)
  return useLiveQuery(
    () =>
      db.entries
        .where('date')
        .between(yearMonth + '-01', yearMonth + '-32', true, false)
        .toArray(),
    [yearMonth],
    []
  );
}

export async function addEntry(
  params: {
    content: string;
    date: string;
    bulletType?: BulletType;
    signifier?: Signifier;
    collectionId?: number | null;
  }
): Promise<number | undefined> {
  const count = await db.entries.where('date').equals(params.date).count();
  const now = Date.now();
  return db.entries.add({
    bulletType: params.bulletType ?? 'task',
    taskState: (params.bulletType ?? 'task') === 'task' ? 'incomplete' : null,
    signifier: params.signifier ?? null,
    content: params.content,
    collectionId: params.collectionId ?? null,
    date: params.date,
    createdAt: now,
    updatedAt: now,
    sortOrder: count,
  });
}

export async function updateEntry(id: number, changes: Partial<Entry>) {
  return db.entries.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteEntry(id: number) {
  return db.entries.delete(id);
}

export function cycleTaskState(current: TaskState | null): TaskState | null {
  if (current === null) return null;
  const order: TaskState[] = ['incomplete', 'complete', 'migrated', 'scheduled'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

export async function reorderEntries(_date: string, orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    db.entries.update(id, { sortOrder: index, updatedAt: Date.now() })
  );
  await Promise.all(updates);
}

export async function reorderCollectionEntries(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    db.entries.update(id, { sortOrder: index, updatedAt: Date.now() })
  );
  await Promise.all(updates);
}

export async function searchEntries(query: string): Promise<Entry[]> {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return db.entries
    .filter((entry) => entry.content.toLowerCase().includes(lower))
    .toArray();
}

export async function migrateEntry(entryId: number, targetDate: string) {
  const entry = await db.entries.get(entryId);
  if (!entry) return;

  // Mark original entry as migrated
  await db.entries.update(entryId, {
    taskState: 'migrated',
    updatedAt: Date.now(),
  });

  // Create new entry at target date
  const count = await db.entries.where('date').equals(targetDate).count();
  const now = Date.now();
  await db.entries.add({
    bulletType: entry.bulletType,
    taskState: 'incomplete',
    signifier: entry.signifier,
    content: entry.content,
    collectionId: entry.collectionId,
    date: targetDate,
    createdAt: now,
    updatedAt: now,
    sortOrder: count,
  });
}
