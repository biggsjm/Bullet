import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Entry } from '../../db/models';
import { reorderEntries, reorderCollectionEntries } from '../../hooks/useEntries';
import { SortableEntryItem } from './SortableEntryItem';
import styles from './SortableEntryList.module.css';

interface Props {
  entries: Entry[];
  date?: string;
  collectionId?: number;
  emptyMessage?: string;
}

export function SortableEntryList({ entries, date, collectionId, emptyMessage = 'No entries yet' }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...entries];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);

        const orderedIds = newOrder.map((e) => e.id!);
        if (collectionId != null) {
          reorderCollectionEntries(orderedIds);
        } else if (date) {
          reorderEntries(date, orderedIds);
        }
      }
    }
  };

  if (entries.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={entries.map((e) => e.id!)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.list} role="list" aria-label="Entries">
          {entries.map((entry) => (
            <SortableEntryItem key={entry.id} entry={entry} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
