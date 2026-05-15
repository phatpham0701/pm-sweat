import React from 'react';
import { Icon } from './brand';

const ACTIVITY_META = {
  running:  { icon: 'Run',      label: 'Running',  color: 'var(--mint)' },
  cycling:  { icon: 'Bike',     label: 'Cycling',  color: 'var(--indigo)' },
  strength: { icon: 'Dumbbell', label: 'Strength', color: '#F59E0B' },
  swimming: { icon: 'Swim',     label: 'Swimming', color: '#0EA5E9' },
};

const INTENSITY_COLOR = { easy: 'var(--mint)', moderate: '#F59E0B', hard: '#EF4444' };

function formatDateTime(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function WorkoutDetail({ workout, onClose }) {
  if (!workout) return null;
  const meta = ACTIVITY_META[workout.activity_type] || ACTIVITY_META.running;
  const IC = Icon[meta.icon];
  const intensityColor = INTENSITY_COLOR[workout.intensity_level] || 'var(--muted)';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(7,19,38,0.45)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white', borderRadius: 20, width: '100%', maxWidth: 480,
          boxShadow: '0 24px 64px rgba(7,19,38,0.18)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'var(--ink-04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IC size={20} color={meta.color} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{meta.label}</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {formatDateTime(workout.created_at)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--hairline)',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <Icon.ArrowRight size={14} color="var(--muted)" style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>

        {/* Credits hero */}
        <div style={{
          padding: '24px', textAlign: 'center',
          background: 'linear-gradient(135deg, var(--ink-04) 0%, rgba(16,185,129,0.06) 100%)',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Sweat Credits Earned</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--mint)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            +{workout.sweat_credits_earned}
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 11, fontFamily: 'var(--font-mono)',
              background: intensityColor + '22', color: intensityColor, textTransform: 'capitalize',
            }}>
              {workout.intensity_level}
            </span>
            {workout.source === 'mock' && (
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontFamily: 'var(--font-mono)',
                background: 'var(--ink-04)', color: 'var(--muted)',
              }}>
                mock data
              </span>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <DetailStat icon="Clock" label="Duration" value={`${workout.duration_minutes} min`} />
          {workout.distance_km > 0
            ? <DetailStat icon="Map" label="Distance" value={`${workout.distance_km} km`} />
            : <DetailStat icon="Map" label="Distance" value="—" />
          }
          <DetailStat icon="Fire" label="Calories" value={`${workout.calories_burned} kcal`} />
          <DetailStat icon="Heart" label="Avg Heart Rate" value={`${workout.avg_heart_rate} bpm`} />
          <DetailStat icon="Bolt" label="Max Heart Rate" value={`${workout.max_heart_rate} bpm`} />
          <DetailStat
            icon="Verify"
            label="Verified"
            value={workout.verified ? 'Yes' : 'No'}
            valueColor={workout.verified ? 'var(--mint)' : 'var(--muted)'}
          />
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ icon, label, value, valueColor }) {
  const IC = Icon[icon];
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10, background: 'var(--ink-04)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <IC size={16} color="var(--muted)" />
      <div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: valueColor || 'var(--navy)', marginTop: 2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}
