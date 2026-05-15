import React from 'react';
import { Avatar } from '../leaderboards/RankCard';

const TYPE_ICONS = {
  badge_earned: '🏅',
  rank_milestone: '📈',
  streak_started: '🔥',
  friend_joined: '👋',
};

function formatTimeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return `${Math.max(1, mins)}m ago`;
}

function getMessage({ type, user, metadata }) {
  switch (type) {
    case 'badge_earned': return `${user.name} earned the ${metadata.badgeName} badge`;
    case 'rank_milestone': return `${user.name} reached #${metadata.rank} in the global rankings`;
    case 'streak_started': return `${user.name} is on a ${metadata.streakCount}-day streak`;
    case 'friend_joined': return `${user.name} joined PM Sweat`;
    default: return `${user.name} achieved something great`;
  }
}

export default function ActivityItem({ activity }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: 'white', border: '1px solid var(--hairline)', borderRadius: 10,
    }}>
      <div style={{ fontSize: 20, flexShrink: 0 }}>{TYPE_ICONS[activity.type] || '⚡'}</div>
      <Avatar name={activity.user.name} size={34} gradient="var(--grad-momentum)" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{getMessage(activity)}</div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          @{activity.user.handle} · {formatTimeAgo(activity.createdAt)}
        </div>
      </div>
    </div>
  );
}
