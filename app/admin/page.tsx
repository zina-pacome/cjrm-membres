'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

type Membre = {
  id: string
  nom: string
  prenom: string
  statut: string
  created_at: string
}

export default function Dashboard() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('membres').select('id,nom,prenom,statut,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setMembres(data || []); setLoading(false) })
  }, [])

  const now = new Date()
  const total = membres.length
  const actifs = membres.filter(m => m.statut === 'actif').length
  const inactifs = total - actifs
  const nouveaux = membres.filter(m => {
    const d = new Date(m.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // Bar chart — inscriptions par mois
  const parMois = Array(12).fill(0)
  membres.forEach(m => {
    const d = new Date(m.created_at)
    if (d.getFullYear() === now.getFullYear()) parMois[d.getMonth()]++
  })

  const barData = {
    labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
    datasets: [{
      data: parMois,
      backgroundColor: '#ecccff',
      borderRadius: 15,
      borderSkipped: false,
    }],
  }

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: (c: {raw: unknown}) => ` ${c.raw} membre(s)`,
    }}},
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#969696', font: { size: 13 } }, grid: { color: '#f2f2f2' } },
      x: { ticks: { color: '#969696', font: { size: 13 } }, grid: { display: false } },
    },
  }

  // Doughnut — actifs / inactifs
  const doughnutData = {
    labels: ['Actifs', 'Inactifs'],
    datasets: [{
      data: [actifs || 1, inactifs || 0],
      backgroundColor: ['#a6d997', '#dfeedb'],
      borderWidth: 0,
    }],
  }
  const doughnutOptions = {
    cutout: '75%',
    plugins: { legend: { display: false } },
  }

  const formaterDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '40px',
    border: '1px solid #f2f2f2', padding: '28px',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#bdbdbd', fontSize: '16px' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffa14e', marginBottom: '6px' }}>
          👋 Bienvenue dans l'administration
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f1f1f' }}>
          CJRM — {total} membre{total > 1 ? 's' : ''} enregistré{total > 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total membres', value: total, color: '#333' },
          { label: 'Nouveaux ce mois', value: nouveaux, color: '#ffa14e' },
          { label: 'Membres inactifs', value: inactifs, color: '#eb5757' },
          { label: 'Membres actifs', value: actifs, color: '#89b27c' },
        ].map(s => (
          <div key={s.label} style={{ ...card, borderRadius: '20px', padding: '20px 24px' }}>
            <div style={{ fontSize: '13px', color: '#828282', fontWeight: '500', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Bar chart */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#828282' }}>
              Évolution des inscriptions — {now.getFullYear()}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#f9f9f9', borderRadius: '6px', padding: '6px 12px',
              fontSize: '14px', color: '#828282', fontWeight: '600',
            }}>
              Cette année
              <svg width="12" height="12" fill="#828282" viewBox="0 0 10 10">
                <polygon points="0,0 10,0 5,8"/>
              </svg>
            </div>
          </div>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Doughnut — répartition */}
        <div style={card}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '20px' }}>
            Taux d'activité
          </div>
          <div style={{ position: 'relative', width: '160px', margin: '0 auto 20px' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#89b27c' }}>
                {total > 0 ? Math.round((actifs / total) * 100) : 0}%
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#dfeedb' }} />
                <span style={{ fontSize: '36px', fontWeight: '700', color: '#333' }}>{inactifs}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#828282', fontWeight: '600' }}>Inactifs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#a6d997' }} />
                <span style={{ fontSize: '36px', fontWeight: '700', color: '#333' }}>{actifs}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#828282', fontWeight: '600' }}>Actifs</div>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Activités récentes</div>
            <Link href="/admin/membres" style={{ fontSize: '13px', color: '#ffa14e', fontWeight: '600', textDecoration: 'none' }}>
              Voir tout →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {membres.slice(0, 5).map((m, i) => (
              <Link key={m.id} href={`/membre/${m.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0', textDecoration: 'none',
                borderBottom: i < 4 ? '1px solid #f9f9f9' : 'none',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: ['#8e4b6e','#72c8cc','#ffbb4f','#6fcf97','#ecccff'][i % 5],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0,
                }}>{m.prenom[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    {m.prenom} {m.nom}
                  </div>
                  <div style={{ fontSize: '11px', color: '#bdbdbd' }}>
                    Ajouté le {formaterDate(m.created_at)}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
                  background: m.statut === 'actif' ? '#dfeedb' : '#fee2e2',
                  color: m.statut === 'actif' ? '#89b27c' : '#eb5757',
                }}>{m.statut}</div>
              </Link>
            ))}
            {membres.length === 0 && (
              <div style={{ textAlign: 'center', color: '#bdbdbd', padding: '20px', fontSize: '14px' }}>
                Aucun membre enregistré
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}