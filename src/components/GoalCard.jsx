import React from 'react';
import { Icon } from './brand';

const GOAL_TYPE_LABELS = {
  workouts_per_week: 'Workouts / Week',
  total_credits:     'Total Credits (sv)',
  distance_km:       'Total Distance (km)',
};

const PERIOD_COLORS = {
  weekly:  'var(--mint)',
  monthly: 'var(--indigo)',
  yearly:  '#F59E0B',
};

export default function GoalCard({ goal, onDelete }) {
  const pct = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  const done = goal.is_completed;

  return (
    <div className="card" style={{
      padding: 20,
      borderColor: done ? 'rgba(16,185,129,0.3)' : undefined,
      background: done ? 'rgba(16,185,129,0.03)' : 'white',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            {GOAL_TYPE_LABELS[goal.goal_type] || goal.goal_type}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{goal.title}</div>
          {goal.description && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{goal.description}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
          {done && (
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--mint)', background: 'rgba(16,185,129,0.12)', padding: '3px 8px', borderRadius: 999 }}>
              Done
            </span>
          )}
          <button
            onClick={onDelete}
            style={{
              width: 28, height: 28, borderRadius: 6, border: '1px solid var(--hairline)',
              background: 'transparent', cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Delete goal"
          >
            <Icon.Trash size={13} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{pct}% complete</span>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--navy)', fontWeight: 600 }}>
            {goal.current_value} / {goal.target_value}
          </span>
        </div>
        <div style={{ height: 7, background: 'var(--ink-04)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: done ? 'var(--mint)' : 'var(--navy)',
            borderRadius: 999,
            transition: 'width 600ms ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
          color: PERIOD_COLORS[goal.period] || 'var(--muted)',
        }}>
          {goal.period}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Since {new Date(goal.start_date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
