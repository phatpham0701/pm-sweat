import React, { useState } from 'react';

function StatRow({ label, yours, theirs, higherIsBetter = true }) {
  const youWin = higherIsBetter ? yours >= theirs : yours <= theirs;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--hairline)',
    }}>
      <div className="t-mono" style={{ fontSize: 14, fontWeight: 600, color: youWin ? 'var(--mint)' : 'var(--navy)' }}>
        {typeof yours === 'number' ? yours.toLocaleString() : yours}
      </div>
      <div className="t-eyebrow" style={{ textAlign: 'center', minWidth: 80 }}>{label}</div>
      <div className="t-mono" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right', color: !youWin ? 'var(--mint)' : 'var(--navy)' }}>
        {typeof theirs === 'number' ? theirs.toLocaleString() : theirs}
      </div>
    </div>
  );
}

export default function ComparisonWidget({ friend, userEntry, onClose }) {
  const [timeframe, setTimeframe] = useState('global');

  if (!userEntry) return null;

  const youScore = timeframe === 'weekly' ? userEntry.weeklyScore : userEntry.globalScore;
  const theirScore = timeframe === 'weekly' ? friend.weeklyScore : friend.globalScore;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(7,19,38,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="t-h3">Stats Comparison</h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--muted)', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* Timeframe toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--ink-04)', borderRadius: 8, padding: 4 }}>
          {[{ id: 'global', label: 'All Time' }, { id: 'weekly', label: 'This Week' }].map(t => (
            <button key={t.id} onClick={() => setTimeframe(t.id)} style={{
              flex: 1, padding: '7px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              background: timeframe === t.id ? 'white' : 'transparent',
              color: timeframe === t.id ? 'var(--navy)' : 'var(--muted)',
              boxShadow: timeframe === t.id ? 'var(--sh-1)' : 'none', transition: 'all 150ms',
              cursor: 'pointer',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* You vs Friend labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>You</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>@{userEntry.handle}</div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>vs</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{friend.name}</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>@{friend.handle}</div>
          </div>
        </div>

        <StatRow label="Score" yours={youScore} theirs={theirScore} />
        <StatRow label="Rank" yours={userEntry.rank} theirs={friend.rank} higherIsBetter={false} />
        <StatRow label="Weekly" yours={userEntry.weeklyScore} theirs={friend.weeklyScore} />

        <div className="t-eyebrow" style={{ margin: '16px 0 8px' }}>By Category</div>
        {['running', 'cycling', 'strength'].map(cat => (
          <StatRow
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            yours={userEntry.categoryScores[cat] || 0}
            theirs={friend.categoryScores[cat] || 0}
          />
        ))}

        <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', marginTop: 24 }}>
          Close
        </button>
      </div>
    </div>
  );
}
