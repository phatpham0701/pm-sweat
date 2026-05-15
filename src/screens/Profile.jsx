import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import { Wordmark } from '../components/brand';
import RankBadge from '../components/leaderboards/RankBadge';
import { useLeaderboard } from '../hooks/useLeaderboard';

const field = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--hairline)',
  borderRadius: 'var(--r-sm)',
  fontSize: 15,
  fontFamily: 'var(--font-sans)',
  color: 'var(--navy)',
  outline: 'none',
  background: 'white',
};

export function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const { userEntry } = useLeaderboard('global');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      handle: user?.handle || '',
      city: user?.city || '',
    },
  });

  const onSubmit = (data) => {
    updateProfile(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-04)', padding: 24 }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 32 }}>
          <Wordmark size={14} />
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm">
            ← Dashboard
          </button>
        </div>

        <div className="card" style={{ padding: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'var(--grad-earned)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 18,
            }}>
              {initials}
            </div>
            <div>
              <div className="t-h3">{user?.name}</div>
              <div className="t-small">@{user?.handle} · {user?.email}</div>
            </div>
          </div>

          {/* Rank badge */}
          {userEntry && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
              padding: '14px 16px', background: 'var(--ink-04)', borderRadius: 'var(--r-md)',
            }}>
              <RankBadge rank={userEntry.rank} score={userEntry.globalScore} />
              <div>
                <div className="t-eyebrow" style={{ marginBottom: 4 }}>Global Rank</div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>#{userEntry.rank}</div>
                <div className="t-small">{userEntry.globalScore.toLocaleString()} pts · {userEntry.weeklyScore} this week</div>
              </div>
              <button
                onClick={() => navigate('/leaderboards')}
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: 'auto' }}
              >
                View Rankings
              </button>
            </div>
          )}

          {saved && (
            <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.1)', color: 'var(--mint)', borderRadius: 'var(--r-sm)', marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
              Profile saved ✓
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full Name</label>
              <input {...register('name')} style={field} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Handle</label>
              <input {...register('handle')} style={field} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>City</label>
              <input {...register('city')} style={field} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              Save changes
            </button>
          </form>

          <hr style={{ margin: '32px 0' }} />

          <div>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>Account</div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
