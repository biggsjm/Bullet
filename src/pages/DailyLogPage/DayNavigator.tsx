import styles from './DayNavigator.module.css';

interface Props {
  currentDate: string;
  onDateChange: (date: string) => void;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DayNavigator({ currentDate, onDateChange }: Props) {
  const isToday = currentDate === todayStr();

  return (
    <div className={styles.nav}>
      <button
        className={styles.btn}
        onClick={() => onDateChange(addDays(currentDate, -1))}
        aria-label="Previous day"
        type="button"
      >
        ‹
      </button>
      <input
        type="date"
        className={styles.datePicker}
        value={currentDate}
        onChange={(e) => onDateChange(e.target.value)}
        aria-label="Select date"
      />
      <button
        className={styles.btn}
        onClick={() => onDateChange(addDays(currentDate, 1))}
        aria-label="Next day"
        type="button"
      >
        ›
      </button>
      {!isToday && (
        <button
          className={styles.todayBtn}
          onClick={() => onDateChange(todayStr())}
          type="button"
        >
          Today
        </button>
      )}
    </div>
  );
}
