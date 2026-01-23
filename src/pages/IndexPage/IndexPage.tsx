import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections, addCollection, deleteCollection } from '../../hooks/useCollections';
import { searchEntries } from '../../hooks/useEntries';
import type { Entry } from '../../db/models';
import styles from './IndexPage.module.css';

export function IndexPage() {
  const collections = useCollections('custom');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Entry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchEntries(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateCollection = () => {
    const title = newTitle.trim();
    if (!title) return;
    addCollection({ title }).then((id) => {
      setNewTitle('');
      setShowNewForm(false);
      navigate(`/collection/${id}`);
    });
  };

  const handleDeleteCollection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this collection and all its entries?')) {
      deleteCollection(id);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Index</h2>
      </header>

      <div className={styles.searchSection}>
        <input
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search all entries..."
          aria-label="Search entries"
        />
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.slice(0, 20).map((entry) => (
              <div key={entry.id} className={styles.searchResult}>
                <span className={styles.resultDate}>{entry.date}</span>
                <span className={styles.resultContent}>{entry.content}</span>
              </div>
            ))}
            {searchResults.length > 20 && (
              <p className={styles.moreResults}>
                +{searchResults.length - 20} more results
              </p>
            )}
          </div>
        )}
        {isSearching && <p className={styles.searching}>Searching...</p>}
      </div>

      <section className={styles.builtIn}>
        <h3 className={styles.sectionTitle}>Built-in Logs</h3>
        <div className={styles.logList}>
          <button className={styles.logItem} onClick={() => navigate('/daily')} type="button">
            <span className={styles.logIcon}>•</span>
            <span>Daily Log</span>
          </button>
          <button className={styles.logItem} onClick={() => navigate('/monthly')} type="button">
            <span className={styles.logIcon}>▦</span>
            <span>Monthly Log</span>
          </button>
          <button className={styles.logItem} onClick={() => navigate('/future')} type="button">
            <span className={styles.logIcon}>»</span>
            <span>Future Log</span>
          </button>
        </div>
      </section>

      <section className={styles.collections}>
        <div className={styles.collectionsHeader}>
          <h3 className={styles.sectionTitle}>Collections</h3>
          <button
            className={styles.newBtn}
            onClick={() => setShowNewForm(!showNewForm)}
            type="button"
            aria-label="New collection"
          >
            + New
          </button>
        </div>

        {showNewForm && (
          <div className={styles.newForm}>
            <input
              className={styles.newInput}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Collection name..."
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
              autoFocus
              aria-label="New collection name"
            />
            <button
              className={styles.createBtn}
              onClick={handleCreateCollection}
              disabled={!newTitle.trim()}
              type="button"
            >
              Create
            </button>
          </div>
        )}

        {collections.length === 0 && !showNewForm && (
          <p className={styles.empty}>No custom collections yet</p>
        )}

        <div className={styles.collectionList}>
          {collections.map((col) => (
            <div
              key={col.id}
              className={styles.collectionItem}
              onClick={() => navigate(`/collection/${col.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/collection/${col.id}`)}
            >
              <span className={styles.collectionTitle}>{col.title}</span>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteCollection(col.id!, e)}
                aria-label={`Delete ${col.title}`}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
