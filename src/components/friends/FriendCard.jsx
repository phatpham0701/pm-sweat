import React from 'react';
import { Avatar } from '../leaderboards/RankCard';

export default function FriendCard({ friend, onCompare, onRemove }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
      <Avatar name={friend.name} size={44} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{friend.name}</div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          @{friend.handle} · {friend.city}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <span className="t-mono" style={{ fontSize: 12 }}>#{friend.rank} global</span>
          <span className="t-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
            {friend.globalScore.toLocaleString()} pts
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onCompare} className="btn btn-secondary btn-sm">
          Compare
        </button>
        <button
          onClick={onRemove}
          style={{
            height: 34, padding: '0 12px', borderRadius: 999, fontSize: 13, fontWeight: 500,
            border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626',
            background: 'rgba(239,68,68,0.04)', cursor: 'pointer',
          }}
        >
          Unfollow
        </button>
      </div>
    </div>
  );
}
