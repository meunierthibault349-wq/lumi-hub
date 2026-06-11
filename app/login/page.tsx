'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Email ou mot de passe incorrect.');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--night-1)', position: 'fixed', inset: 0 }}>
      <div style={{ width: 380, background: 'var(--night-2)', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden' }}>
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', textAlign: 'center' }}>
          <div className="logo-icon" style={{ margin: '0 auto 12px' }}><span>L</span></div>
          <div className="logo-wordmark" style={{ fontSize: 18 }}>LUMI HUB</div>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>Espace de gestion privé</div>
        </div>

        <form onSubmit={handleLogin} style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="thibault@lumi-site.fr"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: '#f87171', background: 'rgba(239,68,68,.1)', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn primary"
            style={{ marginTop: 4, height: 42, fontSize: 14, fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
