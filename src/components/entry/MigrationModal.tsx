import { useState, useEffect, useRef } from 'react';
import { migrateEntry } from '../../hooks/useEntries';
import { useToast } from '../../context/ToastContext';
import { toLocalDateStr } from '../../utils/date';
import styles from './MigrationModal.module.css';

interface Props {
  entryId: number;
  onClose: () => void;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function MigrationModal({ entryId, onClose }: Props) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const [targetDate, setTargetDate] = useState(formatDateForInput(tomorrow));
  const { addToast } = useToast();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleMigrate = async () => {
    if (!targetDate) return;

    await migrateEntry(entryId, targetDate);
    addToast({
      message: `Entry migrated to ${targetDate}`,
      type: 'success',
    });
    onClose();
  };

  const isValidDate = targetDate && targetDate >= toLocalDateStr();

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-title"
    >
      <div className={styles.modal}>
        <h3 id="migration-title" className={styles.title}>
          Migrate Entry
        </h3>

        <input
          type="date"
          className={styles.dateInput}
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          min={toLocalDateStr()}
          aria-label="Target date"
        />

        <div className={styles.quickDates}>
          <button
            type="button"
            className={styles.quickDate}
            onClick={() => setTargetDate(formatDateForInput(tomorrow))}
          >
            Tomorrow
          </button>
          <button
            type="button"
            className={styles.quickDate}
            onClick={() => setTargetDate(formatDateForInput(nextWeek))}
          >
            Next week
          </button>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.migrateBtn}
            onClick={handleMigrate}
            disabled={!isValidDate}
          >
            Migrate
          </button>
        </div>
      </div>
    </div>
  );
}
