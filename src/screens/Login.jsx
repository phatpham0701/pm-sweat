import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { Wordmark } from '../components/brand';
import { ProfileSelector } from '../components/ProfileSelector';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

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


export function Login() {
  const navigate = useNavigate();
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const { login, isLoading, error, isLoggedIn, clearError } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    clearError();
    await login(data.email, data.password);
    if (useAuthStore.getState().isLoggedIn) navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--ink-04)' }}>
      <div style={{ marginBottom: 32 }}>
        <Wordmark size={15} />
      </div>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
        <h2 className="t-h3" style={{ marginBottom: 8 }}>Sign in</h2>
        <p className="t-small" style={{ marginBottom: 28 }}>Welcome back to PM Sweat</p>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', borderRadius: 'var(--r-sm)', marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="your@email.com" autoComplete="email" {...register('email')} style={field} />
            {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
            <input type="password" placeholder="••••••" autoComplete="current-password" {...register('password')} style={field} />
            {errors.password && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, height: 44, opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
          <button
            type="button"
            onClick={() => { clearError(); setShowProfileSelector(true); }}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', height: 40, fontSize: 13 }}
          >
            Try demo account
          </button>
          <p className="t-small" style={{ textAlign: 'center', marginTop: 8, color: 'var(--muted)' }}>
            Instant access · full data · no signup needed
          </p>
        </div>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--indigo)', fontWeight: 500 }}>Create account</Link>
        </p>
      </div>

      {showProfileSelector && (
        <ProfileSelector onClose={() => setShowProfileSelector(false)} />
      )}
    </div>
  );
}
