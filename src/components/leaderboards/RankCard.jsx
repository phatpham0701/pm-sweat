import React from 'react';

const MEDAL_BG = {
  1: 'linear-gradient(135deg, #FFD700, #FFA500)',
  2: 'linear-gradient(135deg, #D4D4D4, #A8A8A8)',
  3: 'linear-gradient(135deg, #CD7F32, #A0522D)',
};

export function Avatar({ name, size = 36, gradient = 'var(--grad-earned)' }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'var(--font-mono)', fontWeight: 500,
      fontSize: Math.round(size * 0.36), flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Trend({ change }) {
  if (change > 0) return <span style={{ color: 'var(--mint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>↑{change}</span>;
  if (change < 0) return <span style={{ color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: 12 }}>↓{Math.abs(change)}</span>;
  return <span style={{ color: 'var(--muted)', fontSize: 12 }}>→</span>;
}

export default function RankCard({ entry, isSticky = false }) {
  if (!entry) return null;
  const isTop3 = entry.rank <= 3;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: entry.isCurrentUser ? 'rgba(99,102,241,0.06)' : 'white',
      border: entry.isCurrentUser ? '1.5px solid rgba(99,102,241,0.25)' : '1px solid var(--hairline)',
      borderRadius: 12,
      ...(isSticky ? { position: 'sticky', top: 0, zIndex: 10, boxShadow: 'var(--sh-2)' } : {}),
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isTop3 ? MEDAL_BG[entry.rank] : 'var(--ink-04)',
        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
        color: isTop3 ? (entry.rank === 1 ? '#3a2500' : entry.rank === 2 ? '#2a2a2a' : 'white') : 'var(--navy)',
      }}>
        #{entry.rank}
      </div>

      <Avatar name={entry.name} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          {entry.name}
          {entry.isCurrentUser && (
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              background: 'var(--indigo)', color: 'white', padding: '1px 6px', borderRadius: 4,
            }}>YOU</span>
          )}
        </div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          @{entry.handle} · {entry.city}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="t-mono" style={{ fontWeight: 600, fontSize: 15 }}>
          {entry.globalScore.toLocaleString()}
        </div>
        <Trend change={entry.trendChange} />
      </div>
    </div>
  );
}
