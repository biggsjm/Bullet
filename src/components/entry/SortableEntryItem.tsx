import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Entry } from '../../db/models';
import { EntryItem } from './EntryItem';
import styles from './SortableEntryList.module.css';

interface Props {
  entry: Entry;
}

export function SortableEntryItem({ entry }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableItem} ${isDragging ? styles.dragging : ''}`}
    >
      <div
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </div>
      <div className={styles.entryWrapper}>
        <EntryItem entry={entry} />
      </div>
    </div>
  );
}
