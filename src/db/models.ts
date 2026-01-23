export type BulletType = 'task' | 'event' | 'note';
export type TaskState = 'incomplete' | 'complete' | 'migrated' | 'scheduled';
export type Signifier = 'priority' | 'inspiration' | null;
export type CollectionType = 'daily' | 'monthly' | 'future' | 'custom';

export interface Entry {
  id?: number;
  bulletType: BulletType;
  taskState: TaskState | null;
  signifier: Signifier;
  content: string;
  collectionId: number | null;
  date: string; // YYYY-MM-DD
  createdAt: number;
  updatedAt: number;
  sortOrder: number;
}

export interface Collection {
  id?: number;
  type: CollectionType;
  title: string;
  date: string | null; // YYYY-MM-DD or YYYY-MM
  description: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
  sortOrder: number;
  isArchived: boolean;
}

export interface FutureLogEntry {
  id?: number;
  month: string; // YYYY-MM
  content: string;
  bulletType: BulletType;
  taskState: TaskState | null;
  signifier: Signifier;
  createdAt: number;
  sortOrder: number;
}
