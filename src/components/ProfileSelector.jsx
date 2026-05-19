import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTrainingStore } from '../stores/trainingStore';
import { tiStorage } from '../lib/tiStorage';
import {
  DEMO_EMAIL, DEMO_PASS,
  PAULUS_EMAIL, PAULUS_PASS, PAULUS_ID,
  ensureAlexAccount, ensurePaulusAccount, seedAlexDemoData,
} from '../lib/demoData';

const PROFILES = [
  {
    id: 'alex',
    email: DEMO_EMAIL,
    pass: DEMO_PASS,
    name: 'Alex Chen',
    handle: 'alexchen',
    icon: '🏆',
    description: '47-week training history · full demo data',
    detail: 'For testing UI & features',
  },
  {
    id: 'paulus',
    email: PAULUS_EMAIL,
    pass: PAULUS_PASS,
    userId: PAULUS_ID,
    name: 'Paulus',
    handle: 'paulus',
    icon: '🚀',
    description: 'Fresh profile — Day 1',
    detail: 'Real 30-day dogfood test',
  },
];

export function ProfileSelector({ onClose }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSelect = async (profile) => {
    setLoading(true);
    try {
      // Save current user's TI snapshot before switching
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const currentId = currentUser.email === PAULUS_EMAIL ? 'paulus' : 'alex';
        tiStorage.saveSnapshot(currentId);
      }

      // Ensure user account exists in localStorage
      if (profile.id === 'alex') {
        ensureAlexAccount();
        seedAlexDemoData();
      } else {
        ensurePaulusAccount();
      }

      // Restore TI data for target profile (or clear for fresh Paulus start)
      tiStorage.restoreSnapshot(profile.id);

      // Login
      await login(profile.email, profile.pass);
      if (!useAuthStore.getState().isLoggedIn) return;

      // Reload TI store from localStorage (AppShell's useEffect won't re-run if already mounted)
      useTrainingStore.getState().loadAll();

      navigate('/app/dashboard');
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(7,19,38,0.6)',
      backdropFilter: 'blur(4px)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--r-lg)',
        padding: '36px 32px', maxWidth: 420, width: '100%',
        boxShadow: '0 24px 64px rgba(7,19,38,0.24)',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
          Select Profile
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
          Choose an account to continue
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              disabled={loading}
              style={{
                border: '1.5px solid var(--hairline)', borderRadius: 'var(--r-md)',
                padding: '16px 20px', textAlign: 'left', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'white', display: 'flex', gap: 16, alignItems: 'flex-start',
                opacity: loading ? 0.6 : 1, width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'var(--indigo)';
                  e.currentTarget.style.background = '#F5F7FF';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--hairline)';
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: p.id === 'alex' ? '#EEF2FF' : '#ECFDF5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {p.icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)', marginBottom: 3 }}>
                  {p.name}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 2 }}>{p.description}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.7 }}>{p.detail}</p>
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
            Loading profile…
          </p>
        )}

        <button
          onClick={onClose}
          disabled={loading}
          style={{
            marginTop: 20, width: '100%', textAlign: 'center', fontSize: 13,
            color: 'var(--muted)', background: 'none', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer', padding: '8px 0',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
