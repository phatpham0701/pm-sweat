import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useFriendshipStore } from '../stores/friendshipStore';

export function useFriendship() {
  const athletes = useLeaderboardStore(s => s.athletes);
  const friendIds = useFriendshipStore(s => s.friendIds);
  const addFriend = useFriendshipStore(s => s.addFriend);
  const removeFriend = useFriendshipStore(s => s.removeFriend);
  const isFriend = useFriendshipStore(s => s.isFriend);

  const friends = athletes.filter(a => !a.isCurrentUser && friendIds.has(a.id));

  return { friends, friendIds, addFriend, removeFriend, isFriend };
}
