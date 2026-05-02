'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Parametres() {
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [ancienMdp, setAncienMdp] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmerMdp, setConfirmerMdp] = useState('')
  const [loadingProfil, setLoadingProfil] = useState(false)
  const [loadingMdp, setLoadingMdp] = useState(false)
  const [messageProfil, setMessageProfil] = useState<{ type: string; texte: string }>({ type: '', texte: '' })
  const [messageMdp, setMessageMdp] = useState<{ type: string; texte: string }>({ type: '', texte: '' })
  const [voir, setVoir] = useState(false)

  useEffect(() => {
    const charger = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data: profil } = await supabase
          .from('profils').select('nom').eq('id', user.id).single()
        if (profil) setNom(profil.nom || '')
      }
    }
    charger()
  }, [])

  const sauvegarderProfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingProfil(true)
    setMessageProfil({ type: '', texte: '' })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non connecté')

      const { error } = await supabase
        .from('profils')
        .update({ nom })
        .eq('id', user.id)

      if (error) throw error
      setMessageProfil({ type: 'succes', texte: 'Profil mis à jour avec succès.' })
    } catch (err: unknown) {
      const error = err as Error
      setMessageProfil({ type: 'erreur', texte: 'Erreur : ' + error.message })
    } finally {
      setLoadingProfil(false)
      setTimeout(() => setMessageProfil({ type: '', texte: '' }), 3000)
    }
  }

  const changerMotDePasse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingMdp(true)
    setMessageMdp({ type: '', texte: '' })

    if (nouveauMdp !== confirmerMdp) {
      setMessageMdp({ type: 'erreur', texte: 'Les mots de passe ne correspondent pas.' })
      setLoadingMdp(false)
      return
    }

    if (nouveauMdp.length < 6) {
      setMessageMdp({ type: 'erreur', texte: 'Le mot de passe doit contenir au moins 6 caractères.' })
      setLoadingMdp(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
      if (error) throw error
      setMessageMdp({ type: 'succes', texte: 'Mot de passe changé avec succès.' })
      setAncienMdp('')
      setNouveauMdp('')
      setConfirmerMdp('')
    } catch (err: unknown) {
      const error = err as Error
      setMessageMdp({ type: 'erreur', texte: 'Erreur : ' + error.message })
    } finally {
      setLoadingMdp(false)
      setTimeout(() => setMessageMdp({ type: '', texte: '' }), 3000)
    }
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '16px', fontWeight: '700', color: '#1f1f1f',
    marginBottom: '6px',
  }

  const sectionDesc: React.CSSProperties = {
    fontSize: '13px', color: '#828282', marginBottom: '24px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #f2f2f2', borderRadius: '12px',
    padding: '12px 16px', fontSize: '14px', color: '#333', outline: 'none',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
    background: '#fcfcfc', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#828282', marginBottom: '6px', letterSpacing: '0.3px',
  }

  const grid2: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
  }

  const MessageBox = ({ msg }: { msg: { type: string; texte: string } }) => (
    msg.texte ? (
      <div style={{
        padding: '12px 16px', borderRadius: '12px', marginBottom: '16px',
        background: msg.type === 'succes' ? '#dfeedb' : '#fee2e2',
        border: `1px solid ${msg.type === 'succes' ? '#a6d997' : '#fca5a5'}`,
        color: msg.type === 'succes' ? '#89b27c' : '#eb5757',
        fontSize: '13px', fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          {msg.type === 'succes'
            ? <polyline points="20 6 9 17 4 12"/>
            : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></>
          }
        </svg>
        {msg.texte}
      </div>
    ) : null
  )

  return (
    <div style={{ maxWidth: '700px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Paramètres</div>
        <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
          Gérez votre compte et vos préférences
        </div>
      </div>

      {/* Info compte */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #ecccff, #c9a0ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#9b59b6', fontWeight: '800', fontSize: '24px', flexShrink: 0,
        }}>
          {email[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f1f1f', marginBottom: '4px' }}>
            {nom || 'Administrateur'}
          </div>
          <div style={{ fontSize: '13px', color: '#828282' }}>{email}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: '#fee2e2', borderRadius: '20px',
            padding: '3px 10px', marginTop: '6px',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eb5757' }} />
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#eb5757' }}>Super Admin</span>
          </div>
        </div>
      </div>

      {/* Modifier le profil */}
      <div style={card}>
        <div style={sectionTitle}>Informations du profil</div>
        <div style={sectionDesc}>Modifiez votre nom d'affichage.</div>

        <MessageBox msg={messageProfil} />

        <form onSubmit={sauvegarderProfil}>
          <div style={{ ...grid2, marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Nom complet</label>
              <input
                value={nom} onChange={e => setNom(e.target.value)}
                style={inputStyle} placeholder="Votre nom"
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                value={email} disabled
                style={{ ...inputStyle, background: '#f9f9f9', color: '#bdbdbd', cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <button type="submit" disabled={loadingProfil} style={{
            background: loadingProfil ? '#bdbdbd' : '#333333',
            color: '#ffffff', border: 'none', borderRadius: '12px',
            padding: '11px 24px', fontSize: '13px', fontWeight: '600',
            cursor: loadingProfil ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
          }}>
            {loadingProfil ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Changer mot de passe */}
      <div style={card}>
        <div style={sectionTitle}>Changer le mot de passe</div>
        <div style={sectionDesc}>Utilisez un mot de passe fort d'au moins 6 caractères.</div>

        <MessageBox msg={messageMdp} />

        <form onSubmit={changerMotDePasse}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={voir ? 'text' : 'password'}
                  value={nouveauMdp} onChange={e => setNouveauMdp(e.target.value)}
                  required style={{ ...inputStyle, paddingRight: '48px' }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setVoir(!voir)} style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#bdbdbd', padding: 0,
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {voir
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmerMdp} onChange={e => setConfirmerMdp(e.target.value)}
                required style={inputStyle} placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" disabled={loadingMdp} style={{
            background: loadingMdp ? '#bdbdbd' : '#333333',
            color: '#ffffff', border: 'none', borderRadius: '12px',
            padding: '11px 24px', fontSize: '13px', fontWeight: '600',
            cursor: loadingMdp ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
          }}>
            {loadingMdp ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      {/* Infos système */}
      <div style={card}>
        <div style={sectionTitle}>Informations système</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Application', value: 'CJRM — Gestion membres' },
            { label: 'Version', value: 'v1.0.0' },
            { label: 'Framework', value: 'Next.js 16' },
            { label: 'Base de données', value: 'Supabase (PostgreSQL)' },
            { label: 'Hébergement', value: 'Vercel' },
            { label: 'Dernière mise à jour', value: new Date().toLocaleDateString('fr-FR') },
          ].map(info => (
            <div key={info.label} style={{
              background: '#f9f9f9', borderRadius: '12px', padding: '14px 16px',
              border: '1px solid #f2f2f2',
            }}>
              <div style={{ fontSize: '11px', color: '#bdbdbd', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {info.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{info.value}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}