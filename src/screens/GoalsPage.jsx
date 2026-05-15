import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppNav } from '../components/chrome';
import { Icon } from '../components/brand';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuthStore } from '../stores/authStore';
import { useGoalsStore } from '../stores/goalsStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { useNotificationStore } from '../stores/notificationStore';
import GoalCard from '../components/GoalCard';

const schema = z.object({
  title:        z.string().min(2, 'Min 2 chars').max(60, 'Max 60 chars'),
  goal_type:    z.enum(['workouts_per_week', 'total_credits', 'distance_km']),
  target_value: z.coerce.number().min(1, 'Min 1').max(10000, 'Max 10000'),
  period:       z.enum(['weekly', 'monthly', 'yearly']),
  description:  z.string().max(100, 'Max 100 chars').optional(),
});

const GOAL_TYPE_OPTIONS = [
  { value: 'workouts_per_week', label: 'Workouts per week' },
  { value: 'total_credits',     label: 'Total sweat credits (sv)' },
  { value: 'distance_km',       label: 'Total distance (km)' },
];

const FIELD_STYLE = {
  width: '100%', padding: '8px 12px', border: '1px solid var(--hairline)',
  borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', color: 'var(--navy)', background: 'white',
};

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{error.message}</div>}
    </div>
  );
}

export default function GoalsPage({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { goals, loadGoals, addGoal, deleteGoal, updateProgress } = useGoalsStore();
  const { workouts } = useWorkoutStore();
  const { addNotification } = useNotificationStore();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { goal_type: 'workouts_per_week', period: 'weekly', target_value: 5 },
  });

  useEffect(() => {
    if (user?.id) loadGoals(user.id);
  }, [user?.id, loadGoals]);

  useEffect(() => {
    if (!user?.id || !workouts.length) return;
    const newlyCompleted = updateProgress(user.id, workouts);
    newlyCompleted.forEach(goal => {
      addNotification(user.id, 'GOAL_COMPLETED', { goalTitle: goal.title });
    });
  }, [user?.id, workouts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(data) {
    addGoal(user.id, data);
    reset();
    setShowForm(false);
  }

  const active = goals.filter(g => !g.is_completed);
  const completed = goals.filter(g => g.is_completed);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      <AppNav onNav={onNav} active="goals" />

      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '20px 32px',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Goals · fitness targets
            </span>
            <h1 className="t-h2" style={{ margin: '4px 0 0' }}>Your Goals</h1>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>
            <Icon.Plus size={14} /> Add Goal
          </button>
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {goals.length === 0 && (
            <div style={{ padding: 32, borderRadius: 14, border: '1px dashed var(--hairline)', textAlign: 'center' }}>
              <Icon.Target size={32} color="var(--ink-12)" />
              <div style={{ marginTop: 12, fontWeight: 600, fontSize: 15 }}>No goals yet</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6, marginBottom: 16 }}>
                Set a fitness target and watch your progress grow.
              </div>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Icon.Plus size={14} /> Set Your First Goal
              </button>
            </div>
          )}

          {active.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Active · {active.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {active.map(g => (
                  <GoalCard key={g.id} goal={g} onDelete={() => deleteGoal(user.id, g.id)} />
                ))}
              </div>
            </>
          )}

          {completed.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Completed · {completed.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {completed.map(g => (
                  <GoalCard key={g.id} goal={g} onDelete={() => deleteGoal(user.id, g.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(7,19,38,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => { setShowForm(false); reset(); }}
        >
          <div
            style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(7,19,38,0.18)', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="t-eyebrow">New Goal</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>Set a Fitness Target</div>
              </div>
              <button
                onClick={() => { setShowForm(false); reset(); }}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--hairline)', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close"
              >×</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Goal Title" error={errors.title}>
                <input type="text" placeholder="e.g. Run 5 times this week" {...register('title')} style={FIELD_STYLE} />
              </Field>

              <Field label="Goal Type" error={errors.goal_type}>
                <select {...register('goal_type')} style={FIELD_STYLE}>
                  {GOAL_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Target Value" error={errors.target_value}>
                  <input type="number" {...register('target_value')} style={FIELD_STYLE} />
                </Field>
                <Field label="Period" error={errors.period}>
                  <select {...register('period')} style={FIELD_STYLE}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>
              </div>

              <Field label="Description (optional)" error={errors.description}>
                <input type="text" placeholder="What's your motivation?" {...register('description')} style={FIELD_STYLE} />
              </Field>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
