import { useState, useRef, useEffect } from 'react';
import type { Entry, BulletType, Signifier } from '../../db/models';
import { cycleTaskState, updateEntry } from '../../hooks/useEntries';
import { useUndoDelete } from '../../hooks/useUndoDelete';
import { BulletSignifier } from './BulletSignifier';
import { MigrationModal } from './MigrationModal';
import styles from './EntryItem.module.css';

interface Props {
  entry: Entry;
}

export function EntryItem({ entry }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [editBulletType, setEditBulletType] = useState<BulletType>(entry.bulletType);
  const [editSignifier, setEditSignifier] = useState<Signifier>(entry.signifier);
  const [showMigration, setShowMigration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { deleteWithUndo } = useUndoDelete();

  const canMigrate = entry.bulletType === 'task' && entry.taskState === 'incomplete';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCycleState = () => {
    if (entry.bulletType === 'task') {
      const nextState = cycleTaskState(entry.taskState);
      updateEntry(entry.id!, { taskState: nextState });
    }
  };

  const handleStartEdit = () => {
    setEditContent(entry.content);
    setEditBulletType(entry.bulletType);
    setEditSignifier(entry.signifier);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editContent.trim();
    const hasChanges =
      trimmed !== entry.content ||
      editBulletType !== entry.bulletType ||
      editSignifier !== entry.signifier;

    if (trimmed && hasChanges) {
      updateEntry(entry.id!, {
        content: trimmed,
        bulletType: editBulletType,
        signifier: editSignifier,
        taskState: editBulletType === 'task' ? (entry.taskState || 'incomplete') : null,
      });
    }
    setIsEditing(false);
  };

  const cycleEditType = () => {
    const types: BulletType[] = ['task', 'event', 'note'];
    const currentIndex = types.indexOf(editBulletType);
    setEditBulletType(types[(currentIndex + 1) % types.length]);
  };

  const toggleEditSignifier = (sig: 'priority' | 'inspiration') => {
    setEditSignifier(editSignifier === sig ? null : sig);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteWithUndo(entry);
  };

  const isComplete = entry.taskState === 'complete';
  const isMigrated = entry.taskState === 'migrated' || entry.taskState === 'scheduled';

  const bulletSymbols: Record<BulletType, string> = {
    task: '•',
    event: '○',
    note: '-',
  };

  if (isEditing) {
    return (
      <div className={styles.item} role="listitem">
        <div className={styles.editRow}>
          <button
            type="button"
            className={styles.typeToggle}
            onClick={cycleEditType}
            aria-label={`Type: ${editBulletType}. Click to change.`}
          >
            {bulletSymbols[editBulletType]}
          </button>
          <input
            ref={inputRef}
            className={styles.editInput}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            aria-label="Edit entry"
          />
          <button
            type="button"
            className={`${styles.signifierBtn} ${editSignifier === 'priority' ? styles.active : ''}`}
            onClick={() => toggleEditSignifier('priority')}
            aria-label="Toggle priority"
          >
            *
          </button>
          <button
            type="button"
            className={`${styles.signifierBtn} ${editSignifier === 'inspiration' ? styles.active : ''}`}
            onClick={() => toggleEditSignifier('inspiration')}
            aria-label="Toggle inspiration"
          >
            !
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.item} role="listitem">
        <BulletSignifier
          bulletType={entry.bulletType}
          taskState={entry.taskState}
          signifier={entry.signifier}
          onCycleState={handleCycleState}
        />
        <span
          className={`${styles.content} ${isComplete ? styles.complete : ''} ${isMigrated ? styles.migrated : ''}`}
          onClick={handleStartEdit}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleStartEdit()}
          aria-label={`Edit: ${entry.content}`}
        >
          {entry.content}
        </span>
        {canMigrate && (
          <button
            className={styles.migrateBtn}
            onClick={() => setShowMigration(true)}
            aria-label="Migrate entry"
            type="button"
          >
            →
          </button>
        )}
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Delete entry"
          type="button"
        >
          ×
        </button>
      </div>
      {showMigration && (
        <MigrationModal
          entryId={entry.id!}
          onClose={() => setShowMigration(false)}
        />
      )}
    </>
  );
}
