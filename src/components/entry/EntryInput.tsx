import { useState, useRef } from 'react';
import type { BulletType, Signifier } from '../../db/models';
import styles from './EntryInput.module.css';

interface Props {
  onAdd: (content: string, bulletType: BulletType, signifier: Signifier) => void;
  placeholder?: string;
}

export function EntryInput({ onAdd, placeholder = 'Add entry...' }: Props) {
  const [content, setContent] = useState('');
  const [bulletType, setBulletType] = useState<BulletType>('task');
  const [signifier, setSignifier] = useState<Signifier>(null);
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onAdd(trimmed, bulletType, signifier);
    setContent('');
    setSignifier(null);
    inputRef.current?.focus();
  };

  const bulletLabels: Record<BulletType, string> = {
    task: '• Task',
    event: '○ Event',
    note: '- Note',
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <button
          type="button"
          className={styles.typeToggle}
          onClick={() => setShowOptions(!showOptions)}
          aria-label={`Type: ${bulletType}. Click to change.`}
        >
          {bulletType === 'task' ? '•' : bulletType === 'event' ? '○' : '-'}
        </button>
        <input
          ref={inputRef}
          className={styles.input}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          aria-label="New entry content"
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!content.trim()}
          aria-label="Add entry"
        >
          +
        </button>
      </div>
      {showOptions && (
        <div className={styles.options}>
          <div className={styles.optionGroup}>
            {(Object.keys(bulletLabels) as BulletType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.optionBtn} ${bulletType === type ? styles.active : ''}`}
                onClick={() => { setBulletType(type); setShowOptions(false); }}
              >
                {bulletLabels[type]}
              </button>
            ))}
          </div>
          <div className={styles.optionGroup}>
            <button
              type="button"
              className={`${styles.optionBtn} ${signifier === 'priority' ? styles.active : ''}`}
              onClick={() => setSignifier(signifier === 'priority' ? null : 'priority')}
            >
              * Priority
            </button>
            <button
              type="button"
              className={`${styles.optionBtn} ${signifier === 'inspiration' ? styles.active : ''}`}
              onClick={() => setSignifier(signifier === 'inspiration' ? null : 'inspiration')}
            >
              ! Inspiration
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
