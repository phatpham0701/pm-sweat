import { useMemo } from 'react';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useFriendshipStore } from '../stores/friendshipStore';

const BADGE_NAMES = ['Foundation', 'Iron Streak', 'Sweat Pioneer', 'Verified Racer', 'Endurance Core'];
const ACTIVITY_TYPES = ['badge_earned', 'rank_milestone', 'streak_started', 'friend_joined'];

function dv(seed, range) {
  return Math.abs(((seed * 1664525 + 1013904223) | 0)) % range;
}

function buildActivities(athletes, friendIds) {
  const relevant = athletes.filter(a => friendIds.has(a.id) || a.isCurrentUser);
  if (relevant.length === 0) return [];

  const activities = [];
  relevant.forEach((athlete, idx) => {
    for (let j = 0; j < 3; j++) {
      const type = ACTIVITY_TYPES[dv(idx * 7 + j, ACTIVITY_TYPES.length)];
      const hoursAgo = dv(idx * 3 + j * 5, 72) + 1;
      activities.push({
        id: `act-${athlete.id}-${j}`,
        type,
        user: { id: athlete.id, name: athlete.name, handle: athlete.handle },
        metadata: {
          badgeName: BADGE_NAMES[dv(idx + j, BADGE_NAMES.length)],
          rank: athlete.rank,
          streakCount: dv(idx + j * 2, 14) + 3,
        },
        createdAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      });
    }
  });

  return activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
}

export function useActivityFeed() {
  const athletes = useLeaderboardStore(s => s.athletes);
  const loading = useLeaderboardStore(s => s.loading);
  const friendIds = useFriendshipStore(s => s.friendIds);

  const activities = useMemo(
    () => buildActivities(athletes, friendIds),
    [athletes, friendIds]
  );

  return { activities, loading };
}
