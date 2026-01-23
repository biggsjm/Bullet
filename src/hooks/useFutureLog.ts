import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { BulletType, FutureLogEntry, Signifier } from '../db/models';

export function useFutureLogEntries(month?: string) {
  return useLiveQuery(
    () => {
      if (month) {
        return db.futureLogEntries.where('month').equals(month).sortBy('sortOrder');
      }
      return db.futureLogEntries.orderBy('month').toArray();
    },
    [month],
    []
  );
}

export async function addFutureLogEntry(params: {
  month: string;
  content: string;
  bulletType?: BulletType;
  signifier?: Signifier;
}): Promise<number | undefined> {
  const count = await db.futureLogEntries.where('month').equals(params.month).count();
  return db.futureLogEntries.add({
    month: params.month,
    content: params.content,
    bulletType: params.bulletType ?? 'task',
    taskState: (params.bulletType ?? 'task') === 'task' ? 'incomplete' : null,
    signifier: params.signifier ?? null,
    createdAt: Date.now(),
    sortOrder: count,
  });
}

export async function updateFutureLogEntry(id: number, changes: Partial<FutureLogEntry>) {
  return db.futureLogEntries.update(id, changes);
}

export async function deleteFutureLogEntry(id: number) {
  return db.futureLogEntries.delete(id);
}

export async function migrateFutureEntry(id: number, targetDate: string) {
  const entry = await db.futureLogEntries.get(id);
  if (!entry) return;

  const count = await db.entries.where('date').equals(targetDate).count();
  const now = Date.now();
  await db.entries.add({
    bulletType: entry.bulletType,
    taskState: entry.taskState,
    signifier: entry.signifier,
    content: entry.content,
    collectionId: null,
    date: targetDate,
    createdAt: now,
    updatedAt: now,
    sortOrder: count,
  });
  await db.futureLogEntries.delete(id);
}
