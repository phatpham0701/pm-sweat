export const sweatCalculator = {
  calculateCredits(workout) {
    const baseCredits = Math.floor(workout.calories_burned / 10);
    const multiplier = this.getIntensityMultiplier(workout.intensity_level);
    const distanceBonus = this.getDistanceBonus(workout);
    return Math.max(5, Math.floor(baseCredits * multiplier + distanceBonus));
  },

  getIntensityMultiplier(intensity) {
    return { easy: 0.8, moderate: 1.0, hard: 1.2 }[intensity] ?? 1.0;
  },

  getDistanceBonus(workout) {
    if (['running', 'cycling'].includes(workout.activity_type)) {
      return Math.floor((workout.calories_burned / 10) * 0.1 * workout.distance_km);
    }
    return 0;
  },
};
