import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../stores/trainingStore';
import { buildUserProfileSummary } from '../../lib/training-intelligence/decision/buildUserProfileSummary';

const PHILOSOPHIES = [
  { value: 'cns_first', label: 'CNS First', desc: 'Protect nervous system. Recover when in doubt.' },
  { value: 'balanced', label: 'Balanced', desc: 'Performance, recovery, and consistency in harmony.' },
  { value: 'performance_first', label: 'Performance First', desc: 'Push through fatigue. Training load is king.' },
  { value: 'fat_loss_first', label: 'Fat Loss First', desc: 'Keep activity up even on low readiness days.' },
  { value: 'strength_first', label: 'Strength First', desc: 'Protect heavy lifts. No grinding reps.' },
  { value: 'endurance_first', label: 'Endurance First', desc: 'Aerobic base above all. Protect Z2 sessions.' },
  { value: 'coach_directed', label: 'Coach Directed', desc: 'Follow the plan. AI flags conflicts only.' },
  { value: 'beginner_safe', label: 'Beginner Safe', desc: 'Conservative. Minimise overtraining risk.' },
];

const RISK_OPTIONS = [
  { value: 'low', label: 'Low', desc: 'Err on the side of rest' },
  { value: 'medium', label: 'Medium', desc: 'Balanced push vs protect' },
  { value: 'high', label: 'High', desc: 'Push through unless critical flag' },
];

const TOTAL_STEPS = 5;

export default function TIOnboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useTrainingStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    primaryGoal: '',
    trainingBackground: '',
    currentChallenges: '',
    trainingPhilosophy: 'balanced',
    riskTolerance: 'medium',
  });

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function next(e) {
    e?.preventDefault();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() { setStep((s) => Math.max(s - 1, 1)); }

  function finish() {
    const summary = buildUserProfileSummary(form);
    saveProfile({ ...form, profileSummary: summary, createdAt: new Date().toISOString() });
    navigate('/app/dashboard', { replace: true });
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px', minHeight: '100vh' }}>
      <ProgressBar step={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <Step1 value={form.primaryGoal} onChange={(v) => set('primaryGoal', v)} onNext={next} />
      )}
      {step === 2 && (
        <Step2
          philosophy={form.trainingPhilosophy}
          onChange={(v) => set('trainingPhilosophy', v)}
          onNext={next} onBack={back}
        />
      )}
      {step === 3 && (
        <Step3
          background={form.trainingBackground}
          challenges={form.currentChallenges}
          onChangeBackground={(v) => set('trainingBackground', v)}
          onChangeChallenges={(v) => set('currentChallenges', v)}
          onNext={next} onBack={back}
        />
      )}
      {step === 4 && (
        <Step4
          risk={form.riskTolerance}
          onChange={(v) => set('riskTolerance', v)}
          onNext={next} onBack={back}
        />
      )}
      {step === 5 && (
        <Step5 form={form} onFinish={finish} onBack={back} />
      )}
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < step ? 'var(--indigo)' : 'var(--hairline)',
            transition: 'background var(--t-norm)',
          }} />
        ))}
      </div>
      <p className="t-eyebrow">Step {step} of {total}</p>
    </div>
  );
}

function Step1({ value, onChange, onNext }) {
  return (
    <form onSubmit={onNext}>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>What's your primary goal?</h2>
      <p className="t-small" style={{ marginBottom: 24 }}>
        Be specific. This shapes every Morning Brief recommendation.
      </p>
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Hypertrophy with CNS protection — build muscle without accumulating fatigue debt"
        required rows={4}
        style={textareaStyle}
      />
      <NavButtons onNext={null} submitLabel="Continue →" />
    </form>
  );
}

function Step2({ philosophy, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>Training philosophy</h2>
      <p className="t-small" style={{ marginBottom: 24 }}>
        This is the bias applied when signals are mixed. You can change this anytime.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {PHILOSOPHIES.map(({ value, label, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            style={{
              border: `1.5px solid ${philosophy === value ? 'var(--indigo)' : 'var(--hairline)'}`,
              borderRadius: 'var(--r-md)', padding: '12px 14px', textAlign: 'left',
              background: philosophy === value ? '#EEF2FF' : 'transparent', cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4,
              color: philosophy === value ? 'var(--indigo)' : 'var(--navy)' }}>{label}</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</p>
          </button>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

function Step3({ background, challenges, onChangeBackground, onChangeChallenges, onNext, onBack }) {
  return (
    <form onSubmit={onNext}>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>Your background</h2>
      <p className="t-small" style={{ marginBottom: 24 }}>
        Helps the AI calibrate recommendations to your experience level.
      </p>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Training Background</label>
        <textarea
          value={background}
          onChange={(e) => onChangeBackground(e.target.value)}
          placeholder="e.g. 10 years hybrid training — strength + triathlon. No major injuries."
          rows={3}
          style={textareaStyle}
        />
      </div>
      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle}>Current Challenges</label>
        <textarea
          value={challenges}
          onChange={(e) => onChangeChallenges(e.target.value)}
          placeholder="e.g. HRV tanking after hard CNS weeks, inconsistent sleep schedule"
          rows={3}
          style={textareaStyle}
        />
      </div>
      <NavButtons onBack={onBack} submitLabel="Continue →" />
    </form>
  );
}

function Step4({ risk, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>Risk tolerance</h2>
      <p className="t-small" style={{ marginBottom: 24 }}>
        When signals are borderline, should the AI lean toward pushing or protecting?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {RISK_OPTIONS.map(({ value, label, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            style={{
              border: `1.5px solid ${risk === value ? 'var(--indigo)' : 'var(--hairline)'}`,
              borderRadius: 'var(--r-md)', padding: '16px 20px', textAlign: 'left',
              background: risk === value ? '#EEF2FF' : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16, transition: 'all var(--t-fast)',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${risk === value ? 'var(--indigo)' : 'var(--hairline-2)'}`,
              background: risk === value ? 'var(--indigo)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {risk === value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: risk === value ? 'var(--indigo)' : 'var(--navy)' }}>
                {label}
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

function Step5({ form, onFinish, onBack }) {
  const summary = buildUserProfileSummary(form);
  return (
    <div>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>Confirm your profile</h2>
      <p className="t-small" style={{ marginBottom: 24 }}>
        This is your AI profile summary. It's stored with every Morning Brief as a snapshot.
      </p>
      <div style={{
        background: '#F8FAFF', border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)',
        padding: 24, marginBottom: 20,
      }}>
        <p className="t-eyebrow" style={{ marginBottom: 12 }}>Profile Summary</p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--navy)', whiteSpace: 'pre-line' }}>{summary}</p>
      </div>
      <div style={{
        background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 'var(--r-md)',
        padding: '14px 18px', marginBottom: 28,
      }}>
        <p style={{ fontSize: 13, color: '#065F46', fontWeight: 500, marginBottom: 2 }}>
          Free beta — 30 days full access
        </p>
        <p style={{ fontSize: 12, color: '#047857' }}>
          After beta: <strong>199k–249k VND/month</strong> · No credit card needed now.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onBack}
          className="btn btn-ghost" style={{ border: '1px solid var(--hairline)' }}>
          ← Back
        </button>
        <button type="button" onClick={onFinish} className="btn btn-primary" style={{ flex: 1 }}>
          Start my first Morning Brief →
        </button>
      </div>
    </div>
  );
}

function NavButtons({ onBack, onNext, submitLabel = 'Continue →' }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      {onBack && (
        <button type="button" onClick={onBack}
          className="btn btn-ghost" style={{ border: '1px solid var(--hairline)' }}>
          ← Back
        </button>
      )}
      {onNext ? (
        <button type="button" onClick={onNext} className="btn btn-primary" style={{ flex: 1 }}>
          {submitLabel}
        </button>
      ) : (
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {submitLabel}
        </button>
      )}
    </div>
  );
}

const textareaStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
  padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
  outline: 'none', boxSizing: 'border-box', display: 'block',
};

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--navy)' };
