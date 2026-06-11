'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Step = 'email' | 'sending' | 'code' | 'verifying' | 'error';

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStep('sending');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    if (error) {
      setErrorMsg(error.message);
      setStep('error');
    } else {
      setStep('code');
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStep('verifying');
    setErrorMsg('');

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });

    if (error) {
      setErrorMsg('Code invalide ou expiré.');
      setStep('code');
    } else {
      router.push('/client');
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

        {/* Step 1 — email */}
        {(step === 'email' || step === 'sending' || step === 'error') && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>
                Connexion
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray)' }}>
                Entrez votre email pour recevoir un code de connexion.
              </div>
            </div>

            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                    color: 'var(--white)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
                  }}
                />
              </div>

              {step === 'error' && (
                <div style={{ fontSize: 12, color: '#f87171', padding: '8px 12px', background: 'rgba(248,113,113,.08)', borderRadius: 6 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={step === 'sending' || !email.trim()}
                style={{
                  padding: '11px', borderRadius: 8, border: 'none',
                  background: 'var(--teal)', color: 'white', fontSize: 14,
                  fontWeight: 600, cursor: step === 'sending' ? 'wait' : 'pointer',
                  fontFamily: 'inherit', opacity: !email.trim() ? .5 : 1,
                  transition: 'opacity .15s',
                }}>
                {step === 'sending' ? 'Envoi en cours…' : 'Recevoir le code'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 — code */}
        {(step === 'code' || step === 'verifying') && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>
                Code de connexion
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6 }}>
                Un code à 6 chiffres a été envoyé à <strong style={{ color: 'var(--white)' }}>{email}</strong>.
              </div>
            </div>

            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                  Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                  autoFocus
                  inputMode="numeric"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8, boxSizing: 'border-box',
                    border: '1px solid rgba(255,255,255,.1)', background: 'var(--night-3)',
                    color: 'var(--white)', fontSize: 20, fontFamily: 'monospace', outline: 'none',
                    letterSpacing: 6, textAlign: 'center',
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{ fontSize: 12, color: '#f87171', padding: '8px 12px', background: 'rgba(248,113,113,.08)', borderRadius: 6 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={step === 'verifying' || code.length < 6}
                style={{
                  padding: '11px', borderRadius: 8, border: 'none',
                  background: 'var(--teal)', color: 'white', fontSize: 14,
                  fontWeight: 600, cursor: step === 'verifying' ? 'wait' : 'pointer',
                  fontFamily: 'inherit', opacity: code.length < 6 ? .5 : 1,
                  transition: 'opacity .15s',
                }}>
                {step === 'verifying' ? 'Vérification…' : 'Se connecter'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setCode(''); setErrorMsg(''); }}
                style={{
                  padding: '8px', borderRadius: 8, border: 'none',
                  background: 'transparent', color: 'var(--gray)', fontSize: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                Changer d&apos;email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
