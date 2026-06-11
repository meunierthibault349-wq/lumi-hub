'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/client/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--night)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 16, padding: '36px 32px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: '#0B1120',
            border: '2px solid #0D9488', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 17, fontWeight: 800,
            color: '#0D9488', fontFamily: 'var(--font-jakarta)',
          }}>L</div>
          <div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 16 }}>Lumi</div>
            <div style={{ fontSize: 11, color: 'var(--gray)' }}>Espace Client</div>
          </div>
        </div>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
              Lien envoyé
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6 }}>
              Un lien de connexion a été envoyé à <strong style={{ color: 'var(--white)' }}>{email}</strong>.<br />
              Vérifiez votre boîte mail et cliquez sur le lien.
            </div>
            <button
              onClick={() => setStatus('idle')}
              style={{
                marginTop: 24, padding: '8px 20px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,.1)', background: 'transparent',
                color: 'var(--gray)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Renvoyer un lien
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>
                Connexion
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray)' }}>
                Entrez votre email pour recevoir un lien de connexion.
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  required
                  autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8, boxSizing: 'border-box',
                    border: '1px solid rgba(255,255,255,.1)', background: 'var(--night-3)',
                    color: 'var(--white)', fontSize: 14, fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>

              {status === 'error' && (
                <div style={{ fontSize: 12, color: '#f87171', padding: '8px 12px', background: 'rgba(248,113,113,.08)', borderRadius: 6 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                style={{
                  padding: '11px', borderRadius: 8, border: 'none',
                  background: 'var(--teal)', color: 'white', fontSize: 14,
                  fontWeight: 600, cursor: status === 'loading' ? 'wait' : 'pointer',
                  fontFamily: 'inherit', opacity: !email.trim() ? .5 : 1,
                  transition: 'opacity .15s',
                }}>
                {status === 'loading' ? 'Envoi en cours…' : 'Recevoir le lien de connexion'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
