import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/chrome';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useFriendship } from '../hooks/useFriendship';
import RankBadge from '../components/leaderboards/RankBadge';
import LeaderboardTable from '../components/leaderboards/LeaderboardTable';
import { useIsMobile } from '../hooks/useIsMobile';

const TABS = [
  { id: 'global',   label: 'Global' },
  { id: 'weekly',   label: 'Weekly' },
  { id: 'running',  label: 'Running' },
  { id: 'cycling',  label: 'Cycling' },
  { id: 'strength', label: 'Strength' },
  { id: 'friends',  label: 'Friends' },
];

export default function LeaderboardsPage({ onNav }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('global');

  const { entries, userEntry, loading, error } = useLeaderboard(activeTab);
  const { friendIds, addFriend, removeFriend, isFriend } = useFriendship();

  const handleNav = (key) => {
    if (onNav) onNav(key);
    else navigate(key === 'landing' ? '/' : `/${key}`);
  };

  const handleFriendToggle = (entry) => {
    isFriend(entry.id) ? removeFriend(entry.id) : addFriend(entry.id);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--ink-04)' }}>
      <AppNav onNav={handleNav} active="leaderboards" />

      <main className="app-main-content" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 16px 80px' : 32 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="t-h1" style={{ marginBottom: 4 }}>Leaderboards</h1>
          <p className="t-small">Climb the ranks. Prove yourself.</p>
        </div>

        {/* Current user rank card */}
        {userEntry && (
          <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <RankBadge rank={userEntry.rank} score={userEntry.globalScore} size="lg" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-eyebrow" style={{ marginBottom: 4 }}>Your global rank</div>
              <div className="t-h3">{userEntry.name}</div>
              <div className="t-small">#{userEntry.rank} · {userEntry.globalScore.toLocaleString()} pts</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="t-eyebrow" style={{ marginBottom: 4 }}>This week</div>
              <div className="t-mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--mint)' }}>
                {userEntry.weeklyScore}
              </div>
              <div className="t-small">pts earned</div>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 16,
          borderBottom: '1px solid var(--hairline)',
          overflowX: 'auto',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                color: activeTab === tab.id ? 'var(--navy)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--navy)' : '2px solid transparent',
                marginBottom: -1, transition: 'all 150ms',
              }}
            >
              {tab.label}
              {tab.id === 'friends' && friendIds.size > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 10, fontFamily: 'var(--font-mono)',
                  background: 'var(--navy)', color: 'white', padding: '1px 5px', borderRadius: 10,
                }}>
                  {friendIds.size}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div style={{ padding: 16, background: 'rgba(239,68,68,0.08)', color: '#dc2626', borderRadius: 8 }}>
            Failed to load leaderboard
          </div>
        )}

        {!loading && entries.length === 0 && activeTab === 'friends' && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <div className="t-h3" style={{ marginBottom: 8 }}>No friends followed yet</div>
            <p className="t-small">Follow athletes from the Global tab to see them here.</p>
            <button onClick={() => setActiveTab('global')} className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
              Browse Global
            </button>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <LeaderboardTable
            entries={entries}
            userRank={userEntry?.rank}
            onFriendToggle={activeTab !== 'friends' ? handleFriendToggle : undefined}
            friendIds={friendIds}
          />
        )}
      </main>
    </div>
  );
}
