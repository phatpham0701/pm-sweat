import { create } from 'zustand';

const STORAGE_KEY = 'pmsweat_friends';

function loadFriends() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFriends(friendIds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...friendIds]));
}

export const useFriendshipStore = create((set, get) => ({
  friendIds: loadFriends(),

  addFriend: (athleteId) => {
    const friendIds = new Set(get().friendIds);
    friendIds.add(athleteId);
    saveFriends(friendIds);
    set({ friendIds });
  },

  removeFriend: (athleteId) => {
    const friendIds = new Set(get().friendIds);
    friendIds.delete(athleteId);
    saveFriends(friendIds);
    set({ friendIds });
  },

  isFriend: (athleteId) => get().friendIds.has(athleteId),
}));
