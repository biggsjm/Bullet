import { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../db/database';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const entries = await db.entries.toArray();
    const collections = await db.collections.toArray();
    const futureLogEntries = await db.futureLogEntries.toArray();

    const data = { entries, collections, futureLogEntries, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bullet-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.entries || !data.collections || !data.futureLogEntries) {
        alert('Invalid backup file format.');
        return;
      }

      if (!confirm('This will replace all existing data. Continue?')) return;

      await db.entries.clear();
      await db.collections.clear();
      await db.futureLogEntries.clear();

      await db.entries.bulkAdd(data.entries.map((e: Record<string, unknown>) => {
        const { id, ...rest } = e;
        return rest;
      }));
      await db.collections.bulkAdd(data.collections.map((c: Record<string, unknown>) => {
        const { id, ...rest } = c;
        return rest;
      }));
      await db.futureLogEntries.bulkAdd(data.futureLogEntries.map((f: Record<string, unknown>) => {
        const { id, ...rest } = f;
        return rest;
      }));

      alert('Data imported successfully!');
    } catch {
      alert('Failed to import data. Please check the file format.');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone.')) return;
    if (!confirm('Really delete everything?')) return;

    await db.entries.clear();
    await db.collections.clear();
    await db.futureLogEntries.clear();
    alert('All data cleared.');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Settings</h2>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Appearance</h3>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Theme</span>
            <span className={styles.settingDesc}>
              Currently using {theme} mode
            </span>
          </div>
          <button
            className={styles.toggleBtn}
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '◐ Dark' : '◑ Light'}
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Data</h3>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Export</span>
            <span className={styles.settingDesc}>
              Download all data as JSON
            </span>
          </div>
          <button className={styles.actionBtn} onClick={handleExport} type="button">
            Export
          </button>
        </div>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Import</span>
            <span className={styles.settingDesc}>
              Restore from a backup file
            </span>
          </div>
          <label className={styles.actionBtn}>
            Import
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className={styles.hiddenInput}
              aria-label="Import data file"
            />
          </label>
        </div>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Clear Data</span>
            <span className={styles.settingDesc}>
              Delete all entries and collections
            </span>
          </div>
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={handleClearData}
            type="button"
          >
            Clear
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <p className={styles.about}>
          Bullet Journal PWA v1.0.0
        </p>
        <p className={styles.aboutSub}>
          A minimalist digital bullet journal. Data stored locally on your device.
        </p>
      </section>
    </div>
  );
}
