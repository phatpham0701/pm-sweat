import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useTrainingStore } from '../../stores/trainingStore';
import { buildMorningBrief } from '../../lib/training-intelligence/decision/buildMorningBrief';
import { createJournalEntry } from '../../lib/training-intelligence/journal/createJournalEntry';
import { today } from '../../lib/training-intelligence/utils';
import { DEMO_SCENARIOS } from '../../lib/training-intelligence/demoData';

const DECISION_STYLES = {
  rest:    { color: '#DC2626', border: '#FCA5A5', bg: '#FFF1F2', label: 'Rest today' },
  recover: { color: '#D97706', border: '#FCD34D', bg: '#FFFBEB', label: 'Recovery session' },
  modify:  { color: '#6366F1', border: '#A5B4FC', bg: '#EEF2FF', label: 'Modified training' },
  train:   { color: '#059669', border: '#6EE7B7', bg: '#ECFDF5', label: 'Train as planned' },
};

export default function MorningBriefPage() {
  const { user } = useAuthStore();
  const { profile, addMorningBrief, upsertJournalEntry, getDaysSinceStart, getTodaysBrief, morningBriefs } = useTrainingStore();
  const brief = getTodaysBrief();
  const [view, setView] = useState(brief ? 'result' : 'form');

  useEffect(() => {
    setView(getTodaysBrief() ? 'result' : 'form');
  }, [morningBriefs]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleBriefGenerated(newBrief) {
    addMorningBrief(newBrief);
    const dayNumber = getDaysSinceStart() + 1;
    const entry = createJournalEntry({ userId: user.id, date: today(), dayNumber, morningBrief: newBrief });
    upsertJournalEntry(entry);
    setView('result');
  }

  if (view === 'result') {
    return <BriefResult brief={getTodaysBrief()} onRedo={() => setView('form')} />;
  }

  return <BriefForm profile={profile} userId={user?.id} onGenerated={handleBriefGenerated} />;
}

// ---------------------------------------------------------------------------
// Input form
// ---------------------------------------------------------------------------

function BriefForm({ profile, userId, onGenerated }) {
  const [sleep, setSleep] = useState({ hours: '', min: '', score: '' });
  const [hrv, setHrv] = useState({ hrvMs: '', rhrBpm: '', rhrBaseline: '', hrvBaseline: '', bodyBattery: '' });
  const [readiness, setReadiness] = useState({ training: '', stress: '', recoveryHours: '' });
  const [subj, setSubj] = useState({ energy: '', soreness: '', stress: '', illness: false, injury: false, notes: '' });
  const [loading, setLoading] = useState(false);

  function fillDemo(scenarioId) {
    const s = DEMO_SCENARIOS.find((d) => d.id === scenarioId) || DEMO_SCENARIOS[0];
    const h = s.dailyHealth;
    const totalMin = h.sleepDurationMin || 0;
    setSleep({ hours: String(Math.floor(totalMin / 60)), min: String(totalMin % 60), score: String(h.sleepScore || '') });
    setHrv({
      hrvMs: String(h.hrvMs || ''),
      rhrBpm: String(h.restingHrBpm || ''),
      rhrBaseline: String(h.restingHrBaseline || ''),
      hrvBaseline: String(h.hrvBaselineLow || ''),
      bodyBattery: String(h.bodyBatteryStart || ''),
    });
    setReadiness({ training: String(h.trainingReadiness || ''), stress: String(h.stressAvg || ''), recoveryHours: '' });
    setSubj({
      energy: String(h.subjectiveEnergy || ''),
      soreness: String(h.subjectiveSoreness || ''),
      stress: String(h.subjectiveStress || ''),
      illness: s.subjective.illnessSymptoms || false,
      injury: s.subjective.injuryPain || false,
      notes: '',
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const sleepMin = (parseFloat(sleep.hours || 0) * 60) + parseFloat(sleep.min || 0);
    const dailyHealth = {
      date: today(),
      ...(sleepMin > 0 && { sleepDurationMin: sleepMin }),
      ...(sleep.score !== '' && { sleepScore: parseFloat(sleep.score) }),
      ...(hrv.hrvMs !== '' && { hrvMs: parseFloat(hrv.hrvMs) }),
      ...(hrv.rhrBpm !== '' && { restingHrBpm: parseFloat(hrv.rhrBpm) }),
      ...(hrv.rhrBaseline !== '' && { restingHrBaseline: parseFloat(hrv.rhrBaseline) }),
      ...(hrv.hrvBaseline !== '' && { hrvBaselineLow: parseFloat(hrv.hrvBaseline) }),
      ...(hrv.bodyBattery !== '' && { bodyBatteryStart: parseFloat(hrv.bodyBattery) }),
      ...(readiness.training !== '' && { trainingReadiness: parseFloat(readiness.training) }),
      ...(readiness.stress !== '' && { stressAvg: parseFloat(readiness.stress) }),
      ...(readiness.recoveryHours !== '' && { recoveryTimeHours: parseFloat(readiness.recoveryHours) }),
      ...(subj.energy !== '' && { subjectiveEnergy: parseFloat(subj.energy) }),
      ...(subj.soreness !== '' && { subjectiveSoreness: parseFloat(subj.soreness) }),
      ...(subj.stress !== '' && { subjectiveStress: parseFloat(subj.stress) }),
    };

    const subjective = {
      illnessSymptoms: subj.illness,
      injuryPain: subj.injury,
      notes: subj.notes,
    };

    const brief = buildMorningBrief({ userId, date: today(), dailyHealth, subjective, profile: profile || {} });
    setTimeout(() => { setLoading(false); onGenerated(brief); }, 300);
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Today — {today()}</p>
        <h1 className="t-h2" style={{ marginBottom: 4 }}>Morning Brief</h1>
        <p className="t-small">Enter your signals to get today's training recommendation.</p>
      </div>

      <DemoBar onFill={fillDemo} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Section title="Sleep">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <NumField label="Hours" value={sleep.hours} onChange={(v) => setSleep((s) => ({ ...s, hours: v }))} placeholder="7" min={0} max={14} />
            <NumField label="Minutes" value={sleep.min} onChange={(v) => setSleep((s) => ({ ...s, min: v }))} placeholder="30" min={0} max={59} />
            <NumField label="Sleep Score" value={sleep.score} onChange={(v) => setSleep((s) => ({ ...s, score: v }))} placeholder="80" min={0} max={100} optional />
          </div>
        </Section>

        <Section title="HRV & Heart Rate">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <NumField label="HRV (ms)" value={hrv.hrvMs} onChange={(v) => setHrv((h) => ({ ...h, hrvMs: v }))} placeholder="65" min={10} max={250} optional />
            <NumField label="Resting HR (bpm)" value={hrv.rhrBpm} onChange={(v) => setHrv((h) => ({ ...h, rhrBpm: v }))} placeholder="48" min={30} max={130} optional />
            <NumField label="HR Baseline" value={hrv.rhrBaseline} onChange={(v) => setHrv((h) => ({ ...h, rhrBaseline: v }))} placeholder="50" min={30} max={130} optional />
            <NumField label="HRV Baseline Low" value={hrv.hrvBaseline} onChange={(v) => setHrv((h) => ({ ...h, hrvBaseline: v }))} placeholder="58" min={10} max={250} optional />
            <NumField label="Body Battery" value={hrv.bodyBattery} onChange={(v) => setHrv((h) => ({ ...h, bodyBattery: v }))} placeholder="75" min={0} max={100} optional />
          </div>
        </Section>

        <Section title="Readiness">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <NumField label="Training Readiness" value={readiness.training} onChange={(v) => setReadiness((r) => ({ ...r, training: v }))} placeholder="72" min={0} max={100} optional />
            <NumField label="Stress Avg" value={readiness.stress} onChange={(v) => setReadiness((r) => ({ ...r, stress: v }))} placeholder="30" min={0} max={100} optional />
            <NumField label="Recovery Left (hrs)" value={readiness.recoveryHours} onChange={(v) => setReadiness((r) => ({ ...r, recoveryHours: v }))} placeholder="0" min={0} max={120} optional />
          </div>
        </Section>

        <Section title="How do you feel?">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <SliderField label="Energy" value={subj.energy} onChange={(v) => setSubj((s) => ({ ...s, energy: v }))} />
            <SliderField label="Soreness" value={subj.soreness} onChange={(v) => setSubj((s) => ({ ...s, soreness: v }))} />
            <SliderField label="Stress" value={subj.stress} onChange={(v) => setSubj((s) => ({ ...s, stress: v }))} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <ToggleField
              label="Illness symptoms"
              checked={subj.illness}
              onChange={(v) => setSubj((s) => ({ ...s, illness: v }))}
              danger
            />
            <ToggleField
              label="Injury / pain"
              checked={subj.injury}
              onChange={(v) => setSubj((s) => ({ ...s, injury: v }))}
              danger
            />
          </div>
          <textarea
            value={subj.notes}
            onChange={(e) => setSubj((s) => ({ ...s, notes: e.target.value }))}
            placeholder="Any notes (optional)"
            rows={2}
            style={textareaStyle}
          />
        </Section>

        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ height: 48, fontSize: 15, fontWeight: 600 }}>
          {loading ? 'Generating…' : 'Generate Morning Brief →'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brief result
// ---------------------------------------------------------------------------

function BriefResult({ brief, onRedo }) {
  const style = DECISION_STYLES[brief?.decision] || DECISION_STYLES.modify;
  if (!brief) return null;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Today — {brief.date}</p>
        <h1 className="t-h2" style={{ marginBottom: 0 }}>Morning Brief</h1>
      </div>

      <div style={{
        border: `2px solid ${style.border}`, borderRadius: 'var(--r-lg)',
        padding: 28, background: style.bg, marginBottom: 20,
      }}>
        <p className="t-eyebrow" style={{ color: style.color, marginBottom: 10 }}>Today's recommendation</p>
        <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: style.color, marginBottom: 12 }}>
          {style.label}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--navy)' }}>{brief.reasoning}</p>
      </div>

      {brief.plannedSessionSummary && (
        <div style={{
          border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
          padding: '16px 20px', marginBottom: 20, background: 'var(--ink-04)',
        }}>
          <p className="t-eyebrow" style={{ marginBottom: 8 }}>Planned session</p>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{brief.plannedSessionSummary}</p>
        </div>
      )}

      {brief.flagCoachRisk && (
        <div style={{
          border: '1px solid #FCD34D', borderRadius: 'var(--r-md)',
          padding: '12px 16px', marginBottom: 20, background: '#FFFBEB',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>
            Coach-directed plan may conflict with current recovery signals. Flag for review.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <p className="t-small" style={{ flex: 1 }}>
          Log your session in <strong>Session Review</strong> after training.
        </p>
        <button onClick={onRedo}
          style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Redo today's brief
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo bar
// ---------------------------------------------------------------------------

function DemoBar({ onFill }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-sm)', padding: '6px 12px', cursor: 'pointer' }}>
        Try demo data ▾
      </button>
      {open && (
        <div style={{
          marginTop: 8, border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
          padding: 12, display: 'flex', flexDirection: 'column', gap: 6, background: '#FAFAFA',
        }}>
          {DEMO_SCENARIOS.map((s) => (
            <button key={s.id} type="button" onClick={() => { onFill(s.id); setOpen(false); }}
              style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, padding: '4px 8px', borderRadius: 6 }}>
              <strong>{s.label}</strong>{' '}
              <span style={{ color: 'var(--muted)' }}>— {s.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form field components
// ---------------------------------------------------------------------------

function Section({ title, children }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  );
}

function NumField({ label, value, onChange, placeholder, min, max, optional }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
        {label}{optional && <span style={{ marginLeft: 4, opacity: 0.6 }}>opt</span>}
      </label>
      <input
        type="number" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step="any"
        style={inputStyle}
      />
    </div>
  );
}

function SliderField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
        {label} <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{value || '—'}</span>
      </label>
      <input
        type="range" min={1} max={10} step={1}
        value={value || 5}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', accentColor: 'var(--indigo)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
        <span>1</span><span>10</span>
      </div>
    </div>
  );
}

function ToggleField({ label, checked, onChange, danger }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        flex: 1, border: `1.5px solid ${checked && danger ? '#FCA5A5' : 'var(--hairline)'}`,
        borderRadius: 'var(--r-md)', padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
        background: checked && danger ? '#FFF1F2' : 'transparent',
        fontSize: 12, fontWeight: checked ? 600 : 400,
        color: checked && danger ? '#DC2626' : 'var(--muted)',
        transition: 'all var(--t-fast)',
      }}
    >
      {checked ? '✓ ' : ''}{label}
    </button>
  );
}

const inputStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
  padding: '8px 10px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const textareaStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
  padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
  outline: 'none', boxSizing: 'border-box',
};
