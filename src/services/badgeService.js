import { useBadgeStore } from '../stores/badgeStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { useFriendshipStore } from '../stores/friendshipStore';
import { useGoalsStore } from '../stores/goalsStore';
import { BADGES_CONFIG } from '../constants/badges';

const ACTIVITY_TYPES = ['running', 'cycling', 'strength', 'swimming'];

export function checkAndAwardBadges(userId) {
  const { workouts, garminAuth, getStats } = useWorkoutStore.getState();
  const { awardBadge, hasBadge } = useBadgeStore.getState();
  const { addNotification } = useNotificationStore.getState();
  const { friendIds } = useFriendshipStore.getState();
  const { goals } = useGoalsStore.getState();

  const stats = getStats();
  const activityCounts = workouts.reduce((acc, w) => {
    acc[w.activity_type] = (acc[w.activity_type] || 0) + 1;
    return acc;
  }, {});
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance_km || 0), 0);
  const friendCount = friendIds ? friendIds.size : 0;
  const completedGoals = (goals || []).filter(g => g.completed).length;

  const conditions = {
    FIRST_WORKOUT:       stats.totalWorkouts >= 1,
    CENTURY_SWEAT:       stats.totalCredits >= 100,
    CREDITS_500:         stats.totalCredits >= 500,
    CREDITS_1000:        stats.totalCredits >= 1000,
    WORKOUT_10:          stats.totalWorkouts >= 10,
    WORKOUT_50:          stats.totalWorkouts >= 50,
    MARATHON_MODE:       totalDistance >= 100,
    CALORIE_CRUSHER:     totalCalories >= 10000,
    ON_FIRE:             stats.currentStreak >= 3,
    RED_HOT:             stats.currentStreak >= 7,
    UNSTOPPABLE:         stats.currentStreak >= 14,
    LEGENDARY:           stats.currentStreak >= 30,
    RUNNERS_HIGH:        (activityCounts.running || 0) >= 20,
    CYCLISTS_PARADISE:   (activityCounts.cycling || 0) >= 20,
    IRON_LIFTER:         (activityCounts.strength || 0) >= 20,
    WATER_CHILD:         (activityCounts.swimming || 0) >= 20,
    ALLROUNDER:          ACTIVITY_TYPES.every(t => (activityCounts[t] || 0) >= 5),
    FIRST_FRIEND:        friendCount >= 1,
    SQUAD_GOALS:         friendCount >= 5,
    FRIEND_MAGNET:       friendCount >= 10,
    GOAL_GETTER:         completedGoals >= 1,
    GOAL_CRUSHER:        completedGoals >= 5,
    GARMIN_CONNECTED:    !!garminAuth,
  };

  const newBadges = [];
  for (const [badgeId, condition] of Object.entries(conditions)) {
    if (condition && !hasBadge(badgeId)) {
      const awarded = awardBadge(userId, badgeId);
      if (awarded) {
        newBadges.push(badgeId);
        const config = BADGES_CONFIG[badgeId];
        if (config) {
          addNotification(userId, 'BADGE_EARNED', { badgeId, name: config.name, icon: config.icon });
        }
      }
    }
  }
  return newBadges;
}

// Award a single explorer badge (page visit triggers)
export function awardExplorerBadge(userId, badgeId) {
  const { awardBadge, hasBadge } = useBadgeStore.getState();
  const { addNotification } = useNotificationStore.getState();
  if (hasBadge(badgeId)) return;
  const awarded = awardBadge(userId, badgeId);
  if (awarded) {
    const config = BADGES_CONFIG[badgeId];
    if (config) {
      addNotification(userId, 'BADGE_EARNED', { badgeId, name: config.name, icon: config.icon });
    }
  }
}
