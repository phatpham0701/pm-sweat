import React from 'react';
import WorkoutCard from './WorkoutCard';
import { Icon } from './brand';

export default function WorkoutList({ workouts, onSelect, emptyMessage }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div style={{
        padding: '48px 24px', textAlign: 'center',
        border: '1px dashed var(--hairline)', borderRadius: 14,
        color: 'var(--muted)',
      }}>
        <Icon.Dumbbell size={32} color="var(--ink-12)" />
        <div style={{ marginTop: 12, fontSize: 14 }}>
          {emptyMessage || 'No workouts yet. Connect Garmin or add one manually.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {workouts.map(w => (
        <WorkoutCard
          key={w.id}
          workout={w}
          onClick={() => onSelect && onSelect(w)}
        />
      ))}
    </div>
  );
}
