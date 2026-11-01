'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'participant' | 'judge'>('participant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function redirectByRole(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (error || !data) {
      setError('Could not load your profile.');
      return;
    }
    router.push(`/${data.role}-dashboard`);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });
      if (error) setError(error.message);
      else if (data.user && data.session) await redirectByRole(data.user.id);
      else setError('Account created. Check your email to confirm it.');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else await redirectByRole(data.user.id);
    }
    setLoading(false);
  }

  const input =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-gray-900">
          {mode === 'login' ? 'Log in to ManageMate' : 'Create your account'}
        </h1>

        {mode === 'signup' && (
          <>
            <input
              className={input}
              placeholder="Full name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <select
              className={input}
              value={role}
              onChange={e => setRole(e.target.value as 'participant' | 'judge')}
            >
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
            </select>
          </>
        )}

        <input
          className={input}
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className={input}
          type="password"
          placeholder="Password (min 6)"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
}