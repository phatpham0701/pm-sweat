import React, { useEffect, useMemo } from 'react';
import { AppNav } from '../components/chrome';
import { Icon } from '../components/brand';
import { useIsMobile } from '../hooks/useIsMobile';
import { useWorkoutStore } from '../stores/workoutStore';
import { useAuthStore } from '../stores/authStore';
import { useBadgeStore } from '../stores/badgeStore';
import { awardExplorerBadge } from '../services/badgeService';
import StreakWidget from '../components/StreakWidget';
import { ACTIVITY_META, INTENSITY_COLOR } from '../constants/activityMeta';

const INTENSITY_META = Object.entries(INTENSITY_COLOR).map(([key, color]) => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  color,
}));

function BarChart({ data, colorKey, defaultColor = 'var(--navy)' }) {
  const [hovered, setHovered] = React.useState(null);
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered === i && d.count > 0 && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--navy)', color: 'white',
              padding: '3px 8px', borderRadius: 5,
              fontSize: 10, fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
            }}>
              {d.count} {d.count === 1 ? 'session' : 'sessions'}
            </div>
          )}
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)', minHeight: 12 }}>
            {d.count > 0 ? d.count : ''}
          </span>
          <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%',
              height: max > 0 ? `${Math.round((d.count / max) * 100)}%` : '0%',
              minHeight: d.count > 0 ? 4 : 0,
              background: colorKey ? (d[colorKey] || defaultColor) : defaultColor,
              borderRadius: '3px 3px 0 0',
              transition: 'height 500ms ease, opacity 150ms',
              opacity: hovered === null || hovered === i ? 1 : 0.35,
            }} />
          </div>
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: hovered === i ? 'var(--navy)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.2, transition: 'color 150ms' }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  const IC = Icon[icon];
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ink-04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <IC size={16} color="var(--navy)" />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--navy)' }}>{value}</div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { loadBadges } = useBadgeStore();
  const { workouts, getStats } = useWorkoutStore();

  useEffect(() => {
    if (user?.id) {
      loadBadges(user.id);
      awardExplorerBadge(user.id, 'INSIGHT_SEEKER');
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hooks must run unconditionally — compute even if empty (returns zeroes/empty arrays)
  const stats = getStats();
  const analytics = useMemo(() => {
    if (!workouts.length) return null;
    const totalDistance = workouts.reduce((s, w) => s + (w.distance_km || 0), 0);
    const totalCalories = workouts.reduce((s, w) => s + (w.calories_burned || 0), 0);
    const hrWorkouts = workouts.filter(w => w.avg_heart_rate > 0);
    const avgHR = hrWorkouts.length > 0
      ? Math.round(hrWorkouts.reduce((s, w) => s + w.avg_heart_rate, 0) / hrWorkouts.length)
      : 0;

    const activityData = Object.entries(ACTIVITY_META).map(([type, meta]) => ({
      label: meta.label.slice(0, 3),
      count: workouts.filter(w => w.activity_type === type).length,
      color: meta.color,
    }));

    const now = new Date();
    const weeklyData = [3, 2, 1, 0].map(weeksAgo => {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - weeksAgo * 7);
      weekEnd.setHours(23, 59, 59, 999);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);
      return {
        label: weeksAgo === 0 ? 'Now' : `W-${weeksAgo}`,
        count: workouts.filter(w => { const d = new Date(w.created_at); return d >= weekStart && d <= weekEnd; }).length,
      };
    });

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayData = DAYS.map((label, i) => ({
      label,
      count: workouts.filter(w => { const d = new Date(w.created_at).getDay(); return (d === 0 ? 6 : d - 1) === i; }).length,
    }));

    const intensityData = INTENSITY_META.map(({ key, label, color }) => ({
      label,
      count: workouts.filter(w => w.intensity_level === key).length,
      color,
    }));

    return { totalDistance, totalCalories, avgHR, activityData, weeklyData, dayData, intensityData };
  }, [workouts]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!analytics) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
        <AppNav onNav={onNav} active="insights" />
        <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 32 }}>
          <Icon.Flag size={40} color="var(--ink-12)" />
          <div style={{ fontWeight: 600, fontSize: 16 }}>No workout data yet</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Log workouts to unlock your insights.</div>
          <button className="btn btn-primary" onClick={() => onNav('workouts')}>
            <Icon.Run size={14} /> Go to Workouts
          </button>
        </main>
      </div>
    );
  }

  const { totalDistance, totalCalories, avgHR, activityData, weeklyData, dayData, intensityData } = analytics;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      <AppNav onNav={onNav} active="insights" />

      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '20px 32px',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Insights · analytics
            </span>
            <h1 className="t-h2" style={{ margin: '4px 0 0' }}>Your Performance</h1>
          </div>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--ink-04)', padding: '4px 10px', borderRadius: 999 }}>
            {workouts.length} sessions
          </span>
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Total Workouts" value={stats.totalWorkouts} icon="Dumbbell" />
            <StatCard label="Sweat Credits" value={`${stats.totalCredits} sv`} icon="Fire" />
            <StatCard label="Total Distance" value={`${totalDistance.toFixed(1)} km`} icon="Map" />
            <StatCard label="Calories" value={totalCalories.toLocaleString()} icon="Bolt" />
          </div>

          {/* Streak widget */}
          <div style={{ marginBottom: 24 }}>
            <StreakWidget
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              multiplier={stats.streakMultiplier}
            />
          </div>

          {/* Charts row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>Activity Breakdown</div>
              <BarChart data={activityData} colorKey="color" />
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>Weekly Trend (last 4 weeks)</div>
              <BarChart data={weeklyData} />
            </div>
          </div>

          {/* Charts row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>Most Active Days</div>
              <BarChart data={dayData} />
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>Intensity Distribution</div>
              <BarChart data={intensityData} colorKey="color" />
              {avgHR > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Heart Rate</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>{avgHR} bpm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
