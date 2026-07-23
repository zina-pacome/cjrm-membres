'use client'

import { useEffect, useState, useRef } from 'react'
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
  photo_url: string
  statut: string
  date_adhesion: string
  telephone: string
  poste: string
}

export default function BadgePage() {
  const { id } = useParams()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [qrImage, setQrImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const charger = async () => {
      const { data, error } = await supabase
        .from('membres').select('*').eq('id', id).single()
      if (!error && data) {
        setMembre(data)
        const url = `${window.location.origin}/membre/${data.id}`
        const qr = await QRCode.toDataURL(url, {
          width: 160, margin: 1,
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

  const exporterPDF = async () => {
    if (!badgeRef.current) return
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3, useCORS: true, backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [86, 54] })
      pdf.addImage(imgData, 'PNG', 0, 0, 86, 54)
      pdf.save(`badge-${membre?.nom}-${membre?.prenom}.pdf`)
    } catch (err) { console.error(err) }
    setExporting(false)
  }

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    borderRadius: '20px', padding: '10px 20px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    border: 'none', textDecoration: 'none',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#bdbdbd', fontSize: '14px' }}>
      Chargement...
    </div>
  )

  if (!membre) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#bdbdbd', fontSize: '14px' }}>
      Membre introuvable
    </div>
  )

  return (
    <div style={{ maxWidth: '700px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Badge membre</div>
          <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
            {membre.prenom} {membre.nom} — N° {String(membre.numero_membre).padStart(4, '0')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={`/membre/${membre.id}`} style={{
            ...btnStyle,
            background: '#f9f9f9', border: '1px solid #f2f2f2', color: '#828282',
          } as React.CSSProperties}>
            ← Fiche membre
          </Link>
          <button onClick={() => window.print()} style={{
            ...btnStyle, background: '#f9f9f9', border: '1px solid #f2f2f2', color: '#828282',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimer
          </button>
          <button onClick={exporterPDF} disabled={exporting} style={{
            ...btnStyle, background: '#333', color: '#fff',
            opacity: exporting ? 0.6 : 1,
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? 'Export...' : 'Télécharger PDF'}
          </button>
        </div>
      </div>

      {/* Aperçu du badge */}
      <div style={{
        background: '#f9f9f9', borderRadius: '24px',
        padding: '40px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', border: '1px solid #f2f2f2',
      }}>
        {/* Badge réel */}
        <div ref={badgeRef} style={{
          width: '340px', height: '214px',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          background: '#ffffff', display: 'flex',
          flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif',
          border: '1px solid #f2f2f2',
        }}>

          {/* Header badge */}
          <div style={{
            background: '#1a1a2e', padding: '0 14px',
            height: '56px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            position: 'relative',
          }}>
            {/* Logo cercle parfait extrême gauche */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)',
              flexShrink: 0,
            }}>
              <img src="/logo-cjrm.png" alt="Logo CJRM"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* CJRM + sous-titre centré */}
            <div style={{
              position: 'absolute', left: 0, right: 0,
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{
                color: '#ffffff', fontSize: '17px',
                fontWeight: '800', letterSpacing: '2px', lineHeight: '1.15',
              }}>CJRM</div>
              <div style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '5.5px',
                lineHeight: '1.3', whiteSpace: 'nowrap',
              }}>
                Communauté des Jeunes pour la Refondation de Madagascar
              </div>
            </div>

            {/* Statut à droite */}
            <div style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: '6px',
              padding: '3px 8px', color: '#ffffff',
              fontSize: '8px', fontWeight: '700', flexShrink: 0,
            }}>
              {membre.statut.toUpperCase()}
            </div>
          </div>

          {/* Corps */}
          <div style={{
            flex: 1, display: 'flex', padding: '12px 16px',
            gap: '14px', alignItems: 'center',
          }}>
            {/* Photo */}
            <div style={{
              width: '74px', height: '90px', borderRadius: '10px',
              overflow: 'hidden', border: '2px solid #f2f2f2',
              flexShrink: 0, background: '#ecccff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#9b59b6', fontWeight: '700', fontSize: '24px',
            }}>
              {membre.photo_url
                ? <img src={membre.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : membre.prenom[0]
              }
            </div>

            {/* Infos */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f1f1f', lineHeight: '1.2' }}>
                {membre.prenom}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#828282', lineHeight: '1.2', marginBottom: '10px' }}>
                {membre.nom}
              </div>
              {membre.poste && (
                <div style={{
                  fontSize: '9px', fontWeight: '700', color: '#ffffff',
                  background: '#333333', padding: '3px 10px',
                  borderRadius: '20px', marginBottom: '10px',
                  display: 'inline-block',
                }}>
                  {membre.poste}
                </div>
              )}
              <div style={{ fontSize: '8px', color: '#828282', marginBottom: '6px' }}>
                Membre depuis {formaterDate(membre.date_adhesion)}
              </div>
              <div style={{
                display: 'inline-block', fontSize: '7px', fontWeight: '700',
                padding: '2px 8px', borderRadius: '20px',
                background: membre.statut === 'actif' ? '#dfeedb' : '#fee2e2',
                color: membre.statut === 'actif' ? '#89b27c' : '#eb5757',
              }}>
                {membre.statut.toUpperCase()}
              </div>
            </div>

            {/* QR Code */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              {qrImage && (
                <>
                  <img src={qrImage} alt="QR" style={{
                    width: '70px', height: '70px', borderRadius: '8px',
                    border: '1px solid #f2f2f2',
                  }} />
                  <div style={{ fontSize: '6px', color: '#bdbdbd', marginTop: '3px' }}>
                    Scanner pour vérifier
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            background: '#f9f9f9', borderTop: '1px solid #f2f2f2',
            padding: '5px 16px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: '7px', color: '#bdbdbd' }}>
              Membre depuis {formaterDate(membre.date_adhesion)}
            </div>
            <div style={{ fontSize: '7px', color: '#333', fontWeight: '700' }}>
              cjrm.mg
            </div>
          </div>
        </div>
      </div>

      {/* Info format */}
      <div style={{
        background: '#ffffff', borderRadius: '16px',
        border: '1px solid #f2f2f2', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <svg width="16" height="16" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ fontSize: '13px', color: '#828282' }}>
          Format carte bancaire — 86mm × 54mm. Le PDF est prêt à imprimer.
        </span>
      </div>
    </div>
  )
}