import React from 'react';
import { Icon } from './brand';

const MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365];

function multiplierColor(m) {
  if (m >= 1.5) return '#EF4444';
  if (m >= 1.3) return '#F97316';
  if (m >= 1.2) return '#F59E0B';
  if (m >= 1.1) return 'var(--mint)';
  return 'var(--muted)';
}

export default function StreakWidget({ currentStreak = 0, longestStreak = 0, multiplier = 1.0 }) {
  const mc = multiplierColor(multiplier);
  const next = MILESTONES.find(m => m > currentStreak);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Fire size={18} color="#F97316" />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>Streak</span>
        </div>
        <span style={{
          fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: mc, background: `${mc}1a`, padding: '3px 10px', borderRadius: 999,
        }}>
          {multiplier.toFixed(1)}x multiplier
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: next ? 14 : 0 }}>
        <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--ink-04)', borderRadius: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: currentStreak > 0 ? mc : 'var(--muted)' }}>
            {currentStreak}
          </div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
            Current
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--ink-04)', borderRadius: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--navy)' }}>
            {longestStreak}
          </div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
            Best
          </div>
        </div>
      </div>

      {next && (
        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--ink-04)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Bolt size={12} color="var(--muted)" />
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {next - currentStreak} day{next - currentStreak !== 1 ? 's' : ''} to {next}-day milestone
          </span>
        </div>
      )}
    </div>
  );
}
