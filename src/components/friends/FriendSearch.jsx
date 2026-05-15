import React, { useState, useMemo } from 'react';
import { Avatar } from '../leaderboards/RankCard';

export default function FriendSearch({ athletes, isFriend, onToggle }) {
  const [query, setQuery] = useState('');
  const [pendingIds, setPendingIds] = useState(new Set());

  const results = useMemo(() => {
    if (!query.trim()) return athletes.slice(0, 20);
    const q = query.toLowerCase();
    return athletes
      .filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.handle.toLowerCase().includes(q) ||
        (a.city || '').toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query, athletes]);

  function handleFollowClick(athlete) {
    setPendingIds(prev => new Set([...prev, athlete.id]));
    onToggle(athlete);
    setTimeout(() => {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(athlete.id);
        return next;
      });
    }, 700);
  }

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name, handle, or city..."
        style={{
          width: '100%', padding: '10px 14px', marginBottom: 16,
          border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
          fontSize: 14, fontFamily: 'var(--font-sans)',
          outline: 'none', color: 'var(--navy)', background: 'white',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {results.map(athlete => {
          const followed = isFriend(athlete.id);
          const pending = pendingIds.has(athlete.id);
          return (
            <div key={athlete.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: 'white', border: '1px solid var(--hairline)', borderRadius: 10,
              transition: 'border-color 200ms',
              borderColor: pending ? 'rgba(16,185,129,0.3)' : 'var(--hairline)',
            }}>
              <Avatar name={athlete.name} size={34} gradient="var(--grad-proof)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{athlete.name}</div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                  @{athlete.handle} · #{athlete.rank}
                </div>
              </div>
              <button
                onClick={() => handleFollowClick(athlete)}
                disabled={pending}
                style={{
                  height: 34, padding: '0 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                  border: '1px solid var(--hairline)',
                  background: pending
                    ? 'rgba(16,185,129,0.15)'
                    : followed ? 'rgba(16,185,129,0.08)' : 'var(--navy)',
                  color: pending || followed ? 'var(--mint)' : 'white',
                  cursor: pending ? 'default' : 'pointer',
                  transition: 'all 200ms', flexShrink: 0,
                }}
              >
                {pending ? 'Adding…' : followed ? 'Following ✓' : '+ Follow'}
              </button>
            </div>
          );
        })}

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
            No athletes found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
