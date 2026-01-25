import { useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { db } from '../db/database';
import type { Entry } from '../db/models';

export function useUndoDelete() {
  const { addToast } = useToast();

  const deleteWithUndo = useCallback(
    async (entry: Entry) => {
      // Store the entry data for potential restore
      const entryData = { ...entry };
      const entryId = entry.id!;

      // Delete the entry
      await db.entries.delete(entryId);

      // Show toast with undo action
      addToast({
        message: 'Entry deleted',
        type: 'undo',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: async () => {
            // Restore the entry with original data (but new id)
            const { id, ...dataWithoutId } = entryData;
            await db.entries.add({
              ...dataWithoutId,
              updatedAt: Date.now(),
            });
          },
        },
      });
    },
    [addToast]
  );

  return { deleteWithUndo };
}
