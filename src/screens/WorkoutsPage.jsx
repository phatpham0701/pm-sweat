import React, { useEffect, useState } from 'react';
import { AppNav } from '../components/chrome';
import { Icon } from '../components/brand';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuthStore } from '../stores/authStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { mockAuthService } from '../services/mockAuthService';
import WorkoutList from '../components/WorkoutList';
import WorkoutDetail from '../components/WorkoutDetail';
import ManualWorkoutForm from '../components/ManualWorkoutForm';

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'running',  label: 'Running' },
  { id: 'cycling',  label: 'Cycling' },
  { id: 'strength', label: 'Strength' },
  { id: 'swimming', label: 'Swimming' },
];

export default function WorkoutsPage({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const {
    workouts, garminAuth, filter, isLoading,
    loadUserWorkouts, setFilter, setSelectedWorkout, selectedWorkout,
    addWorkout, addWorkouts, setGarminAuth, setLoading,
    getFilteredWorkouts, getStats,
  } = useWorkoutStore();

  const [showManual, setShowManual] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    if (user?.id) loadUserWorkouts(user.id);
  }, [user?.id, loadUserWorkouts]);

  const isConnected = !!garminAuth;
  const filtered = getFilteredWorkouts();
  const stats = getStats();

  async function handleConnectGarmin() {
    setLoading(true);
    setConnectMsg('');
    try {
      const result = await mockAuthService.connectToGarmin(user.id, user.email);
      if (result.success) {
        setGarminAuth(user.id, result.token);
        addWorkouts(user.id, []);
        loadUserWorkouts(user.id);
        setConnectMsg(`Connected! ${result.workoutsGenerated} workouts generated · ${result.creditsEarned} sv earned`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setLoading(true);
    setSyncMsg('');
    try {
      const result = await mockAuthService.syncWorkouts(user.id, user.email);
      loadUserWorkouts(user.id);
      setSyncMsg(`Synced · ${result.synced} new workouts`);
    } finally {
      setLoading(false);
    }
  }

  function handleManualSave(workout) {
    addWorkout(user.id, workout);
    setShowManual(false);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      <AppNav onNav={onNav} active="workouts" />

      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '20px 32px',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Workouts · logged sessions
            </span>
            <h1 className="t-h2" style={{ margin: '4px 0 0' }}>Your Activity</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {isConnected ? (
              <button className="btn btn-sm btn-secondary" onClick={handleSync} disabled={isLoading}>
                <Icon.Verify size={14} /> {isLoading ? 'Syncing…' : 'Sync Garmin'}
              </button>
            ) : (
              <button className="btn btn-sm btn-secondary" onClick={handleConnectGarmin} disabled={isLoading}>
                <Icon.Run size={14} /> {isLoading ? 'Connecting…' : 'Connect Garmin'}
              </button>
            )}
            <button className="btn btn-sm btn-primary" onClick={() => setShowManual(true)}>
              <Icon.Plus size={14} /> Add Workout
            </button>
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {/* Status messages */}
          {(connectMsg || syncMsg) && (
            <div style={{
              marginBottom: 20, padding: '12px 16px', borderRadius: 10,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              color: 'var(--mint)', fontSize: 13, fontFamily: 'var(--font-mono)',
            }}>
              {connectMsg || syncMsg}
            </div>
          )}

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 12, marginBottom: 28,
          }}>
            <StatCard icon="Dumbbell" label="Total Workouts" value={stats.totalWorkouts} />
            <StatCard icon="Fire" label="Sweat Credits" value={stats.totalCredits} />
            <StatCard icon="Chart" label="Avg / Week" value={stats.avgPerWeek} />
            <StatCard icon="Bolt" label="Streak" value={`${stats.currentStreak}d`} />
          </div>

          {/* Garmin connect CTA if not connected */}
          {!isConnected && workouts.length === 0 && (
            <div style={{
              marginBottom: 28, padding: '24px', borderRadius: 14,
              border: '1px dashed var(--hairline)', textAlign: 'center',
            }}>
              <Icon.Run size={32} color="var(--ink-12)" />
              <div style={{ marginTop: 12, fontWeight: 600, fontSize: 15 }}>Connect Garmin to import workouts</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6, marginBottom: 16 }}>
                Instantly generate 30 days of realistic workout data for demo
              </div>
              <button className="btn btn-primary" onClick={handleConnectGarmin} disabled={isLoading}>
                <Icon.Run size={14} /> {isLoading ? 'Connecting…' : 'Connect Garmin (Mock)'}
              </button>
            </div>
          )}

          {/* Filters */}
          {workouts.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12,
                    fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid',
                    borderColor: filter === f.id ? 'var(--navy)' : 'var(--hairline)',
                    background: filter === f.id ? 'var(--navy)' : 'transparent',
                    color: filter === f.id ? 'white' : 'var(--muted)',
                    transition: 'all 150ms',
                  }}
                >
                  {f.label}
                  {f.id !== 'all' && (
                    <span style={{ marginLeft: 6, opacity: 0.6 }}>
                      {workouts.filter(w => w.activity_type === f.id).length}
                    </span>
                  )}
                </button>
              ))}
              <span style={{
                marginLeft: 'auto', alignSelf: 'center',
                fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)',
              }}>
                {filtered.length} {filter === 'all' ? 'total' : filter} sessions
              </span>
            </div>
          )}

          {/* Workout list */}
          <WorkoutList
            workouts={filtered}
            onSelect={setSelectedWorkout}
            emptyMessage={
              filter !== 'all'
                ? `No ${filter} workouts yet.`
                : 'No workouts yet. Connect Garmin or add one manually.'
            }
          />
        </div>
      </main>

      {/* Modals */}
      {selectedWorkout && (
        <WorkoutDetail workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      )}
      {showManual && (
        <ManualWorkoutForm userId={user?.id} onSave={handleManualSave} onClose={() => setShowManual(false)} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  const IC = Icon[icon];
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: 'var(--ink-04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
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
