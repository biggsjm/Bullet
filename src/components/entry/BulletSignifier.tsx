import type { BulletType, TaskState, Signifier } from '../../db/models';
import styles from './BulletSignifier.module.css';

interface Props {
  bulletType: BulletType;
  taskState?: TaskState | null;
  signifier?: Signifier;
  onCycleState?: () => void;
}

const bulletChars: Record<BulletType, string> = {
  task: '•',
  event: '○',
  note: '-',
};

const taskStateChars: Record<TaskState, string> = {
  incomplete: '•',
  complete: '×',
  migrated: '>',
  scheduled: '<',
};

const signifierChars: Record<string, string> = {
  priority: '*',
  inspiration: '!',
};

export function BulletSignifier({ bulletType, taskState, signifier, onCycleState }: Props) {
  const bullet =
    bulletType === 'task' && taskState ? taskStateChars[taskState] : bulletChars[bulletType];

  const isComplete = taskState === 'complete';
  const isMigrated = taskState === 'migrated' || taskState === 'scheduled';

  return (
    <button
      className={`${styles.bullet} ${isComplete ? styles.complete : ''} ${isMigrated ? styles.migrated : ''}`}
      onClick={onCycleState}
      aria-label={`${bulletType} - ${taskState ?? bulletType}. Click to change state.`}
      type="button"
    >
      {signifier && <span className={styles.signifier}>{signifierChars[signifier]}</span>}
      <span className={styles.char}>{bullet}</span>
    </button>
  );
}
