'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function Connexion() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const [voir, setVoir] = useState(false)

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: motDePasse,
      })

      if (error) {
        setErreur('Email ou mot de passe incorrect.')
        setLoading(false)
        return
      }

      if (data.session) {
        window.location.href = '/admin'
      } else {
        setErreur('Session introuvable.')
        setLoading(false)
      }

    } catch (err: unknown) {
      const error = err as Error
      setErreur('Erreur : ' + error.message)
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #f2f2f2', borderRadius: '12px',
    padding: '14px 16px', fontSize: '14px', color: '#333', outline: 'none',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
    background: '#fcfcfc', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#828282', marginBottom: '6px', letterSpacing: '0.3px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
      padding: '20px',
    }}>

      {/* Cercles décoratifs */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(255,161,78,0.08)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-80px', left: '10%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(236,204,255,0.06)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: '#ffffff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <span style={{ fontWeight: '800', fontSize: '16px', color: '#333' }}>CJ</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
            CJRM
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Commission des Jeunes pour la Refondation de Madagascar
          </div>
        </div>

        {/* Card connexion */}
        <div style={{
          background: '#ffffff', borderRadius: '24px',
          padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f1f1f', marginBottom: '6px' }}>
              Connexion
            </div>
            <div style={{ fontSize: '13px', color: '#828282' }}>
              Accédez à l'espace d'administration CJRM
            </div>
          </div>

          <form onSubmit={handleConnexion}>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={voir ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setVoir(!voir)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#bdbdbd', padding: 0,
                  }}
                >
                  {voir
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                  }
                </button>
              </div>
            </div>

            {/* Message erreur */}
            {erreur && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: '10px', padding: '12px 16px',
                fontSize: '13px', color: '#eb5757',
                fontWeight: '600', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {erreur}
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#bdbdbd' : '#333333',
                color: '#ffffff', border: 'none', borderRadius: '14px',
                padding: '14px', fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
              }}
            >
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            {/* Animation spin */}
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>

          </form>
        </div>

        {/* Retour accueil */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', fontWeight: '500',
          }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}