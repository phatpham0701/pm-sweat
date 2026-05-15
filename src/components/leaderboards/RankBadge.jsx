import React from 'react';

const STYLES = {
  gold:    { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#3a2500', border: '1.5px solid #FFD700' },
  silver:  { background: 'linear-gradient(135deg, #D4D4D4 0%, #A8A8A8 100%)', color: '#2a2a2a', border: '1.5px solid #C0C0C0' },
  bronze:  { background: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)', color: '#fff',    border: '1.5px solid #CD7F32' },
  default: { background: 'var(--ink-04)', color: 'var(--muted)',               border: '1px solid var(--hairline)' },
};

export default function RankBadge({ rank, score, size = 'md' }) {
  const tier = rank <= 10 ? 'gold' : rank <= 50 ? 'silver' : rank <= 100 ? 'bronze' : 'default';
  const dim = size === 'sm' ? 44 : size === 'lg' ? 72 : 56;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 15;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: dim, height: dim, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize,
        flexShrink: 0,
        ...STYLES[tier],
      }}>
        #{rank}
      </div>
      {score !== undefined && (
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          {score.toLocaleString()} pts
        </div>
      )}
    </div>
  );
}
