import { useParams, useNavigate } from 'react-router-dom';
import { useCollection, updateCollection } from '../../hooks/useCollections';
import { useEntriesByCollection, addEntry } from '../../hooks/useEntries';
import { EntryList } from '../../components/entry/EntryList';
import { EntryInput } from '../../components/entry/EntryInput';
import type { BulletType, Signifier } from '../../db/models';
import { useState } from 'react';
import styles from './CollectionPage.module.css';

export function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const collectionId = id ? Number(id) : undefined;
  const collection = useCollection(collectionId);
  const entries = useEntriesByCollection(collectionId);
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  if (!collection) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Collection not found</p>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/index')}
          type="button"
        >
          ← Back to Index
        </button>
      </div>
    );
  }

  const handleAdd = (content: string, bulletType: BulletType, signifier: Signifier) => {
    addEntry({
      content,
      date: new Date().toISOString().slice(0, 10),
      bulletType,
      signifier,
      collectionId: collection.id,
    });
  };

  const handleEditTitle = () => {
    setEditTitle(collection.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== collection.title) {
      updateCollection(collection.id!, { title: trimmed });
    }
    setIsEditingTitle(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/index')}
          type="button"
          aria-label="Back to index"
        >
          ←
        </button>
        {isEditingTitle ? (
          <input
            className={styles.titleInput}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            autoFocus
            aria-label="Edit collection title"
          />
        ) : (
          <h2
            className={styles.title}
            onClick={handleEditTitle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleEditTitle()}
          >
            {collection.title}
          </h2>
        )}
      </header>

      <EntryList entries={entries} emptyMessage="No entries in this collection" />
      <EntryInput onAdd={handleAdd} placeholder="Add to collection..." />
    </div>
  );
}
