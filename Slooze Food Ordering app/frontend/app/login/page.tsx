'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, gql } from '@apollo/client';
import { setToken, setUser } from '@/lib/auth';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setToken(data.login.access_token);
      setUser(data.login.user);
      router.push('/dashboard');
    },
    onError: (err) => {
      setError(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login({
      variables: {
        input: { email, password },
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-brand-500 to-fuchsia-500 shadow-glow" />
            <div>
              <div className="text-sm font-semibold tracking-tight text-foreground/70">
                Slooze Eats
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Futuristic food ordering portal
              </h1>
            </div>
          </div>
          <p className="text-foreground/60">
            Role-based access (Admin / Manager / Member) with country boundaries. Built like an
            Uber Eats–style internal ordering console.
          </p>

          <div className="surface rounded-2xl p-4">
            <div className="text-xs font-semibold text-foreground/60">Quick logins</div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <button
                className="btn-secondary justify-start"
                onClick={() => {
                  setEmail('nick.fury@slooze.com');
                  setPassword('password123');
                }}
              >
                Admin • Nick Fury
              </button>
              <button
                className="btn-secondary justify-start"
                onClick={() => {
                  setEmail('captain.marvel@slooze.com');
                  setPassword('password123');
                }}
              >
                Manager • India
              </button>
              <button
                className="btn-secondary justify-start"
                onClick={() => {
                  setEmail('captain.america@slooze.com');
                  setPassword('password123');
                }}
              >
                Manager • America
              </button>
              <button
                className="btn-secondary justify-start"
                onClick={() => {
                  setEmail('thanos@slooze.com');
                  setPassword('password123');
                }}
              >
                Member • India
              </button>
            </div>
          </div>
        </div>

        <div className="surface w-full rounded-3xl p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1 text-sm text-foreground/60">Use your assigned account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="name@slooze.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground/60">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in…' : 'Continue'}
            </button>

            <div className="pt-2 text-center text-xs text-foreground/50">
              Tip: Admin can see both countries. Managers/Members are restricted to their country.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
