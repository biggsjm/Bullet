import { useState } from 'react';
import {
  useFutureLogEntries,
  addFutureLogEntry,
  deleteFutureLogEntry,
  updateFutureLogEntry,
} from '../../hooks/useFutureLog';
import { cycleTaskState } from '../../hooks/useEntries';
import { BulletSignifier } from '../../components/entry/BulletSignifier';
import styles from './FutureLogPage.module.css';

function getNext6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-').map(Number);
  const d = new Date(year, month - 1);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function FutureLogPage() {
  const months = getNext6Months();
  const allEntries = useFutureLogEntries();
  const [newContent, setNewContent] = useState<Record<string, string>>({});

  const entriesByMonth = months.reduce(
    (acc, m) => {
      acc[m] = allEntries.filter((e) => e.month === m);
      return acc;
    },
    {} as Record<string, typeof allEntries>
  );

  const handleAdd = (month: string) => {
    const content = (newContent[month] || '').trim();
    if (!content) return;
    addFutureLogEntry({ month, content });
    setNewContent((prev) => ({ ...prev, [month]: '' }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, month: string) => {
    if (e.key === 'Enter') {
      handleAdd(month);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Future Log</h2>
        <p className={styles.subtitle}>Plan ahead for the next 6 months</p>
      </header>

      <div className={styles.grid}>
        {months.map((month) => (
          <section key={month} className={styles.card}>
            <h3 className={styles.monthTitle}>{formatMonth(month)}</h3>
            <div className={styles.entries}>
              {entriesByMonth[month]?.map((entry) => (
                <div key={entry.id} className={styles.entry}>
                  <BulletSignifier
                    bulletType={entry.bulletType}
                    taskState={entry.taskState}
                    signifier={entry.signifier}
                    onCycleState={() => {
                      if (entry.bulletType === 'task') {
                        updateFutureLogEntry(entry.id!, {
                          taskState: cycleTaskState(entry.taskState),
                        });
                      }
                    }}
                  />
                  <span className={styles.entryContent}>{entry.content}</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteFutureLogEntry(entry.id!)}
                    aria-label="Delete entry"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addRow}>
              <input
                className={styles.addInput}
                value={newContent[month] || ''}
                onChange={(e) =>
                  setNewContent((prev) => ({ ...prev, [month]: e.target.value }))
                }
                onKeyDown={(e) => handleKeyDown(e, month)}
                placeholder="Add entry..."
                aria-label={`Add entry for ${formatMonth(month)}`}
              />
              <button
                className={styles.addBtn}
                onClick={() => handleAdd(month)}
                disabled={!(newContent[month] || '').trim()}
                type="button"
                aria-label="Add"
              >
                +
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
