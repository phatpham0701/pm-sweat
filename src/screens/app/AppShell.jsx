import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../stores/trainingStore';
import { getBetaStatus, applyPromoCode } from '../../lib/training-intelligence/betaAccess';
import { ProfileSwitcher } from '../../components/ProfileSwitcher';

const NAV = [
  { to: '/app/dashboard', label: 'Today', icon: SunIcon },
  { to: '/app/review', label: 'Session', icon: ActivityIcon },
  { to: '/app/journal', label: 'Journal', icon: BookIcon },
  { to: '/app/settings/profile', label: 'Settings', icon: SettingsIcon },
];

export default function AppShell() {
  const navigate = useNavigate();
  const { hasProfile, profile } = useTrainingStore();
  const [betaStatus, setBetaStatus] = useState(null);

  useEffect(() => {
    useTrainingStore.getState().loadAll();
    if (!hasProfile()) {
      navigate('/app/onboarding', { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Recompute beta status whenever profile changes
  useEffect(() => {
    if (profile) setBetaStatus(getBetaStatus(profile));
  }, [profile]);

  function handlePromoSuccess() {
    setBetaStatus(getBetaStatus(profile));
  }

  const isExpired = betaStatus?.isExpired ?? false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--white)' }}>
      {betaStatus && <BetaBanner status={betaStatus} />}

      <ProfileSwitcherBar />

      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        <Outlet />
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
        background: 'var(--white)', borderTop: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 100,
      }}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
            color: isActive ? 'var(--indigo)' : 'var(--muted)',
            fontWeight: isActive ? 600 : 400,
            fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase',
            transition: 'color var(--t-fast)',
          })}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Beta expired overlay — blocks access until promo code is entered */}
      {isExpired && <BetaExpiredModal onSuccess={handlePromoSuccess} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile switcher bar (visible for demo accounts only)
// ---------------------------------------------------------------------------

function ProfileSwitcherBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
      padding: '6px 16px', borderBottom: '1px solid var(--hairline)',
      minHeight: 40,
    }}>
      <ProfileSwitcher />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beta banner (top strip — visible while active)
// ---------------------------------------------------------------------------

function BetaBanner({ status }) {
  const { daysRemaining, hasExtension } = status;

  if (daysRemaining <= 0) return null; // Expired → modal handles it, banner hides

  const urgent = daysRemaining <= 5;
  const bg = urgent ? '#7C3AED' : 'var(--navy)';

  return (
    <div style={{
      background: bg, color: 'white',
      padding: '8px 20px', textAlign: 'center', fontSize: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      transition: 'background 0.3s',
    }}>
      <span style={{ fontWeight: 600, color: '#6EE7B7' }}>
        {hasExtension ? 'Beta (Extended)' : 'Free beta'}
      </span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span style={{ opacity: 0.85 }}>
        {urgent
          ? `⚡ ${daysRemaining} ngày còn lại · Sau beta: 199k–249k VND/tháng`
          : `${daysRemaining} ngày còn lại · Sau beta: 199k–249k VND/tháng`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beta expired modal
// ---------------------------------------------------------------------------

function BetaExpiredModal({ onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = applyPromoCode(code.trim());
      setLoading(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(result.error);
      }
    }, 400);
  }

  return (
    // Full-screen overlay — sits above nav, blocks all interaction
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(7, 19, 38, 0.88)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--r-lg)',
        padding: '36px 32px', maxWidth: 420, width: '100%',
        boxShadow: '0 24px 64px rgba(7,19,38,0.24)',
        textAlign: 'center',
      }}>
        {success ? (
          <SuccessState />
        ) : (
          <ExpiredForm
            code={code}
            error={error}
            loading={loading}
            onCodeChange={setCode}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: '#ECFDF5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
        Đã gia hạn 30 ngày!
      </h2>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>
        Tiếp tục sử dụng PM Sweat miễn phí.
      </p>
    </>
  );
}

function ExpiredForm({ code, error, loading, onCodeChange, onSubmit }) {
  return (
    <>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: '#FFF7ED',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 12, lineHeight: 1.3 }}>
        Thời gian trải nghiệm đã kết thúc
      </h2>

      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
        Cảm ơn bạn đã trải nghiệm PM Sweat.{' '}
        <strong style={{ color: 'var(--navy)' }}>Hãy liên hệ Paulus</strong> để chia sẻ
        feedback và nhận mã gia hạn thêm <strong style={{ color: 'var(--navy)' }}>30 ngày miễn phí</strong>.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <input
            autoFocus
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="Nhập mã promotion"
            maxLength={20}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1.5px solid ${error ? '#FCA5A5' : 'var(--hairline)'}`,
              borderRadius: 'var(--r-md)', padding: '12px 16px',
              fontSize: 16, fontWeight: 600, textAlign: 'center',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              outline: 'none', fontFamily: 'var(--font-mono)',
              background: error ? '#FFF1F2' : 'white',
              color: 'var(--navy)',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!code.trim() || loading}
          className="btn btn-primary"
          style={{ height: 48, fontSize: 15, fontWeight: 600, width: '100%', opacity: !code.trim() ? 0.5 : 1 }}
        >
          {loading ? 'Đang kiểm tra…' : 'Áp dụng mã →'}
        </button>
      </form>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>
        Sau beta: <strong style={{ color: 'var(--navy)' }}>199k–249k VND/tháng</strong>
        <br />Liên hệ Paulus qua{' '}
        <a href="mailto:phatpham0701@gmail.com" style={{ color: 'var(--indigo)', textDecoration: 'underline' }}>
          phatpham0701@gmail.com
        </a>
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SunIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="10" cy="10" r="3.5" />
      <line x1="10" y1="1.5" x2="10" y2="3.5" />
      <line x1="10" y1="16.5" x2="10" y2="18.5" />
      <line x1="1.5" y1="10" x2="3.5" y2="10" />
      <line x1="16.5" y1="10" x2="18.5" y2="10" />
      <line x1="4.1" y1="4.1" x2="5.5" y2="5.5" />
      <line x1="14.5" y1="14.5" x2="15.9" y2="15.9" />
      <line x1="4.1" y1="15.9" x2="5.5" y2="14.5" />
      <line x1="14.5" y1="5.5" x2="15.9" y2="4.1" />
    </svg>
  );
}

function ActivityIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="1.5,10 5,10 7,5 10,15 13,8 15,10 18.5,10" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 3h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" />
      <line x1="7" y1="7" x2="11" y2="7" strokeLinecap="round" />
      <line x1="7" y1="10" x2="11" y2="10" strokeLinecap="round" />
      <line x1="7" y1="13" x2="9" y2="13" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}
