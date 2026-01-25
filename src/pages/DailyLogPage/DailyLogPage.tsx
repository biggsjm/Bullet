import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useEntriesByDate, addEntry } from '../../hooks/useEntries';
import { SortableEntryList } from '../../components/entry/SortableEntryList';
import { EntryInput, type EntryInputRef } from '../../components/entry/EntryInput';
import { DayNavigator } from './DayNavigator';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { toLocalDateStr } from '../../utils/date';
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

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toLocalDateStr(d);
}

export function DailyLogPage() {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(
    () => (location.state as { date?: string } | null)?.date || toLocalDateStr()
  );
  const entries = useEntriesByDate(currentDate);
  const inputRef = useRef<EntryInputRef>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stateDate = (location.state as { date?: string } | null)?.date;
    if (stateDate) setCurrentDate(stateDate);
  }, [location.state]);

  const handleAdd = (content: string, bulletType: BulletType, signifier: Signifier) => {
    addEntry({ content, date: currentDate, bulletType, signifier });
  };

  const handleEditFirst = () => {
    const firstEntry = document.querySelector('[role="listitem"] [role="button"]');
    if (firstEntry instanceof HTMLElement) {
      firstEntry.click();
    }
  };

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, handler: () => inputRef.current?.focus(), description: 'Focus new entry input' },
    { key: 'e', ctrl: true, handler: handleEditFirst, description: 'Edit first entry' },
  ]);

  const goToPreviousDay = useCallback(() => {
    setCurrentDate((d) => addDays(d, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((d) => addDays(d, 1));
  }, []);

  useSwipeGesture(pageRef, {
    onSwipeLeft: goToNextDay,
    onSwipeRight: goToPreviousDay,
    threshold: 75,
  });

  return (
    <div ref={pageRef} className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Daily Log</h2>
        <p className={styles.date}>{formatDate(currentDate)}</p>
      </header>
      <DayNavigator currentDate={currentDate} onDateChange={setCurrentDate} />
      <SortableEntryList entries={entries} date={currentDate} emptyMessage="No entries for this day" />
      <EntryInput ref={inputRef} onAdd={handleAdd} placeholder="Add to today's log..." />
    </div>
  );
}
