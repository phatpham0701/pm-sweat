import React, { useState, useEffect } from 'react';
import { useTrainingStore } from '../../stores/trainingStore';

export default function GoalsSettingsPage() {
  const { profile, saveProfile } = useTrainingStore();
  const [goals, setGoals] = useState({ primaryGoal: '', secondaryGoal: '', targetDate: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setGoals({
        primaryGoal: profile.primaryGoal || '',
        secondaryGoal: profile.secondaryGoal || '',
        targetDate: profile.targetDate || '',
      });
    }
  }, [profile]);

  function handleSave(e) {
    e.preventDefault();
    saveProfile({ ...profile, ...goals });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 24px' }}>
      <p className="t-eyebrow" style={{ marginBottom: 8 }}>Settings</p>
      <h1 className="t-h2" style={{ marginBottom: 4 }}>Goals</h1>
      <p className="t-small" style={{ marginBottom: 32 }}>
        Your goals inform the Morning Brief recommendations.
      </p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Primary Goal *</label>
          <textarea
            value={goals.primaryGoal}
            onChange={(e) => setGoals((g) => ({ ...g, primaryGoal: e.target.value }))}
            placeholder="e.g. Hypertrophy with CNS protection"
            required rows={2}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Secondary Goal</label>
          <textarea
            value={goals.secondaryGoal}
            onChange={(e) => setGoals((g) => ({ ...g, secondaryGoal: e.target.value }))}
            placeholder="e.g. Improve aerobic base, maintain 10kg fat loss"
            rows={2}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Target Date</label>
          <input
            type="date"
            value={goals.targetDate}
            onChange={(e) => setGoals((g) => ({ ...g, targetDate: e.target.value }))}
            style={{ ...textareaStyle, height: 44, resize: 'none' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
          {saved ? 'Saved ✓' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--navy)' };
const textareaStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
  padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
  outline: 'none', boxSizing: 'border-box',
};
