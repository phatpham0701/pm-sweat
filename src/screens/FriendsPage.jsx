import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/chrome';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useFriendship } from '../hooks/useFriendship';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { useAuthStore } from '../stores/authStore';
import { useBadgeStore } from '../stores/badgeStore';
import { checkAndAwardBadges } from '../services/badgeService';
import FriendCard from '../components/friends/FriendCard';
import FriendSearch from '../components/friends/FriendSearch';
import ActivityFeed from '../components/feed/ActivityFeed';
import ComparisonWidget from '../components/common/ComparisonWidget';
import { useIsMobile } from '../hooks/useIsMobile';

const SECTIONS = [
  { id: 'friends', label: 'Following' },
  { id: 'search',  label: 'Discover' },
  { id: 'feed',    label: 'Activity Feed' },
];

export default function FriendsPage({ onNav }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { loadBadges } = useBadgeStore();
  const [section, setSection] = useState('friends');
  const [selectedFriend, setSelectedFriend] = useState(null);

  const { entries, userEntry } = useLeaderboard('global');
  const { friends, addFriend, removeFriend, isFriend } = useFriendship();

  useEffect(() => {
    if (user?.id) loadBadges(user.id);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const { activities } = useActivityFeed();

  const handleNav = (key) => {
    if (onNav) onNav(key);
    else navigate(key === 'landing' ? '/' : `/${key}`);
  };

  const handleToggle = (athlete) => {
    if (isFriend(athlete.id)) {
      removeFriend(athlete.id);
    } else {
      addFriend(athlete.id);
      if (user?.id) checkAndAwardBadges(user.id);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--ink-04)' }}>
      <AppNav onNav={handleNav} active="friends" />

      <main className="app-main-content" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 16px 80px' : 32 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="t-h1" style={{ marginBottom: 4 }}>Friends</h1>
          <p className="t-small">Compare with athletes. Compete together.</p>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--hairline)' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500,
                color: section === s.id ? 'var(--navy)' : 'var(--muted)',
                borderBottom: section === s.id ? '2px solid var(--navy)' : '2px solid transparent',
                marginBottom: -1, transition: 'all 150ms',
              }}
            >
              {s.label}
              {s.id === 'friends' && friends.length > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 10, fontFamily: 'var(--font-mono)',
                  background: 'var(--navy)', color: 'white', padding: '1px 5px', borderRadius: 10,
                }}>
                  {friends.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Following */}
        {section === 'friends' && (
          friends.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏃</div>
              <div className="t-h3" style={{ marginBottom: 8 }}>No one followed yet</div>
              <p className="t-small">Go to Discover to find athletes to follow.</p>
              <button onClick={() => setSection('search')} className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                Discover athletes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {friends.map(friend => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onCompare={() => setSelectedFriend(friend)}
                  onRemove={() => removeFriend(friend.id)}
                />
              ))}
            </div>
          )
        )}

        {/* Discover */}
        {section === 'search' && (
          <FriendSearch
            athletes={entries.filter(a => !a.isCurrentUser)}
            isFriend={isFriend}
            onToggle={handleToggle}
          />
        )}

        {/* Activity feed */}
        {section === 'feed' && <ActivityFeed activities={activities} />}

        {/* Comparison modal */}
        {selectedFriend && (
          <ComparisonWidget
            friend={selectedFriend}
            userEntry={userEntry}
            onClose={() => setSelectedFriend(null)}
          />
        )}
      </main>
    </div>
  );
}
