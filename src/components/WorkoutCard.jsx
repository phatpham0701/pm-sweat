import React from 'react';
import { Icon } from './brand';

const ACTIVITY_META = {
  running:  { icon: 'Run',      label: 'Running',  color: 'var(--mint)' },
  cycling:  { icon: 'Bike',     label: 'Cycling',  color: 'var(--indigo)' },
  strength: { icon: 'Dumbbell', label: 'Strength', color: '#F59E0B' },
  swimming: { icon: 'Swim',     label: 'Swimming', color: '#0EA5E9' },
};

const INTENSITY_COLOR = {
  easy:     'var(--mint)',
  moderate: '#F59E0B',
  hard:     '#EF4444',
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WorkoutCard({ workout, onClick }) {
  const meta = ACTIVITY_META[workout.activity_type] || ACTIVITY_META.running;
  const IC = Icon[meta.icon];
  const intensityColor = INTENSITY_COLOR[workout.intensity_level] || 'var(--muted)';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', background: 'white',
        border: '1px solid var(--hairline)', borderRadius: 14,
        padding: '16px 20px', cursor: 'pointer', transition: 'all 150ms',
        boxShadow: '0 1px 3px rgba(7,19,38,0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(7,19,38,0.10)';
        e.currentTarget.style.borderColor = 'rgba(7,19,38,0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(7,19,38,0.05)';
        e.currentTarget.style.borderColor = 'var(--hairline)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'var(--ink-04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IC size={18} color={meta.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{meta.label}</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {formatDate(workout.created_at)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="t-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--mint)' }}>
            +{workout.sweat_credits_earned}
          </div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>sv</div>
        </div>
      </div>

      <div style={{
        marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8, textAlign: 'center',
        paddingTop: 12, borderTop: '1px solid var(--hairline)',
      }}>
        <Stat label="Duration" value={`${workout.duration_minutes}m`} />
        {workout.distance_km > 0
          ? <Stat label="Distance" value={`${workout.distance_km}km`} />
          : <Stat label="Distance" value="—" />
        }
        <Stat label="Intensity" value={workout.intensity_level} valueColor={intensityColor} />
        <Stat label="Avg HR" value={`${workout.avg_heart_rate}bpm`} />
      </div>
    </button>
  );
}

function Stat({ label, value, valueColor }) {
  return (
    <div>
      <div className="t-mono" style={{ fontSize: 12, fontWeight: 600, color: valueColor || 'var(--navy)', textTransform: 'capitalize' }}>
        {value}
      </div>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
