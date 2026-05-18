import React, { useState } from 'react';
import { useTrainingStore } from '../../stores/trainingStore';
import { addUserReflection } from '../../lib/training-intelligence/journal/createJournalEntry';

const DECISION_LABELS = {
  rest: 'Rest', recover: 'Recovery', modify: 'Modified', train: 'Full training',
};

const SCORE_COLOR = (s) =>
  s === 100 ? '#059669' : s >= 66 ? '#6366F1' : s >= 33 ? '#D97706' : '#DC2626';

export default function JournalPage() {
  const { journal, upsertJournalEntry, getDaysSinceStart } = useTrainingStore();
  const daysSinceStart = getDaysSinceStart();
  const sorted = [...journal].sort((a, b) => (a.date < b.date ? 1 : -1));
  const [expandedId, setExpandedId] = useState(null);

  function handleReflection(entry, text) {
    const updated = addUserReflection(entry, text);
    upsertJournalEntry(updated);
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Your history</p>
        <h1 className="t-h2" style={{ marginBottom: 4 }}>365 Journal</h1>
        <p className="t-small">
          {daysSinceStart > 0
            ? `Day ${daysSinceStart} of your training journey.`
            : 'Complete your first Morning Brief to start the journal.'}
        </p>
      </div>

      {journal.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <WeekSummary journal={journal} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            {sorted.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                expanded={expandedId === entry.id}
                onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                onSaveReflection={(text) => handleReflection(entry, text)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Week summary strip
// ---------------------------------------------------------------------------

function WeekSummary({ journal }) {
  const last7 = journal.slice(-7);
  const scores = last7.map((e) => e.smartSweatScore).filter((s) => s != null);
  if (scores.length === 0) return null;

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const briefs = last7.filter((e) => e.morningBriefId).length;

  return (
    <div style={{
      border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)', padding: '16px 20px',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
    }}>
      <Stat label="7-day avg score" value={`${avg}/100`} color={SCORE_COLOR(avg)} />
      <Stat label="Briefs completed" value={`${briefs}/7`} />
      <Stat label="Sessions logged" value={String(scores.length)} />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: color || 'var(--navy)', marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Journal card
// ---------------------------------------------------------------------------

function JournalCard({ entry, expanded, onToggle, onSaveReflection }) {
  const [reflection, setReflection] = useState(entry.userReflection || '');
  const [saved, setSaved] = useState(false);
  const score = entry.smartSweatScore;
  const hasScore = score != null;

  function saveReflection() {
    onSaveReflection(reflection);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      {/* Row */}
      <button type="button" onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>{entry.date}</p>
            {entry.decision && (
              <span style={{
                fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10,
                background: 'var(--ink-04)', color: 'var(--muted)',
              }}>
                {DECISION_LABELS[entry.decision] || entry.decision}
              </span>
            )}
          </div>
          {entry.actualTrainingSummary && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.actualTrainingSummary}
            </p>
          )}
        </div>
        {hasScore && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 20, color: SCORE_COLOR(score), margin: 0, lineHeight: 1 }}>
              {score}
            </p>
            <p style={{ fontSize: 10, color: 'var(--muted)', margin: '2px 0 0' }}>/ 100</p>
          </div>
        )}
        <span style={{ color: 'var(--muted)', fontSize: 14, flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--hairline)' }}>
          {entry.plannedSessionSummary && (
            <Detail label="Planned" text={entry.plannedSessionSummary} />
          )}
          {entry.actualTrainingSummary && (
            <Detail label="Actual" text={entry.actualTrainingSummary} />
          )}
          {hasScore && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Smart Sweat Score
              </p>
              <p style={{ fontSize: 24, fontWeight: 700, color: SCORE_COLOR(score), marginBottom: 2 }}>
                {score}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>/100</span>
              </p>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                Beta behavior score — reflects coaching alignment, not medical readiness.
              </p>
            </div>
          )}
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Your reflection
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn today? Any adjustments needed?"
              rows={3}
              style={{
                width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
                padding: '8px 10px', fontSize: 13, fontFamily: 'inherit', resize: 'vertical',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button onClick={saveReflection}
              style={{ marginTop: 8, fontSize: 12, padding: '6px 14px', borderRadius: 20,
                background: saved ? 'var(--mint)' : 'var(--indigo)', color: 'white', border: 'none', cursor: 'pointer' }}>
              {saved ? 'Saved ✓' : 'Save reflection'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, text }) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--navy)', margin: 0 }}>{text}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      border: '1px dashed var(--hairline-2)', borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center',
    }}>
      <p className="t-h3" style={{ marginBottom: 8 }}>No entries yet</p>
      <p className="t-small">
        Journal auto-creates after your first Morning Brief.
        <br />Each entry builds your 365-day training history.
      </p>
    </div>
  );
}
