import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEntriesByDate, addEntry } from '../../hooks/useEntries';
import { EntryList } from '../../components/entry/EntryList';
import { EntryInput } from '../../components/entry/EntryInput';
import { DayNavigator } from './DayNavigator';
import type { BulletType, Signifier } from '../../db/models';
import styles from './DailyLogPage.module.css';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DailyLogPage() {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(
    () => (location.state as { date?: string } | null)?.date || todayStr()
  );
  const entries = useEntriesByDate(currentDate);

  useEffect(() => {
    const stateDate = (location.state as { date?: string } | null)?.date;
    if (stateDate) setCurrentDate(stateDate);
  }, [location.state]);

  const handleAdd = (content: string, bulletType: BulletType, signifier: Signifier) => {
    addEntry({ content, date: currentDate, bulletType, signifier });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Daily Log</h2>
        <p className={styles.date}>{formatDate(currentDate)}</p>
      </header>
      <DayNavigator currentDate={currentDate} onDateChange={setCurrentDate} />
      <EntryList entries={entries} emptyMessage="No entries for this day" />
      <EntryInput onAdd={handleAdd} placeholder="Add to today's log..." />
    </div>
  );
}
