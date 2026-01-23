import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntriesForMonth, addEntry } from '../../hooks/useEntries';
import { EntryList } from '../../components/entry/EntryList';
import { EntryInput } from '../../components/entry/EntryInput';
import type { BulletType, Signifier } from '../../db/models';
import styles from './MonthlyLogPage.module.css';

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function addMonths(ym: string, offset: number): string {
  const [year, month] = ym.split('-').map(Number);
  const d = new Date(year, month - 1 + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getDaysInMonth(ym: string): number {
  const [year, month] = ym.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(ym: string): number {
  const [year, month] = ym.split('-').map(Number);
  return new Date(year, month - 1, 1).getDay();
}

export function MonthlyLogPage() {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth);
  const entries = useEntriesForMonth(currentMonth);
  const navigate = useNavigate();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfWeek(currentMonth);

  // Which days have entries
  const daysWithEntries = new Set(
    entries.map((e) => Number(e.date.split('-')[2]))
  );

  const handleDayClick = (day: number) => {
    const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
    navigate('/daily', { state: { date: dateStr } });
  };

  const handleAdd = (content: string, bulletType: BulletType, signifier: Signifier) => {
    // Add entry for the first of the month as a month-level task
    addEntry({
      content,
      date: currentMonth + '-01',
      bulletType,
      signifier,
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Monthly Log</h2>
        <div className={styles.monthNav}>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            aria-label="Previous month"
            type="button"
          >
            ‹
          </button>
          <span className={styles.monthLabel}>{formatMonth(currentMonth)}</span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            aria-label="Next month"
            type="button"
          >
            ›
          </button>
        </div>
      </header>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className={styles.weekday}>{d}</span>
          ))}
        </div>
        <div className={styles.days}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} className={styles.emptyDay} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasEntries = daysWithEntries.has(day);
            const isToday =
              currentMonth === getCurrentMonth() &&
              day === new Date().getDate();
            return (
              <button
                key={day}
                className={`${styles.day} ${isToday ? styles.today : ''}`}
                onClick={() => handleDayClick(day)}
                type="button"
                aria-label={`${formatMonth(currentMonth)} ${day}${hasEntries ? ', has entries' : ''}`}
              >
                <span>{day}</span>
                {hasEntries && <span className={styles.dot} />}
              </button>
            );
          })}
        </div>
      </div>

      <section className={styles.taskSection}>
        <h3 className={styles.sectionTitle}>Month Tasks</h3>
        <EntryList entries={entries} emptyMessage="No entries this month" />
        <EntryInput onAdd={handleAdd} placeholder="Add month task..." />
      </section>
    </div>
  );
}
