import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { Wordmark } from '../components/brand';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email format')
    .refine((e) => !e.endsWith('@example.com'), 'Please use a real email address'),
  handle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  age: z.number({ invalid_type_error: 'Enter a valid age' }).min(13, 'Must be 13+').max(120),
  city: z.string().min(2, 'City must be at least 2 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
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

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error.message}</p>}
    </div>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error, isLoggedIn, clearError } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    clearError();
    await signup(data);
    if (useAuthStore.getState().isLoggedIn) navigate('/onboarding');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--ink-04)' }}>
      <div style={{ marginBottom: 32 }}>
        <Wordmark size={15} />
      </div>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 40 }}>
        <h2 className="t-h3" style={{ marginBottom: 8 }}>Create account</h2>
        <p className="t-small" style={{ marginBottom: 28 }}>Start building your athlete identity</p>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', borderRadius: 'var(--r-sm)', marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Full Name" error={errors.name}>
              <input type="text" placeholder="Minh Ngọc" autoComplete="name" {...register('name')} style={field} />
            </Field>
            <Field label="Handle (@)" error={errors.handle}>
              <input type="text" placeholder="minhsweat" autoComplete="username" {...register('handle')} style={field} />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input type="email" placeholder="your@email.com" autoComplete="email" {...register('email')} style={field} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Age" error={errors.age}>
              <input type="number" placeholder="25" {...register('age', { valueAsNumber: true })} style={field} />
            </Field>
            <Field label="City" error={errors.city}>
              <input type="text" placeholder="Hà Nội" autoComplete="address-level2" {...register('city')} style={field} />
            </Field>
          </div>

          <Field label="Password" error={errors.password}>
            <input type="password" placeholder="••••••" autoComplete="new-password" {...register('password')} style={field} />
          </Field>

          <Field label="Confirm Password" error={errors.confirmPassword}>
            <input type="password" placeholder="••••••" autoComplete="new-password" {...register('confirmPassword')} style={field} />
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, height: 44, opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--indigo)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
