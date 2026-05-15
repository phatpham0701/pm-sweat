import React from 'react';
import WorkoutCard from './WorkoutCard';
import { Icon } from './brand';

export default function WorkoutList({ workouts, onSelect, emptyMessage, onCta, ctaLabel }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div style={{
        padding: '48px 24px', textAlign: 'center',
        border: '1px dashed var(--hairline)', borderRadius: 14,
        color: 'var(--muted)',
      }}>
        <Icon.Dumbbell size={32} color="var(--ink-12)" />
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>
          {emptyMessage || 'No workouts yet. Connect Garmin or add one manually.'}
        </div>
        {onCta && (
          <button
            onClick={onCta}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 16 }}
          >
            {ctaLabel || 'View all'}
          </button>
        )}
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
