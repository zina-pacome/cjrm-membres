'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type Membre = {
  id: string
  numero_membre: number
  nom: string
  prenom: string
  telephone: string
  email: string
  statut: string
  date_adhesion: string
  photo_url: string
  created_at: string
}

export default function ListeMembres() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('tous')

  useEffect(() => {
    supabase.from('membres')
      .select('id,numero_membre,nom,prenom,telephone,email,statut,date_adhesion,photo_url,created_at')
      .order('numero_membre', { ascending: true })
      .then(({ data }) => { setMembres(data || []); setLoading(false) })
  }, [])

  const membresFiltres = membres.filter(m => {
    const matchRecherche = `${m.nom} ${m.prenom} ${m.telephone} ${m.email}`
      .toLowerCase().includes(recherche.toLowerCase())
    const matchStatut = filtreStatut === 'tous' || m.statut === filtreStatut
    return matchRecherche && matchStatut
  })

  const formaterDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const exporterExcel = () => {
    const data = membres.map(m => ({
      'N°': m.numero_membre,
      'Nom': m.nom,
      'Prénom': m.prenom,
      'Téléphone': m.telephone,
      'Email': m.email || '—',
      'Statut': m.statut,
      'Date adhésion': formaterDate(m.date_adhesion),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Membres')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buf]), 'membres-cjrm.xlsx')
  }

  const exporterCSV = () => {
    const data = membres.map(m => ({
      'N°': m.numero_membre,
      'Nom': m.nom,
      'Prénom': m.prenom,
      'Téléphone': m.telephone,
      'Email': m.email || '—',
      'Statut': m.statut,
      'Date adhésion': formaterDate(m.date_adhesion),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    saveAs(new Blob([csv], { type: 'text/csv' }), 'membres-cjrm.csv')
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '24px',
  }

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Membres</div>
          <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
            {membres.length} membre{membres.length > 1 ? 's' : ''} enregistré{membres.length > 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exporterCSV} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#ffffff', border: '1px solid #f2f2f2',
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '13px', fontWeight: '600', color: '#828282', cursor: 'pointer',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV
          </button>
          <button onClick={exporterExcel} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#ffffff', border: '1px solid #f2f2f2',
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '13px', fontWeight: '600', color: '#828282', cursor: 'pointer',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Excel
          </button>
          <Link href="/admin/nouveau-membre" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#333333', color: '#ffffff',
            borderRadius: '20px', padding: '8px 18px',
            fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau membre
          </Link>
        </div>
      </div>

      {/* Filtres + Recherche */}
      <div style={{ ...card, marginBottom: '20px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Recherche */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#f9f9f9', borderRadius: '12px', padding: '10px 16px', flex: 1,
          }}>
            <svg width="16" height="16" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, téléphone..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontSize: '14px', color: '#333', width: '100%',
                fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
              }}
            />
          </div>
          {/* Filtre statut */}
          {['tous', 'actif', 'inactif'].map(f => (
            <button key={f} onClick={() => setFiltreStatut(f)} style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: 'none',
              background: filtreStatut === f ? '#333' : '#f9f9f9',
              color: filtreStatut === f ? '#fff' : '#828282',
              textTransform: 'capitalize',
            }}>
              {f === 'tous' ? 'Tous' : f === 'actif' ? 'Actifs' : 'Inactifs'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={card}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Chargement...
          </div>
        ) : membresFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bdbdbd', fontSize: '14px' }}>
            Aucun membre trouvé
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                {['N°', 'Membre', 'Téléphone', 'Email', 'Adhésion', 'Statut', ''].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px',
                    fontSize: '12px', fontWeight: '600', color: '#bdbdbd',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {membresFiltres.map((m, i) => (
                <tr key={m.id} style={{
                  borderBottom: i < membresFiltres.length - 1 ? '1px solid #f9f9f9' : 'none',
                  transition: 'background 0.1s',
                }}>
                  <td style={{ padding: '14px 12px', color: '#bdbdbd', fontWeight: '600' }}>
                    {String(m.numero_membre).padStart(4, '0')}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        overflow: 'hidden', background: '#ecccff', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#9b59b6', fontWeight: '700', fontSize: '14px',
                      }}>
                        {m.photo_url
                          ? <img src={m.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : m.prenom[0]
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{m.prenom} {m.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#828282' }}>{m.telephone}</td>
                  <td style={{ padding: '14px 12px', color: '#828282' }}>{m.email || '—'}</td>
                  <td style={{ padding: '14px 12px', color: '#828282' }}>{formaterDate(m.date_adhesion)}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px',
                      background: m.statut === 'actif' ? '#dfeedb' : '#fee2e2',
                      color: m.statut === 'actif' ? '#89b27c' : '#eb5757',
                    }}>{m.statut}</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <Link href={`/membre/${m.id}`} style={{
                      fontSize: '12px', fontWeight: '600', color: '#828282',
                      textDecoration: 'none', padding: '6px 14px', borderRadius: '20px',
                      background: '#f9f9f9', border: '1px solid #f2f2f2',
                    }}>
                      Voir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}