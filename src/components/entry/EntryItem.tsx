import { useState, useRef, useEffect } from 'react';
import type { Entry } from '../../db/models';
import { cycleTaskState, updateEntry, deleteEntry } from '../../hooks/useEntries';
import { BulletSignifier } from './BulletSignifier';
import styles from './EntryItem.module.css';

interface Props {
  entry: Entry;
}

export function EntryItem({ entry }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== entry.content) {
      updateEntry(entry.id!, { content: trimmed });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteEntry(entry.id!);
  };

  const isComplete = entry.taskState === 'complete';
  const isMigrated = entry.taskState === 'migrated' || entry.taskState === 'scheduled';

  return (
    <div className={styles.item} role="listitem">
      <BulletSignifier
        bulletType={entry.bulletType}
        taskState={entry.taskState}
        signifier={entry.signifier}
        onCycleState={handleCycleState}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.editInput}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          aria-label="Edit entry"
        />
      ) : (
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
  );
}
