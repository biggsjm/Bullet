import Dexie, { type EntityTable } from 'dexie';
import type { Entry, Collection, FutureLogEntry } from './models';

class BulletDatabase extends Dexie {
  entries!: EntityTable<Entry, 'id'>;
  collections!: EntityTable<Collection, 'id'>;
  futureLogEntries!: EntityTable<FutureLogEntry, 'id'>;

  constructor() {
    super('BulletJournalDB');
    this.version(1).stores({
      entries: '++id, date, collectionId, bulletType, [date+sortOrder]',
      collections: '++id, type, date, isArchived, sortOrder',
      futureLogEntries: '++id, month, [month+sortOrder]',
    });
  }
}

export const db = new BulletDatabase();
