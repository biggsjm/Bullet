import type { Entry } from '../../db/models';
import { EntryItem } from './EntryItem';
import styles from './EntryList.module.css';

interface Props {
  entries: Entry[];
  emptyMessage?: string;
}

export function EntryList({ entries, emptyMessage = 'No entries yet' }: Props) {
  if (entries.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.list} role="list" aria-label="Entries">
      {entries.map((entry) => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
