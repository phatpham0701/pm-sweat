import { useEffect } from 'react';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useFriendshipStore } from '../stores/friendshipStore';
import { useAuthStore } from '../stores/authStore';

export function useLeaderboard(tab = 'global') {
  const athletes = useLeaderboardStore(s => s.athletes);
  const loading = useLeaderboardStore(s => s.loading);
  const error = useLeaderboardStore(s => s.error);
  const load = useLeaderboardStore(s => s.load);
  const getEntries = useLeaderboardStore(s => s.getEntries);
  const friendIds = useFriendshipStore(s => s.friendIds);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (athletes.length === 0) load(user);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const entries = getEntries(tab, friendIds);
  const userEntry = athletes.find(a => a.isCurrentUser) || null;

  return { entries, userEntry, loading, error };
}
