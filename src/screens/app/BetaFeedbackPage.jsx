import React, { useState } from 'react';

const FEEDBACK_KEY = 'pmsweat_ti_beta_feedback';

const QUESTIONS = [
  { id: 1, text: 'Did PM Sweat help you decide what to do today?', type: 'slider' },
  { id: 2, text: 'Did you change your training decision because of PM Sweat?', type: 'choice', options: ['Yes', 'No', 'Not sure'] },
  { id: 3, text: 'Was Morning Brief clearer than your ChatGPT + screenshot workflow?', type: 'choice', options: ['Yes', 'No', 'Same'] },
  { id: 4, text: 'Was Session Review useful?', type: 'slider' },
  { id: 5, text: 'Smart Sweat Score felt…', type: 'choice', options: ['Meaningful', 'Gimmicky', 'Not sure'] },
  { id: 6, text: 'Which feature was most valuable?', type: 'choice', options: ['Morning Brief', 'Session Review', 'Journal', 'Smart Sweat Score', 'Other'] },
  { id: 7, text: 'Would you continue using PM Sweat after the beta?', type: 'choice', options: ['Yes', 'No', 'Maybe'] },
  { id: 8, text: 'Would you pay 199k–249k VND/month?', type: 'choice', options: ['Yes', 'No', 'Maybe'] },
  { id: 9, text: 'What would make you pay for it?', type: 'text' },
  { id: 10, text: 'What should be removed or simplified?', type: 'text' },
];

export default function BetaFeedbackPage() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || {}; }
    catch { return {}; }
  });
  const [submitted, setSubmitted] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem(FEEDBACK_KEY + '_done')); }
    catch { return false; }
  });

  function setAnswer(id, val) {
    setAnswers((a) => ({ ...a, [id]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const record = { ...answers, submittedAt: new Date().toISOString() };
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(record));
    localStorage.setItem(FEEDBACK_KEY + '_done', 'true');
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>🙏</p>
        <h2 className="t-h2" style={{ marginBottom: 12 }}>Feedback received</h2>
        <p className="t-small" style={{ marginBottom: 24 }}>
          Thanks for taking the time. This directly shapes what PM Sweat becomes.
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          Expected pricing after beta: <strong>199k–249k VND/month</strong><br />
          Phase 2 (coach dashboard, advanced signals): <strong>399k–599k VND/month</strong>
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 60px' }}>
      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Beta Feedback</p>
      <h1 className="t-h2" style={{ marginBottom: 8 }}>10 quick questions</h1>
      <p className="t-small" style={{ marginBottom: 32 }}>
        Your answers determine what Phase 2 becomes. No BS — be direct.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {QUESTIONS.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => setAnswer(q.id, v)}
          />
        ))}

        <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 24 }}>
          <p className="t-small" style={{ marginBottom: 16 }}>
            <strong>{answeredCount}/10</strong> answered
            {answeredCount < 10 && ' · Unanswered questions will be skipped.'}
          </p>
          <button type="submit" className="btn btn-primary" style={{ height: 48, width: '100%', fontSize: 15, fontWeight: 600 }}>
            Submit feedback →
          </button>
        </div>
      </form>
    </div>
  );
}

function QuestionBlock({ question, value, onChange }) {
  return (
    <div>
      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 400, color: 'var(--muted)', marginRight: 8 }}>{question.id}.</span>
        {question.text}
      </p>

      {question.type === 'slider' && (
        <SliderInput value={value} onChange={onChange} />
      )}
      {question.type === 'choice' && (
        <ChoiceInput options={question.options} value={value} onChange={onChange} />
      )}
      {question.type === 'text' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer…"
          rows={3}
          style={{
            width: '100%', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
            padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  );
}

function SliderInput({ value, onChange }) {
  const v = value ?? 5;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <input
          type="range" min={1} max={10} step={1} value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--indigo)' }}
        />
        <span style={{
          fontWeight: 700, fontSize: 20, color: 'var(--indigo)',
          minWidth: 32, textAlign: 'right',
        }}>{v}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
        <span>1 — Not at all</span>
        <span>10 — Absolutely</span>
      </div>
    </div>
  );
}

function ChoiceInput({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt} type="button" onClick={() => onChange(opt)}
          style={{
            border: `1.5px solid ${value === opt ? 'var(--indigo)' : 'var(--hairline)'}`,
            borderRadius: 20, padding: '8px 18px', fontSize: 13, cursor: 'pointer',
            background: value === opt ? '#EEF2FF' : 'transparent',
            fontWeight: value === opt ? 600 : 400,
            color: value === opt ? 'var(--indigo)' : 'var(--navy)',
            transition: 'all var(--t-fast)',
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}
