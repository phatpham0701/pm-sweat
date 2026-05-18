/**
 * Training Intelligence — shared type definitions (JSDoc shapes, not runtime types).
 *
 * @typedef {Object} UserProfile
 * @property {string} userId
 * @property {'cns_first'|'balanced'|'performance_first'|'fat_loss_first'|'strength_first'|'endurance_first'|'coach_directed'|'beginner_safe'} trainingPhilosophy
 * @property {string} primaryGoal
 * @property {string} [trainingBackground]
 * @property {string} [currentChallenges]
 * @property {'low'|'medium'|'high'} riskTolerance
 * @property {string} [profileSummary]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} DailyHealthSignals
 * @property {string} date - YYYY-MM-DD
 * @property {number} [sleepDurationMin] - 0–1440
 * @property {number} [sleepScore] - 0–100
 * @property {number} [hrvMs] - 10–250
 * @property {number} [restingHrBpm] - 30–130
 * @property {number} [restingHrBaseline] - user's resting HR baseline
 * @property {number} [hrvBaselineLow] - user's HRV lower baseline
 * @property {number} [bodyBatteryStart] - 0–100
 * @property {number} [bodyBatteryEnd] - 0–100
 * @property {number} [trainingReadiness] - 0–100
 * @property {number} [stressAvg] - 0–100
 * @property {number} [recoveryTimeHours] - 0–120
 * @property {number} [acuteLoad] - 0–3000
 * @property {number} [subjectiveEnergy] - 1–10
 * @property {number} [subjectiveSoreness] - 1–10
 * @property {number} [subjectiveStress] - 1–10
 */

/**
 * @typedef {Object} SubjectiveSignals
 * @property {boolean} [illnessSymptoms]
 * @property {boolean} [injuryPain]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} WorkoutSession
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {'bike'|'swim'|'run'|'strength'|'walk'|'mobility'|string} sportType
 * @property {number} [durationSec] - 0–43200
 * @property {number} [distanceM] - 0–300000
 * @property {number} [avgHrBpm] - 30–220
 * @property {number} [maxHrBpm] - 30–230
 * @property {number} [trainingLoad] - 0–1000
 * @property {number} [aerobicTe] - 0–5
 * @property {number} [anaerobicTe] - 0–5
 * @property {number} [z2RangeMin] - e.g. 120
 * @property {number} [z2RangeMax] - e.g. 126
 * @property {number} [timeInZ2Sec] - seconds in Z2 (captured, not scored in Phase 1)
 */

/**
 * @typedef {'rest'|'recover'|'modify'|'train'} Decision
 */

/**
 * @typedef {Object} DecisionResult
 * @property {Decision} decision
 * @property {string} reasonCode
 * @property {string} reasoning
 * @property {string} [philosophy]
 * @property {boolean} [flagCoachRisk]
 */

/**
 * @typedef {Object} MorningBrief
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {string} userId
 * @property {Decision} decision
 * @property {string} reasoning
 * @property {string} [plannedSessionSummary]
 * @property {Object} inputSnapshot - profile + health signals at time of generation
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SessionReview
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {string} userId
 * @property {string} morningBriefId
 * @property {WorkoutSession|null} session
 * @property {boolean|null} decisionAligned
 * @property {boolean} recoveryDisciplined
 * @property {number|null} cnsCost - 0–100 (informational, Phase 1)
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SmartSweatScore
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {string} userId
 * @property {number} score - 0, 33, 66, or 100
 * @property {string} label - "X/3 signals met"
 * @property {{ decisionAligned: boolean, recoveredWell: boolean, consistent: boolean }} breakdown
 * @property {string} beta
 */

/**
 * @typedef {Object} JournalEntry
 * @property {string} id
 * @property {string} userId
 * @property {string} date - YYYY-MM-DD
 * @property {number} dayNumber
 * @property {string} [morningBriefId]
 * @property {string[]} [sessionReviewIds]
 * @property {string} [smartSweatScoreId]
 * @property {Decision} [decision]
 * @property {string} [plannedSessionSummary]
 * @property {string} [actualTrainingSummary]
 * @property {string} [dailySummary]
 * @property {string} [nutritionNote]
 * @property {string} [recoveryNote]
 * @property {string} [userReflection]
 * @property {string[]} [tags]
 * @property {number} [smartSweatScore]
 * @property {string} createdAt
 * @property {string} updatedAt
 */
