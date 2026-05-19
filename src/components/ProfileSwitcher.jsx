import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ProfileSelector } from './ProfileSelector';
import { DEMO_EMAIL, PAULUS_EMAIL } from '../lib/demoData';

export function ProfileSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();

  const isDemoAccount = user?.email === DEMO_EMAIL || user?.email === PAULUS_EMAIL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isDemoAccount) return null;

  const profileName = user.email === PAULUS_EMAIL ? 'Paulus' : 'Alex';
  const initials = profileName.charAt(0).toUpperCase();
  const accentColor = user.email === PAULUS_EMAIL ? '#059669' : '#6366F1';

  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((o) => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--hairline)', background: 'white',
            cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--navy)',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%', background: accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {initials}
          </div>
          {profileName}
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.4 }}>
            <polyline points="2,3 5,7 8,3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            width: 180, background: 'white',
            border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
            boxShadow: '0 8px 24px rgba(7,19,38,0.12)', zIndex: 200,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => { setIsOpen(false); setShowSelector(true); }}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 16px',
                fontSize: 13, color: 'var(--navy)', background: 'none', border: 'none',
                cursor: 'pointer', display: 'block',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink-04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              Switch Profile
            </button>
            <div style={{ height: 1, background: 'var(--hairline)' }} />
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 16px',
                fontSize: 13, color: '#DC2626', background: 'none', border: 'none',
                cursor: 'pointer', display: 'block',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF1F2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {showSelector && <ProfileSelector onClose={() => setShowSelector(false)} />}
    </>
  );
}
