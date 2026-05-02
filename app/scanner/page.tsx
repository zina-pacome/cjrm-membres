'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrowserQRCodeReader } from '@zxing/browser'
import ProtectedRoute from '../components/ProtectedRoute'

export default function Scanner() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [erreur, setErreur] = useState<string>('')
  const [succes, setSucces] = useState<string>('')
  const readerRef = useRef<BrowserQRCodeReader | null>(null)

  const demarrerScanner = async () => {
    setErreur('')
    setSucces('')
    setScanning(true)

    try {
      const reader = new BrowserQRCodeReader()
      readerRef.current = reader

      const devices = await BrowserQRCodeReader.listVideoInputDevices()
      if (devices.length === 0) {
        setErreur('Aucune caméra détectée sur cet appareil.')
        setScanning(false)
        return
      }

      const camera = devices.find(d =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('arrière') ||
        d.label.toLowerCase().includes('rear')
      ) || devices[0]

      await reader.decodeFromVideoDevice(
        camera.deviceId,
        videoRef.current!,
        (result) => {
          if (result) {
            const texte = result.getText()
            arreterScanner()

            if (texte.includes('/membre/')) {
              const id = texte.split('/membre/')[1]
              setSucces('Membre trouvé ! Redirection...')
              setTimeout(() => router.push(`/membre/${id}`), 1000)
            } else {
              setErreur('QR Code non reconnu. Veuillez scanner un badge CJRM valide.')
            }
          }
        }
      )
    } catch (err: unknown) {
      const error = err as Error
      setErreur('Erreur caméra : ' + error.message)
      setScanning(false)
    }
  }

  const arreterScanner = () => {
    BrowserQRCodeReader.releaseAllStreams()
    setScanning(false)
  }

  useEffect(() => {
    return () => { BrowserQRCodeReader.releaseAllStreams() }
  }, [])

  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
      }}>

        {/* Header */}
        <header style={{
          height: '72px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 32px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#ffffff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '800', fontSize: '12px', color: '#333',
            }}>CJ</div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#ffffff' }}>Scanner QR</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Identification membre CJRM</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.1)', color: '#ffffff',
              padding: '8px 16px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              ← Administration
            </Link>
          </div>
        </header>

        {/* Contenu principal */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: '28px',
        }}>

          {/* Titre */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,161,78,0.15)', borderRadius: '20px',
              padding: '6px 14px', marginBottom: '16px',
              border: '1px solid rgba(255,161,78,0.3)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffa14e' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffa14e' }}>
                {scanning ? 'Scan en cours...' : 'Prêt à scanner'}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Scanner un badge CJRM
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              Pointez la caméra vers le QR code du badge membre
            </p>
          </div>

          {/* Fenêtre caméra */}
          <div style={{
            width: '100%', maxWidth: '380px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>

            {/* Zone vidéo */}
            <div style={{
              position: 'relative', width: '100%',
              aspectRatio: '1', background: '#000',
            }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: scanning ? 'block' : 'none',
                }}
              />

              {/* Viseur */}
              {scanning && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                    {/* Coins */}
                    {[
                      { top: 0, left: 0, borderTop: '3px solid #ffa14e', borderLeft: '3px solid #ffa14e', borderRadius: '4px 0 0 0' },
                      { top: 0, right: 0, borderTop: '3px solid #ffa14e', borderRight: '3px solid #ffa14e', borderRadius: '0 4px 0 0' },
                      { bottom: 0, left: 0, borderBottom: '3px solid #ffa14e', borderLeft: '3px solid #ffa14e', borderRadius: '0 0 0 4px' },
                      { bottom: 0, right: 0, borderBottom: '3px solid #ffa14e', borderRight: '3px solid #ffa14e', borderRadius: '0 0 4px 0' },
                    ].map((style, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: '28px', height: '28px', ...style,
                      }} />
                    ))}
                    {/* Ligne scan */}
                    <div style={{
                      position: 'absolute', left: '10px', right: '10px',
                      height: '2px', background: 'rgba(255,161,78,0.7)',
                      top: '50%', borderRadius: '1px',
                      boxShadow: '0 0 8px rgba(255,161,78,0.5)',
                      animation: 'scanLine 1.5s ease-in-out infinite alternate',
                    }} />
                  </div>
                  <style>{`
                    @keyframes scanLine {
                      from { transform: translateY(-80px); }
                      to { transform: translateY(80px); }
                    }
                  `}</style>
                </div>
              )}

              {/* Placeholder */}
              {!scanning && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="36" height="36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="4" height="4" rx="0.5"/>
                      <rect x="19" y="19" width="2" height="2" rx="0.3"/>
                      <rect x="19" y="14" width="2" height="4" rx="0.3"/>
                      <rect x="14" y="19" width="4" height="2" rx="0.3"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                    La caméra s'affichera ici
                  </p>
                </div>
              )}
            </div>

            {/* Bouton dans la carte */}
            <div style={{ padding: '20px' }}>
              {!scanning ? (
                <button onClick={demarrerScanner} style={{
                  width: '100%', background: '#ffa14e', color: '#ffffff',
                  border: 'none', borderRadius: '14px', padding: '14px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Démarrer le scan
                </button>
              ) : (
                <button onClick={arreterScanner} style={{
                  width: '100%', background: 'rgba(235,87,87,0.15)', color: '#eb5757',
                  border: '1px solid rgba(235,87,87,0.3)', borderRadius: '14px', padding: '14px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1"/>
                  </svg>
                  Arrêter le scan
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          {erreur && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(235,87,87,0.15)', border: '1px solid rgba(235,87,87,0.3)',
              borderRadius: '14px', padding: '14px 20px',
              maxWidth: '380px', width: '100%',
            }}>
              <svg width="16" height="16" fill="none" stroke="#eb5757" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#eb5757', fontWeight: '600' }}>{erreur}</span>
            </div>
          )}

          {succes && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(166,217,151,0.15)', border: '1px solid rgba(166,217,151,0.3)',
              borderRadius: '14px', padding: '14px 20px',
              maxWidth: '380px', width: '100%',
            }}>
              <svg width="16" height="16" fill="none" stroke="#a6d997" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#a6d997', fontWeight: '600' }}>{succes}</span>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
            maxWidth: '380px', width: '100%',
          }}>
            {[
              { icon: 'M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8h12v8H3z', text: 'Autorisez la caméra' },
              { icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h4v4h-4z', text: 'Pointez le QR code' },
              { icon: 'M5 12h14M12 5l7 7-7 7', text: 'Redirection auto' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '16px 12px', textAlign: 'center',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,161,78,0.15)', margin: '0 auto 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" fill="none" stroke="#ffa14e" strokeWidth="2" viewBox="0 0 24 24">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500', lineHeight: '1.4' }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}