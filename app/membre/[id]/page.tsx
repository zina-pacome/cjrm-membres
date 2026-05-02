'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import * as QRCode from 'qrcode'

type Membre = {
  id: string
  numero_membre: number
  nom: string
  prenom: string
  lieu_naissance: string
  date_naissance: string
  numero_cin: string
  date_delivrance_cin: string
  nom_pere: string
  profession_pere: string
  nom_mere: string
  profession_mere: string
  email: string
  telephone: string
  photo_url: string
  qr_code_data: string
  statut: string
  date_adhesion: string
  poste: string
}

export default function FicheMembre() {
  const { id } = useParams()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrImage, setQrImage] = useState<string>('')

  useEffect(() => {
    const charger = async () => {
      const { data, error } = await supabase
        .from('membres').select('*').eq('id', id).single()
      if (!error && data) {
        setMembre(data)
        const url = `${window.location.origin}/membre/${data.id}`
        const qr = await QRCode.toDataURL(url, {
          width: 180, margin: 1,
          color: { dark: '#333333', light: '#ffffff' }
        })
        setQrImage(qr)
      }
      setLoading(false)
    }
    charger()
  }, [id])

  const formaterDate = (date: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px', fontWeight: '700', color: '#bdbdbd',
    marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase',
  }

  const infoRow: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
  }

  const infoLabel: React.CSSProperties = {
    fontSize: '11px', fontWeight: '600', color: '#bdbdbd',
    marginBottom: '4px', letterSpacing: '0.5px', textTransform: 'uppercase',
  }

  const infoValue: React.CSSProperties = {
    fontSize: '14px', fontWeight: '600', color: '#333',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#bdbdbd', fontSize: '14px' }}>
      Chargement...
    </div>
  )

  if (!membre) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '12px' }}>
      <div style={{ fontSize: '14px', color: '#bdbdbd' }}>Membre introuvable</div>
      <Link href="/admin/membres" style={{ fontSize: '13px', color: '#ffa14e', textDecoration: 'none' }}>← Retour à la liste</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>
            Fiche membre
          </div>
          <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
            N° {String(membre.numero_membre).padStart(4, '0')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={`/badge/${membre.id}`} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#333', color: '#fff',
            borderRadius: '20px', padding: '8px 18px',
            fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Générer le badge
          </Link>
          <Link href="/admin/membres" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#f9f9f9', border: '1px solid #f2f2f2',
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '13px', fontWeight: '600', color: '#828282', textDecoration: 'none',
          }}>
            ← Retour
          </Link>
        </div>
      </div>

      {/* Carte principale */}
      <div style={{ ...card, padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '28px' }}>

          {/* Photo */}
          <div style={{
            width: '100px', height: '100px', borderRadius: '20px',
            overflow: 'hidden', background: '#ecccff', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9b59b6', fontWeight: '700', fontSize: '32px',
          }}>
            {membre.photo_url
              ? <img src={membre.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : membre.prenom[0]
            }
          </div>

          {/* Infos principales */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                background: membre.statut === 'actif' ? '#dfeedb' : '#fee2e2',
                color: membre.statut === 'actif' ? '#89b27c' : '#eb5757',
              }}>{membre.statut.toUpperCase()}</span>
              <span style={{ fontSize: '12px', color: '#bdbdbd' }}>
                Membre depuis {formaterDate(membre.date_adhesion)}
              </span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#1f1f1f', marginBottom: '4px' }}>
              {membre.prenom} {membre.nom}
            </div>

            {membre.poste && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#f9f9f9', borderRadius: '20px',
                padding: '4px 12px', marginBottom: '6px',
                border: '1px solid #f2f2f2',
              }}>
                <svg width="12" height="12" fill="none" stroke="#828282" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#828282' }}>{membre.poste}</span>
              </div>
            )}

            <div style={{ fontSize: '13px', color: '#828282' }}>
              Né(e) le {formaterDate(membre.date_naissance)} à {membre.lieu_naissance}
            </div>
          </div>

          {/* QR Code */}
          {qrImage && (
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <div style={{
                background: '#f9f9f9', borderRadius: '16px',
                padding: '12px', border: '1px solid #f2f2f2',
              }}>
                <img src={qrImage} alt="QR Code" style={{ width: '90px', height: '90px', display: 'block' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#bdbdbd', marginTop: '6px' }}>
                Scanner pour vérifier
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CIN */}
      <div style={card}>
        <div style={sectionTitle}>Carte d'identité nationale</div>
        <div style={infoRow}>
          <div>
            <div style={infoLabel}>Numéro CIN</div>
            <div style={infoValue}>{membre.numero_cin}</div>
          </div>
          <div>
            <div style={infoLabel}>Date de délivrance</div>
            <div style={infoValue}>{formaterDate(membre.date_delivrance_cin)}</div>
          </div>
        </div>
      </div>

      {/* Parents */}
      <div style={card}>
        <div style={sectionTitle}>Parents</div>
        <div style={infoRow}>
          <div>
            <div style={infoLabel}>Père</div>
            <div style={infoValue}>{membre.nom_pere}</div>
            <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>{membre.profession_pere}</div>
          </div>
          <div>
            <div style={infoLabel}>Mère</div>
            <div style={infoValue}>{membre.nom_mere}</div>
            <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>{membre.profession_mere}</div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={card}>
        <div style={sectionTitle}>Contact</div>
        <div style={infoRow}>
          <div>
            <div style={infoLabel}>Téléphone</div>
            <div style={infoValue}>{membre.telephone}</div>
          </div>
          <div>
            <div style={infoLabel}>Email</div>
            <div style={infoValue}>{membre.email || '—'}</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Télécharger le badge', href: `/badge/${membre.id}`, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { label: 'Scanner QR', href: '/scanner', icon: 'M12 4.5v15m7.5-7.5h-15' },
          { label: 'Liste des membres', href: '/admin/membres', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
        ].map(action => (
          <Link key={action.label} href={action.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#ffffff', border: '1px solid #f2f2f2',
            borderRadius: '16px', padding: '16px 20px',
            textDecoration: 'none', color: '#333',
            fontSize: '13px', fontWeight: '600',
            transition: 'border-color 0.15s',
          }}>
            <svg width="16" height="16" fill="none" stroke="#828282" strokeWidth="2" viewBox="0 0 24 24">
              <path d={action.icon} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {action.label}
          </Link>
        ))}
      </div>

    </div>
  )
}