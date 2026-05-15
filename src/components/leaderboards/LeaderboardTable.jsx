import React, { useState, useCallback } from 'react';
import { Avatar } from './RankCard';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Trend({ change }) {
  if (change > 0) return <span style={{ color: 'var(--mint)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>↑{change}</span>;
  if (change < 0) return <span style={{ color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: 11 }}>↓{Math.abs(change)}</span>;
  return <span style={{ color: 'var(--muted)', fontSize: 11 }}>→</span>;
}

export default function LeaderboardTable({ entries, userRank, onFriendToggle, friendIds = new Set() }) {
  const [visibleCount, setVisibleCount] = useState(25);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 25, entries.length));
  }, [entries.length]);

  if (!entries.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.slice(0, visibleCount).map((entry) => {
          const isUser = entry.isCurrentUser;
          const isFriend = friendIds.has(entry.id);
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: isUser ? 'rgba(99,102,241,0.06)' : 'white',
                border: isUser ? '1.5px solid rgba(99,102,241,0.2)' : '1px solid var(--hairline)',
              }}
            >
              <div style={{
                width: 32, textAlign: 'center', flexShrink: 0,
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                color: entry.rank <= 3 ? '#a0741e' : 'var(--muted)',
              }}>
                {MEDALS[entry.rank] || `#${entry.rank}`}
              </div>

              <Avatar name={entry.name} size={30} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  {entry.name}
                  {isUser && (
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', background: 'var(--indigo)', color: 'white', padding: '1px 5px', borderRadius: 4 }}>YOU</span>
                  )}
                  {isFriend && !isUser && (
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', background: 'var(--mint)', color: 'var(--navy)', padding: '1px 5px', borderRadius: 4 }}>FRIEND</span>
                  )}
                </div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>@{entry.handle}</div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="t-mono" style={{ fontWeight: 600, fontSize: 13 }}>
                  {entry.globalScore.toLocaleString()}
                </div>
                <Trend change={entry.trendChange} />
              </div>

              {!isUser && onFriendToggle && (
                <button
                  onClick={() => onFriendToggle(entry)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: '1px solid var(--hairline)',
                    background: isFriend ? 'rgba(16,185,129,0.08)' : 'transparent',
                    color: isFriend ? 'var(--mint)' : 'var(--muted)',
                    cursor: 'pointer', transition: 'all 150ms', flexShrink: 0, height: 30,
                  }}
                >
                  {isFriend ? 'Following' : '+ Follow'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {visibleCount < entries.length && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={loadMore} className="btn btn-secondary btn-sm">
            Load more ({entries.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
