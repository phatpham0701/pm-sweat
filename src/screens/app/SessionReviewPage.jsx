import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useTrainingStore } from '../../stores/trainingStore';
import { scoreSession } from '../../lib/training-intelligence/review/scoreSession';
import { scoreSmartSweat, scoreConsistency } from '../../lib/training-intelligence/score/scoreSmartSweat';
import { updateJournalEntryAfterReview } from '../../lib/training-intelligence/journal/createJournalEntry';
import { today, crypto } from '../../lib/training-intelligence/utils';

const SPORT_TYPES = ['run', 'bike', 'swim', 'strength', 'walk', 'mobility', 'hiit', 'other'];

const DECISION_LABELS = {
  rest: 'Rest today', recover: 'Recovery session', modify: 'Modified training', train: 'Train as planned',
};

export default function SessionReviewPage() {
  const { user } = useAuthStore();
  const {
    getTodaysBrief, getTodaysJournalEntry, addSessionReview, upsertJournalEntry,
    addDailyScore, getDaysSinceStart, journal, morningBriefs,
  } = useTrainingStore();

  const brief = getTodaysBrief();
  const journalEntry = getTodaysJournalEntry();
  const hasReview = journalEntry?.actualTrainingSummary != null;
  const [view, setView] = useState(hasReview ? 'result' : 'form');

  function handleReviewSaved(review, scores) {
    // Save session review
    addSessionReview(review);

    // Calculate consistency
    const daysSince = getDaysSinceStart();
    const briefViews = morningBriefs.length;
    const journalCount = journal.length;
    const consistencyResult = scoreConsistency({
      daysSinceStart: daysSince || 1,
      morningBriefViews: briefViews,
      journalEntries: journalCount,
    });
    const consistent = consistencyResult?.consistent ?? false;

    // Smart Sweat Score
    const sweatScore = scoreSmartSweat({
      decisionAligned: scores.decisionAligned ?? false,
      recoveredWell: scores.recoveryDisciplined,
      consistent,
    });

    // Save daily score
    const scoreRecord = {
      id: crypto.uuid(),
      date: today(),
      userId: user.id,
      ...sweatScore,
    };
    addDailyScore(scoreRecord);

    // Update journal entry
    if (journalEntry) {
      const actualSummary = buildActualSummary(review.session, brief?.decision);
      const updated = updateJournalEntryAfterReview(journalEntry, {
        sessionReviewId: review.id,
        actualTrainingSummary: actualSummary,
        smartSweatScoreId: scoreRecord.id,
        smartSweatScore: sweatScore.score,
      });
      upsertJournalEntry(updated);
    }

    setView('result');
  }

  if (!brief) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px' }}>
        <p className="t-eyebrow" style={{ marginBottom: 8 }}>Session Review</p>
        <div style={{
          border: '1px dashed var(--hairline-2)', borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center',
        }}>
          <p className="t-h3" style={{ marginBottom: 8 }}>Complete Morning Brief first</p>
          <p className="t-small">Generate today's Morning Brief before logging your session.</p>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    const entry = getTodaysJournalEntry();
    return <ReviewResult brief={brief} journalEntry={entry} onRedo={() => setView('form')} />;
  }

  return <ReviewForm brief={brief} userId={user?.id} onSaved={handleReviewSaved} />;
}

// ---------------------------------------------------------------------------
// Review form
// ---------------------------------------------------------------------------

function ReviewForm({ brief, userId, onSaved }) {
  const [rested, setRested] = useState(false);
  const [session, setSession] = useState({
    sportType: '', durationHours: '', durationMin: '', trainingLoad: '',
    avgHr: '', maxHr: '', aerobicTe: '', anaerobicTe: '',
    z2Min: '', z2Max: '', timeInZ2Min: '',
  });

  function setS(k, v) { setSession((s) => ({ ...s, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    const durationSec = (parseFloat(session.durationHours || 0) * 3600) + (parseFloat(session.durationMin || 0) * 60);
    const timeInZ2Sec = parseFloat(session.timeInZ2Min || 0) * 60;

    const sessionObj = rested ? null : {
      id: crypto.uuid(),
      date: today(),
      sportType: session.sportType,
      ...(durationSec > 0 && { durationSec }),
      ...(session.trainingLoad !== '' && { trainingLoad: parseFloat(session.trainingLoad) }),
      ...(session.avgHr !== '' && { avgHrBpm: parseFloat(session.avgHr) }),
      ...(session.maxHr !== '' && { maxHrBpm: parseFloat(session.maxHr) }),
      ...(session.aerobicTe !== '' && { aerobicTe: parseFloat(session.aerobicTe) }),
      ...(session.anaerobicTe !== '' && { anaerobicTe: parseFloat(session.anaerobicTe) }),
      ...(session.z2Min !== '' && { z2RangeMin: parseFloat(session.z2Min) }),
      ...(session.z2Max !== '' && { z2RangeMax: parseFloat(session.z2Max) }),
      ...(timeInZ2Sec > 0 && { timeInZ2Sec }),
    };

    const { decisionAligned, recoveryDisciplined, cnsCost } = scoreSession({
      morningBrief: brief,
      session: sessionObj,
      dailyState: brief.inputSnapshot?.dailyHealth || {},
    });

    const review = {
      id: crypto.uuid(),
      date: today(),
      userId,
      morningBriefId: brief.id,
      session: sessionObj,
      decisionAligned,
      recoveryDisciplined,
      cnsCost,
      createdAt: new Date().toISOString(),
    };

    onSaved(review, { decisionAligned, recoveryDisciplined });
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Today — {today()}</p>
      <h1 className="t-h2" style={{ marginBottom: 4 }}>Session Review</h1>
      <p className="t-small" style={{ marginBottom: 20 }}>
        Brief said: <strong>{DECISION_LABELS[brief.decision]}</strong>. What did you actually do?
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ToggleRestButton rested={rested} onToggle={setRested} />

        {!rested && (
          <>
            <div>
              <label style={labelStyle}>Sport type *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SPORT_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setS('sportType', t)}
                    style={{
                      border: `1.5px solid ${session.sportType === t ? 'var(--indigo)' : 'var(--hairline)'}`,
                      borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer',
                      background: session.sportType === t ? '#EEF2FF' : 'transparent',
                      fontWeight: session.sportType === t ? 600 : 400,
                      color: session.sportType === t ? 'var(--indigo)' : 'var(--navy)',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={labelStyle}>Duration</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <NumField label="Hours" value={session.durationHours} onChange={(v) => setS('durationHours', v)} placeholder="1" />
                <NumField label="Minutes" value={session.durationMin} onChange={(v) => setS('durationMin', v)} placeholder="30" max={59} />
              </div>
            </div>

            <div>
              <p style={labelStyle}>Intensity</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <NumField label="Training Load" value={session.trainingLoad} onChange={(v) => setS('trainingLoad', v)} placeholder="80" max={1000} />
                <NumField label="Avg HR (bpm)" value={session.avgHr} onChange={(v) => setS('avgHr', v)} placeholder="138" min={30} max={220} />
                <NumField label="Max HR (bpm)" value={session.maxHr} onChange={(v) => setS('maxHr', v)} placeholder="162" min={30} max={230} />
              </div>
            </div>

            <div>
              <p style={labelStyle}>Training Effect</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <NumField label="Aerobic TE (0–5)" value={session.aerobicTe} onChange={(v) => setS('aerobicTe', v)} placeholder="3.2" max={5} step={0.1} />
                <NumField label="Anaerobic TE (0–5)" value={session.anaerobicTe} onChange={(v) => setS('anaerobicTe', v)} placeholder="1.8" max={5} step={0.1} />
              </div>
            </div>

            <div>
              <p style={labelStyle}>
                Z2 Data{' '}
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
                  (captured — scored in Phase 2)
                </span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <NumField label="Z2 Min (bpm)" value={session.z2Min} onChange={(v) => setS('z2Min', v)} placeholder="120" min={100} max={150} />
                <NumField label="Z2 Max (bpm)" value={session.z2Max} onChange={(v) => setS('z2Max', v)} placeholder="126" min={100} max={150} />
                <NumField label="Time in Z2 (min)" value={session.timeInZ2Min} onChange={(v) => setS('timeInZ2Min', v)} placeholder="45" />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary"
          style={{ height: 48, fontSize: 15, fontWeight: 600 }}
          disabled={!rested && !session.sportType}>
          {rested ? 'Log Rest Day →' : 'Score This Session →'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review result
// ---------------------------------------------------------------------------

function ReviewResult({ brief, journalEntry, onRedo }) {
  const entry = journalEntry;
  const score = entry?.smartSweatScore;
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Today — {today()}</p>
      <h1 className="t-h2" style={{ marginBottom: 20 }}>Session Review</h1>

      {score != null && <ScoreCard score={score} />}

      {entry?.actualTrainingSummary && (
        <div style={{
          border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
          padding: '16px 20px', marginBottom: 16, background: 'var(--ink-04)',
        }}>
          <p className="t-eyebrow" style={{ marginBottom: 8 }}>What you did</p>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.actualTrainingSummary}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={onRedo} style={{ fontSize: 12, color: 'var(--muted)', background: 'none',
          border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Redo today's review
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score card (used here + in JournalPage)
// ---------------------------------------------------------------------------

function ScoreCard({ score, label, breakdown }) {
  const signals = score === 100 ? 3 : score === 66 ? 2 : score === 33 ? 1 : 0;
  const color = score === 100 ? '#059669' : score >= 66 ? '#6366F1' : score >= 33 ? '#D97706' : '#DC2626';

  return (
    <div style={{
      border: `2px solid ${color}20`, borderRadius: 'var(--r-lg)',
      padding: 24, marginBottom: 20,
      background: `${color}08`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 18, color: 'var(--muted)' }}>/100</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 4 }}>{signals}/3 signals met</p>
      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
        Beta behavior score. Reflects coaching alignment, not medical readiness.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ToggleRestButton({ rested, onToggle }) {
  return (
    <button type="button" onClick={() => onToggle(!rested)}
      style={{
        border: `1.5px solid ${rested ? 'var(--mint)' : 'var(--hairline)'}`,
        borderRadius: 'var(--r-md)', padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
        background: rested ? '#ECFDF5' : 'transparent', display: 'flex', gap: 14, alignItems: 'center',
      }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${rested ? 'var(--mint)' : 'var(--hairline-2)'}`,
        background: rested ? 'var(--mint)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {rested && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: 14, color: rested ? '#059669' : 'var(--navy)', marginBottom: 2 }}>
          I rested / did not train today
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          Log a rest day — no session data needed
        </p>
      </div>
    </button>
  );
}

function NumField({ label, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>{label}</label>
      <input
        type="number" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step || 'any'}
        style={inputStyle}
      />
    </div>
  );
}

const DECISION_STYLES_MAP = {
  rest:    { color: '#DC2626', border: '#FCA5A5', bg: '#FFF1F2' },
  recover: { color: '#D97706', border: '#FCD34D', bg: '#FFFBEB' },
  modify:  { color: '#6366F1', border: '#A5B4FC', bg: '#EEF2FF' },
  train:   { color: '#059669', border: '#6EE7B7', bg: '#ECFDF5' },
};

function buildActualSummary(session, briefDecision) {
  if (!session) {
    return briefDecision === 'rest' || briefDecision === 'recover'
      ? 'Rested as recommended.' : 'Rest day — no training.';
  }
  const dur = session.durationSec ? `${Math.round(session.durationSec / 60)} min` : '';
  const load = session.trainingLoad ? ` · Load ${session.trainingLoad}` : '';
  return `${session.sportType}${dur ? ' · ' + dur : ''}${load}`;
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 };

const inputStyle = {
  width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
  padding: '8px 10px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
