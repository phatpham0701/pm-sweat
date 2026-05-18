import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../stores/trainingStore';
import { useAuthStore } from '../../stores/authStore';
import { buildUserProfileSummary } from '../../lib/training-intelligence/decision/buildUserProfileSummary';
import { getBetaStatus } from '../../lib/training-intelligence/betaAccess';

const PHILOSOPHIES = [
  { value: 'cns_first', label: 'CNS First', desc: 'Protect nervous system. Recover when in doubt.' },
  { value: 'balanced', label: 'Balanced', desc: 'Performance, recovery, and consistency in harmony.' },
  { value: 'performance_first', label: 'Performance First', desc: 'Push through fatigue when needed.' },
  { value: 'fat_loss_first', label: 'Fat Loss First', desc: 'Keep activity up even on low readiness days.' },
  { value: 'strength_first', label: 'Strength First', desc: 'Protect heavy lifts. No grinding reps.' },
  { value: 'endurance_first', label: 'Endurance First', desc: 'Aerobic base above all.' },
  { value: 'coach_directed', label: 'Coach Directed', desc: 'Follow the plan. AI flags conflicts only.' },
  { value: 'beginner_safe', label: 'Beginner Safe', desc: 'Conservative. Minimise overtraining risk.' },
];

const RISK_OPTIONS = [
  { value: 'low', label: 'Low', desc: 'Err on the side of rest' },
  { value: 'medium', label: 'Medium', desc: 'Balanced push vs protect' },
  { value: 'high', label: 'High', desc: 'Push through unless critical' },
];

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { profile, saveProfile, journal, morningBriefs, sessionReviews, getDaysSinceStart } = useTrainingStore();
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    primaryGoal: '', trainingBackground: '', currentChallenges: '',
    trainingPhilosophy: 'balanced', riskTolerance: 'medium',
  });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function handleSave(e) {
    e.preventDefault();
    const summary = buildUserProfileSummary(form);
    saveProfile({ ...form, profileSummary: summary });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      profile,
      stats: {
        daysSinceStart: getDaysSinceStart(),
        briefs: morningBriefs.length,
        sessions: sessionReviews.length,
        journalEntries: journal.length,
      },
      journal,
      morningBriefs,
      sessionReviews,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmsweat-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const daysSinceStart = getDaysSinceStart();
  const betaStatus = getBetaStatus(profile);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Settings</p>
      <h1 className="t-h2" style={{ marginBottom: 20 }}>Account & Profile</h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--hairline)', paddingBottom: 0 }}>
        {[['profile', 'Profile'], ['stats', 'Stats'], ['export', 'Export & Feedback']].map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: tab === key ? 600 : 400,
              color: tab === key ? 'var(--indigo)' : 'var(--muted)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: `2px solid ${tab === key ? 'var(--indigo)' : 'transparent'}`,
              marginBottom: -1,
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label="Primary Goal" required>
            <textarea value={form.primaryGoal} onChange={(e) => set('primaryGoal', e.target.value)}
              placeholder="e.g. Hypertrophy with CNS protection" required rows={2} style={textareaStyle} />
          </Field>
          <Field label="Training Background">
            <textarea value={form.trainingBackground} onChange={(e) => set('trainingBackground', e.target.value)}
              placeholder="e.g. 10 years hybrid training, no injuries" rows={2} style={textareaStyle} />
          </Field>
          <Field label="Current Challenges">
            <textarea value={form.currentChallenges} onChange={(e) => set('currentChallenges', e.target.value)}
              placeholder="e.g. Low HRV after heavy CNS weeks" rows={2} style={textareaStyle} />
          </Field>
          <Field label="Training Philosophy">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PHILOSOPHIES.map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set('trainingPhilosophy', value)}
                  style={{
                    border: `1.5px solid ${form.trainingPhilosophy === value ? 'var(--indigo)' : 'var(--hairline)'}`,
                    borderRadius: 'var(--r-md)', padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                    background: form.trainingPhilosophy === value ? '#EEF2FF' : 'transparent',
                  }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2,
                    color: form.trainingPhilosophy === value ? 'var(--indigo)' : 'var(--navy)' }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</p>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Risk Tolerance">
            <div style={{ display: 'flex', gap: 8 }}>
              {RISK_OPTIONS.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => set('riskTolerance', value)}
                  style={{
                    flex: 1, border: `1.5px solid ${form.riskTolerance === value ? 'var(--indigo)' : 'var(--hairline)'}`,
                    borderRadius: 'var(--r-md)', padding: '10px 8px', textAlign: 'center',
                    background: form.riskTolerance === value ? '#EEF2FF' : 'transparent',
                    fontSize: 12, fontWeight: form.riskTolerance === value ? 600 : 400,
                    color: form.riskTolerance === value ? 'var(--indigo)' : 'var(--muted)', cursor: 'pointer',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <p className="t-small" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            Profile changes affect future briefs only. Past entries preserve their original snapshot.
          </p>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            {saved ? 'Saved ✓' : 'Save Profile'}
          </button>
        </form>
      )}

      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatRow label="Days since start" value={daysSinceStart || '—'} />
          <StatRow label="Morning Briefs generated" value={morningBriefs.length} />
          <StatRow label="Sessions reviewed" value={sessionReviews.length} />
          <StatRow label="Journal entries" value={journal.length} />
          <StatRow label="Account" value={user?.email || '—'} />
          <StatRow
            label="Beta expires"
            value={betaStatus.isExpired
              ? 'Đã hết hạn'
              : `${betaStatus.daysRemaining} ngày còn lại${betaStatus.hasExtension ? ' (đã gia hạn)' : ''}`}
          />
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
              Expected pricing after beta: <strong style={{ color: 'var(--navy)' }}>199k–249k VND/month</strong>
              <br />Phase 2 (coach dashboard, advanced signals): <strong style={{ color: 'var(--navy)' }}>399k–599k VND/month</strong>
            </p>
          </div>
        </div>
      )}

      {tab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)', padding: '20px 24px',
          }}>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Export your data</p>
            <p className="t-small" style={{ marginBottom: 16 }}>
              Download all Morning Briefs, Session Reviews, Journal entries, and scores as JSON.
            </p>
            <button type="button" onClick={handleExport}
              className="btn" style={{ border: '1px solid var(--hairline)', fontWeight: 500 }}>
              Export JSON
            </button>
          </div>

          <div style={{
            border: '1.5px solid var(--indigo)', borderRadius: 'var(--r-lg)', padding: '20px 24px',
            background: '#EEF2FF',
          }}>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--indigo)', marginBottom: 6 }}>Beta Feedback</p>
            <p className="t-small" style={{ marginBottom: 16 }}>
              10 questions. Your answers determine what Phase 2 becomes.
            </p>
            <button type="button" onClick={() => navigate('/app/feedback')}
              className="btn btn-primary">
              Give feedback →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid var(--hairline)', paddingBottom: 12 }}>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{String(value)}</p>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--navy)' }}>
        {label}{required && <span style={{ color: 'var(--muted)', marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const textareaStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
  padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
  outline: 'none', boxSizing: 'border-box',
};
