'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif', minHeight: '100vh', background: '#fcfcfc' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '72px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(242,242,242,0.8)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#333333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '800', fontSize: '12px', letterSpacing: '0.5px',
          }}>CJ</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#333', letterSpacing: '-0.5px' }}>CJRM</div>
            <div style={{ fontSize: '9px', color: '#bdbdbd', marginTop: '-2px', fontWeight: '500' }}>Madagascar</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['À propos', 'Missions', 'Membres', 'Contact'].map(item => (
            <span key={item} style={{
              fontSize: '14px', fontWeight: '500', color: '#828282',
              cursor: 'pointer', transition: 'color 0.15s',
            }}>{item}</span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/auth/connexion" style={{
            fontSize: '14px', fontWeight: '600', color: '#333',
            textDecoration: 'none', padding: '8px 16px', borderRadius: '20px',
            border: '1px solid #f2f2f2', background: '#f9f9f9',
          }}>
            Connexion
          </Link>
          <Link href="/admin" style={{
            fontSize: '14px', fontWeight: '600', color: '#ffffff',
            textDecoration: 'none', padding: '8px 20px', borderRadius: '20px',
            background: '#333333',
          }}>
            Administration
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        display: 'flex', alignItems: 'center',
        padding: '0 48px', paddingTop: '72px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(255,161,78,0.08)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(236,204,255,0.06)',
          pointerEvents: 'none',
        }} />

        {/* Contenu hero */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

          {/* Texte */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,161,78,0.15)', borderRadius: '20px',
              padding: '6px 14px', marginBottom: '24px',
              border: '1px solid rgba(255,161,78,0.3)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffa14e' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffa14e' }}>
                Commission officielle — Madagascar
              </span>
            </div>

            <h1 style={{
              fontSize: '52px', fontWeight: '800', color: '#ffffff',
              lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '20px',
            }}>
              Ensemble pour<br />
              <span style={{ color: '#ffa14e' }}>refonder</span><br />
              Madagascar
            </h1>

            <p style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.7', marginBottom: '36px', maxWidth: '420px',
              fontWeight: '400',
            }}>
              La Commission des Jeunes pour la Refondation de Madagascar — un mouvement de jeunes engagés pour bâtir un avenir meilleur.
            </p>

            <div style={{ display: 'flex', gap: '14px' }}>
              <Link href="/admin" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#ffa14e', color: '#ffffff',
                padding: '14px 28px', borderRadius: '14px',
                fontSize: '14px', fontWeight: '700', textDecoration: 'none',
              }}>
                Espace Administration
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/scanner" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.1)', color: '#ffffff',
                padding: '14px 28px', borderRadius: '14px',
                fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/>
                </svg>
                Scanner QR
              </Link>
            </div>
          </div>

          {/* Carte stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Carte principale */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px', padding: '28px',
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', fontWeight: '500' }}>
                Plateforme de gestion CJRM
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { label: 'Gestion membres', desc: 'Ajout, modification, suivi' },
                  { label: 'QR Code unique', desc: 'Généré automatiquement' },
                  { label: 'Badge PDF', desc: 'Imprimable en 1 clic' },
                  { label: 'Scanner intégré', desc: 'Identification rapide' },
                ].map(f => (
                  <div key={f.label} style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '14px', padding: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffa14e', marginBottom: '10px' }} />
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { value: '100%', label: 'Sécurisé', color: '#a6d997' },
                { value: 'Gratuit', label: 'Open source', color: '#ecccff' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '20px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION FONCTIONNALITÉS */}
      <div style={{ padding: '80px 48px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffa14e', letterSpacing: '2px', marginBottom: '12px' }}>
              FONCTIONNALITÉS
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1f1f1f', letterSpacing: '-1px' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: '15px', color: '#828282', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
              Une plateforme complète pour gérer les membres de la CJRM efficacement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              {
                icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
                title: 'Gestion des membres',
                desc: 'Ajoutez, modifiez et suivez tous les membres avec leurs informations complètes.',
                color: '#ecccff',
              },
              {
                icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h4v4h-4z',
                title: 'QR Code automatique',
                desc: 'Chaque membre reçoit un QR code unique généré automatiquement à l\'inscription.',
                color: '#dfeedb',
              },
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',
                title: 'Badge PDF',
                desc: 'Générez et imprimez des badges professionnels au format carte bancaire.',
                color: '#fff3cd',
              },
              {
                icon: 'M23 7l-7 5 7 5V7zM1 5h15v14H1z',
                title: 'Scanner QR',
                desc: 'Identifiez instantanément un membre en scannant son QR code avec la caméra.',
                color: '#fde8e8',
              },
              {
                icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                title: 'Sécurisé',
                desc: 'Données protégées avec Supabase. Accès sécurisé par authentification.',
                color: '#e8f4fd',
              },
              {
                icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
                title: 'Export Excel / CSV',
                desc: 'Exportez la liste des membres en Excel ou CSV en un seul clic.',
                color: '#f0f9f0',
              },
            ].map(f => (
              <div key={f.title} style={{
                background: '#fcfcfc', borderRadius: '20px',
                border: '1px solid #f2f2f2', padding: '28px',
                transition: 'transform 0.2s',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: f.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '18px',
                }}>
                  <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d={f.icon} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1f1f1f', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#828282', lineHeight: '1.6', fontWeight: '400' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{
        background: '#333333', padding: '80px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', letterSpacing: '-1px', marginBottom: '16px' }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: '1.6' }}>
            Connectez-vous à l'espace d'administration pour gérer les membres de la CJRM.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/auth/connexion" style={{
              background: '#ffa14e', color: '#ffffff',
              padding: '14px 32px', borderRadius: '14px',
              fontSize: '14px', fontWeight: '700', textDecoration: 'none',
            }}>
              Se connecter
            </Link>
            <Link href="/scanner" style={{
              background: 'rgba(255,255,255,0.1)', color: '#ffffff',
              padding: '14px 32px', borderRadius: '14px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Scanner un QR
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#1a1a1a', padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>
          © 2026 CJRM — Commission des Jeunes pour la Refondation de Madagascar
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          Tous droits réservés
        </div>
      </div>

    </div>
  )
}