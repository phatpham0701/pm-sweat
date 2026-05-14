import React from 'react';

const TIER_RARITY = [
  { tier: 1, percent: 100, label: "All members" },
  { tier: 2, percent: 62,  label: "62% of users" },
  { tier: 3, percent: 28,  label: "28% of users" },
  { tier: 4, percent: 8,   label: "8% of users" },
  { tier: 5, percent: 2,   label: "Elite — top 2% of users" },
];

export function RarityIndicator({ tierNum }) {
  const current = TIER_RARITY[tierNum - 1];
  if (!current) return null;

  const barColor = tierNum === 5
    ? 'var(--grad-full)'
    : 'var(--indigo)';

  return (
    <div style={{ marginTop: 20 }}>
      <div className="t-eyebrow">Rarity</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--hairline)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${current.percent}%`,
            background: barColor,
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 28, textAlign: 'right' }}>
          {current.percent}%
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{current.label}</div>
    </div>
  );
}
