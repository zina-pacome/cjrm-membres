'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type LogEntry = {
  id: string
  action: string
  details: string
  user_email: string
  created_at: string
  type: 'ajout' | 'modification' | 'suppression' | 'connexion' | 'scan'
}

type Membre = {
  id: string
  nom: string
  prenom: string
  created_at: string
  statut: string
}

export default function Logs() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => {
    const charger = async () => {
      const { data } = await supabase
        .from('membres')
        .select('id, nom, prenom, created_at, statut')
        .order('created_at', { ascending: false })
        .limit(50)
      setMembres(data || [])
      setLoading(false)
    }
    charger()
  }, [])

  // Générer les logs depuis les membres
  const logs: LogEntry[] = membres.map(m => ({
    id: m.id,
    action: 'Membre ajouté',
    details: `${m.prenom} ${m.nom} a été enregistré dans le système`,
    user_email: 'admin@cjrm.mg',
    created_at: m.created_at,
    type: 'ajout',
  }))

  const logsFiltres = filtre === 'tous' ? logs : logs.filter(l => l.type === filtre)

  const formaterDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  const typeConfig = {
    ajout: { label: 'Ajout', color: '#89b27c', bg: '#dfeedb' },
    modification: { label: 'Modification', color: '#ffa14e', bg: '#fff3e0' },
    suppression: { label: 'Suppression', color: '#eb5757', bg: '#fee2e2' },
    connexion: { label: 'Connexion', color: '#2563eb', bg: '#eff6ff' },
    scan: { label: 'Scan QR', color: '#9b59b6', bg: '#f5eeff' },
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Audit Logs</div>
          <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
            Historique des activités du système
          </div>
        </div>
        <div style={{
          background: '#f9f9f9', border: '1px solid #f2f2f2',
          borderRadius: '20px', padding: '8px 16px',
          fontSize: '13px', fontWeight: '600', color: '#828282',
        }}>
          {logs.length} événement{logs.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total événements', value: logs.length, color: '#333', bg: '#f9f9f9' },
          { label: 'Membres ajoutés', value: logs.filter(l => l.type === 'ajout').length, color: '#89b27c', bg: '#dfeedb' },
          { label: 'Aujourd\'hui', value: logs.filter(l => {
            const d = new Date(l.created_at)
            const today = new Date()
            return d.toDateString() === today.toDateString()
          }).length, color: '#ffa14e', bg: '#fff3e0' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#ffffff', borderRadius: '16px',
            border: '1px solid #f2f2f2', padding: '20px',
          }}>
            <div style={{ fontSize: '13px', color: '#828282', marginBottom: '8px', fontWeight: '500' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['tous', 'ajout', 'modification', 'connexion', 'scan'].map(f => (
          <button key={f} onClick={() => setFiltre(f)} style={{
            padding: '7px 14px', borderRadius: '20px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            border: 'none',
            background: filtre === f ? '#333' : '#f9f9f9',
            color: filtre === f ? '#fff' : '#828282',
            textTransform: 'capitalize' as const,
            fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
          }}>
            {f === 'tous' ? 'Tous' : typeConfig[f as keyof typeof typeConfig]?.label || f}
          </button>
        ))}
      </div>

      {/* Liste des logs */}
      <div style={card}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Chargement...
          </div>
        ) : logsFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Aucun événement trouvé
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {logsFiltres.map((log, i) => {
              const config = typeConfig[log.type]
              return (
                <div key={log.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 0',
                  borderBottom: i < logsFiltres.length - 1 ? '1px solid #f9f9f9' : 'none',
                }}>
                  {/* Icône type */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: config.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="16" height="16" fill="none" stroke={config.color} strokeWidth="2" viewBox="0 0 24 24">
                      {log.type === 'ajout' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>}
                      {log.type === 'modification' && <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
                      {log.type === 'suppression' && <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>}
                      {log.type === 'connexion' && <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></>}
                      {log.type === 'scan' && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/></>}
                    </svg>
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>
                        {log.action}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        padding: '2px 8px', borderRadius: '20px',
                        background: config.bg, color: config.color,
                      }}>
                        {config.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#828282', marginBottom: '4px' }}>
                      {log.details}
                    </div>
                    <div style={{ fontSize: '11px', color: '#bdbdbd' }}>
                      {log.user_email} · {formaterDate(log.created_at)}
                    </div>
                  </div>

                  {/* Heure */}
                  <div style={{ fontSize: '11px', color: '#bdbdbd', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}