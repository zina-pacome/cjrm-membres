'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type Profil = {
  id: string
  email: string
  nom: string | null
  role: string
  created_at: string
}

const roles = [
  { value: 'super_admin', label: 'Super Admin', desc: 'Accès total au système', color: '#eb5757', bg: '#fee2e2' },
  { value: 'admin', label: 'Admin', desc: 'Gestion des membres', color: '#ffa14e', bg: '#fff3e0' },
  { value: 'staff', label: 'Staff', desc: 'Ajout et modification', color: '#2563eb', bg: '#eff6ff' },
  { value: 'lecteur', label: 'Lecteur', desc: 'Consultation uniquement', color: '#828282', bg: '#f9f9f9' },
]

export default function Roles() {
  const [profils, setProfils] = useState<Profil[]>([])
  const [loading, setLoading] = useState(true)
  const [modifying, setModifying] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: string; texte: string }>({ type: '', texte: '' })

  useEffect(() => {
    charger()
  }, [])

  const charger = async () => {
    const { data } = await supabase
      .from('profils')
      .select('*')
      .order('created_at')
    setProfils(data || [])
    setLoading(false)
  }

  const changerRole = async (id: string, nouveauRole: string) => {
    setModifying(id)
    const { error } = await supabase
      .from('profils')
      .update({ role: nouveauRole })
      .eq('id', id)

    if (error) {
      setMessage({ type: 'erreur', texte: 'Erreur lors de la modification.' })
    } else {
      setMessage({ type: 'succes', texte: 'Rôle mis à jour avec succès.' })
      charger()
    }
    setModifying(null)
    setTimeout(() => setMessage({ type: '', texte: '' }), 3000)
  }

  const getRoleInfo = (role: string) => roles.find(r => r.value === role) || roles[3]

  const formaterDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Gestion des rôles</div>
        <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
          Gérez les permissions des utilisateurs CJRM
        </div>
      </div>

      {/* Légende des rôles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
        {roles.map(r => (
          <div key={r.value} style={{
            background: '#ffffff', borderRadius: '16px',
            border: '1px solid #f2f2f2', padding: '16px',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: r.bg, borderRadius: '20px', padding: '4px 10px',
              marginBottom: '8px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.color }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: r.color }}>{r.label}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#828282', lineHeight: '1.4' }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Message */}
      {message.texte && (
        <div style={{
          padding: '14px 20px', borderRadius: '14px', marginBottom: '16px',
          background: message.type === 'succes' ? '#dfeedb' : '#fee2e2',
          border: `1px solid ${message.type === 'succes' ? '#a6d997' : '#fca5a5'}`,
          color: message.type === 'succes' ? '#89b27c' : '#eb5757',
          fontSize: '13px', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            {message.type === 'succes'
              ? <polyline points="20 6 9 17 4 12"/>
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></>
            }
          </svg>
          {message.texte}
        </div>
      )}

      {/* Table utilisateurs */}
      <div style={card}>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f1f1f', marginBottom: '20px' }}>
          Utilisateurs ({profils.length})
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Chargement...
          </div>
        ) : profils.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Aucun utilisateur trouvé
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                {['Utilisateur', 'Email', 'Rôle actuel', 'Membre depuis', 'Modifier le rôle'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px',
                    fontSize: '11px', fontWeight: '600', color: '#bdbdbd',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profils.map((p, i) => {
                const roleInfo = getRoleInfo(p.role)
                return (
                  <tr key={p.id} style={{
                    borderBottom: i < profils.length - 1 ? '1px solid #f9f9f9' : 'none',
                  }}>
                    {/* Avatar + nom */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: '#ecccff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#9b59b6',
                          fontWeight: '700', fontSize: '14px', flexShrink: 0,
                        }}>
                          {p.email[0].toUpperCase()}
                        </div>
                        <div style={{ fontWeight: '600', color: '#333', fontSize: '13px' }}>
                          {p.nom || 'Utilisateur'}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px 12px', color: '#828282', fontSize: '13px' }}>
                      {p.email}
                    </td>

                    {/* Rôle actuel */}
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: roleInfo.bg, color: roleInfo.color,
                        fontSize: '11px', fontWeight: '700',
                        padding: '4px 10px', borderRadius: '20px',
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: roleInfo.color }} />
                        {roleInfo.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 12px', color: '#828282', fontSize: '13px' }}>
                      {formaterDate(p.created_at)}
                    </td>

                    {/* Select rôle */}
                    <td style={{ padding: '14px 12px' }}>
                      <select
                        value={p.role}
                        disabled={modifying === p.id}
                        onChange={e => changerRole(p.id, e.target.value)}
                        style={{
                          border: '1px solid #f2f2f2', borderRadius: '10px',
                          padding: '7px 12px', fontSize: '12px', fontWeight: '600',
                          color: '#333', background: '#f9f9f9', cursor: 'pointer',
                          outline: 'none',
                          fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
                          opacity: modifying === p.id ? 0.5 : 1,
                        }}
                      >
                        {roles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}