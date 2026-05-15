import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sweatCalculator } from '../services/sweatCalculator';

const schema = z.object({
  activity_type: z.enum(['running', 'cycling', 'strength', 'swimming']),
  duration_minutes: z.coerce.number().int().min(5, 'Min 5 min').max(480, 'Max 8 hrs'),
  distance_km: z.coerce.number().min(0).max(300),
  calories_burned: z.coerce.number().int().min(50, 'Min 50').max(5000),
  avg_heart_rate: z.coerce.number().int().min(60).max(220),
  max_heart_rate: z.coerce.number().int().min(60).max(220),
  date: z.string().min(1, 'Required'),
}).refine(d => d.max_heart_rate >= d.avg_heart_rate, {
  message: 'Max HR must be ≥ Avg HR',
  path: ['max_heart_rate'],
});

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getIntensityLevel(avgHR, maxHR) {
  const pct = (avgHR / maxHR) * 100;
  if (pct < 60) return 'easy';
  if (pct < 75) return 'moderate';
  return 'hard';
}

const today = new Date().toISOString().slice(0, 10);

const FIELD_STYLE = {
  width: '100%', padding: '8px 12px', border: '1px solid var(--hairline)',
  borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', color: 'var(--navy)',
};

export default function ManualWorkoutForm({ userId, onSave, onClose }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      activity_type: 'running',
      duration_minutes: 30,
      distance_km: 0,
      calories_burned: 300,
      avg_heart_rate: 140,
      max_heart_rate: 170,
      date: today,
    },
  });

  function onSubmit(data) {
    const intensity = getIntensityLevel(data.avg_heart_rate, data.max_heart_rate);
    const workout = {
      id: genId(),
      user_id: userId,
      source: 'manual',
      external_id: null,
      activity_type: data.activity_type,
      duration_minutes: data.duration_minutes,
      distance_km: data.distance_km,
      calories_burned: data.calories_burned,
      avg_heart_rate: data.avg_heart_rate,
      max_heart_rate: data.max_heart_rate,
      intensity_level: intensity,
      verified: false,
      metadata: { source: 'MANUAL_ENTRY' },
      sweat_credits_earned: 0,
      created_at: new Date(data.date).toISOString(),
      updated_at: new Date().toISOString(),
    };
    workout.sweat_credits_earned = sweatCalculator.calculateCredits(workout);
    onSave(workout);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(7,19,38,0.45)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white', borderRadius: 20, width: '100%', maxWidth: 440,
          boxShadow: '0 24px 64px rgba(7,19,38,0.18)', overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <span className="t-eyebrow">Manual Entry</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>Add Workout</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--hairline)',
              background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close"
          >×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Activity Type" error={errors.activity_type}>
            <select {...register('activity_type')} style={FIELD_STYLE}>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="strength">Strength</option>
              <option value="swimming">Swimming</option>
            </select>
          </Field>

          <Field label="Date" error={errors.date}>
            <input type="date" {...register('date')} style={FIELD_STYLE} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Duration (min)" error={errors.duration_minutes}>
              <input type="number" {...register('duration_minutes')} style={FIELD_STYLE} />
            </Field>
            <Field label="Distance (km)" error={errors.distance_km}>
              <input type="number" step="0.1" {...register('distance_km')} style={FIELD_STYLE} />
            </Field>
          </div>

          <Field label="Calories Burned" error={errors.calories_burned}>
            <input type="number" {...register('calories_burned')} style={FIELD_STYLE} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Avg HR (bpm)" error={errors.avg_heart_rate}>
              <input type="number" {...register('avg_heart_rate')} style={FIELD_STYLE} />
            </Field>
            <Field label="Max HR (bpm)" error={errors.max_heart_rate}>
              <input type="number" {...register('max_heart_rate')} style={FIELD_STYLE} />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {isSubmitting ? 'Saving…' : 'Add Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{error.message}</div>
      )}
    </div>
  );
}
