'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import ProtectedRoute from '../components/ProtectedRoute'

const imgTransactions = "https://www.figma.com/api/mcp/asset/f88612b8-0e8f-4854-a679-44d7acc3dc86"
const imgCustomers = "https://www.figma.com/api/mcp/asset/e4b367a8-11fd-4b31-84ec-7a5e02489681"
const imgPayouts = "https://www.figma.com/api/mcp/asset/310b96bd-554e-4231-9743-63e9f2959a21"
const imgBalances = "https://www.figma.com/api/mcp/asset/f9948c1f-d10a-4ed7-a189-4a3c674ee068"
const imgSubscriptions = "https://www.figma.com/api/mcp/asset/1064aee7-a0e8-477b-a048-096fa419c7f1"
const imgReferrals = "https://www.figma.com/api/mcp/asset/fddbdd86-526d-4581-ad01-f53602ede85c"
const imgAuditLogs = "https://www.figma.com/api/mcp/asset/a5e11d4c-defa-4115-b788-b4a91c13514a"
const imgSettings = "https://www.figma.com/api/mcp/asset/bfd3c2d0-1754-4e27-b8e7-45eeb34383dd"

const paymentsMenu = [
  { href: '/admin', label: 'Dashboard', img: imgTransactions, exact: true },
  { href: '/admin/membres', label: 'Membres', img: imgCustomers },
  { href: '/admin/nouveau-membre', label: 'Nouveau membre', img: imgPayouts },
  { href: '/scanner', label: 'Scanner QR', img: imgBalances },
  { href: '/admin/import', label: 'Import / Export', img: imgSubscriptions },
]

const commerceMenu = [
  { href: '/admin/roles', label: 'Rôles', img: imgReferrals },
  { href: '/admin/logs', label: 'Audit logs', img: imgAuditLogs },
  { href: '/admin/parametres', label: 'Paramètres', img: imgSettings },
]

const S: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex', minHeight: '100vh',
    background: '#fcfcfc',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
  },
  sidebar: {
    width: '214px', minHeight: '100vh', background: '#ffffff',
    display: 'flex', flexDirection: 'column', padding: '26px 0 20px',
    position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '32px', fontWeight: '800', color: '#484a4f',
    letterSpacing: '-1.28px', padding: '0 12px 24px 12px',
  },
  sectionLabel: {
    fontSize: '16px', fontWeight: '700', color: '#828282',
    padding: '0 12px 8px 12px', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
  },
  divider: { height: '1px', background: '#f2f2f2', margin: '8px 0' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 12px', fontSize: '14px', fontWeight: '500',
    color: '#828282', textDecoration: 'none', cursor: 'pointer',
  },
  menuItemActive: {
    color: '#333333', fontWeight: '600',
    background: '#f9f9f9', borderRadius: '8px',
  },
  icon: { width: '24px', height: '24px', objectFit: 'contain' as const, opacity: 0.6 },
  iconActive: { opacity: 1 },
  main: {
    marginLeft: '214px', flex: 1,
    display: 'flex', flexDirection: 'column', minHeight: '100vh',
  },
  topbar: {
    height: '94px', background: '#ffffff', borderBottom: '1px solid #f2f2f2',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', position: 'sticky', top: 0, zIndex: 50,
    boxSizing: 'border-box',
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#fcfcfc', border: 'none', borderRadius: '50px',
    padding: '10px 20px', fontSize: '16px', color: '#bdbdbd', width: '260px',
  },
  content: { flex: 1, padding: '32px', background: '#fcfcfc' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const deconnecter = async () => {
    await supabase.auth.signOut()
    router.push('/auth/connexion')
  }

  return (
    <ProtectedRoute>
      <div style={S.root}>

        {/* ── SIDEBAR ── */}
        <aside style={S.sidebar}>

          {/* Logo */}
          <div style={S.logo}>CJRM</div>

          {/* Section Membres */}
          <div>
            <div style={S.sectionLabel}>
              <span>Membres</span>
              <span style={{ fontSize: '12px' }}>▲</span>
            </div>
            {paymentsMenu.map(item => {
              const active = isActive(item.href, item.exact)
              return (
                <Link key={item.href} href={item.href}
                  style={{ ...S.menuItem, ...(active ? S.menuItemActive : {}) }}>
                  <img
                    src={item.img} alt=""
                    style={{ ...S.icon, ...(active ? S.iconActive : {}) }}
                  />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div style={S.divider} />

          {/* Section Gestion */}
          <div>
            <div style={S.sectionLabel}>
              <span>Gestion</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {commerceMenu.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}
                  style={{ ...S.menuItem, ...(active ? S.menuItemActive : {}) }}>
                  <img
                    src={item.img} alt=""
                    style={{ ...S.icon, ...(active ? S.iconActive : {}) }}
                  />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div style={S.divider} />

          {/* Bas sidebar */}
          <div style={{ marginTop: 'auto', padding: '0 0 8px' }}>
            <Link href="/" style={{ ...S.menuItem, fontSize: '13px' }}>
              ← Retour accueil
            </Link>
            <button onClick={deconnecter} style={{
              ...S.menuItem,
              background: 'none', border: 'none', width: '100%',
              textAlign: 'left', fontSize: '13px', color: '#eb5757',
              cursor: 'pointer',
            }}>
              <svg width="16" height="16" fill="none" stroke="#eb5757" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={S.main}>

          {/* Topbar */}
          <header style={S.topbar}>

            {/* Recherche */}
            <div style={S.searchBar}>
              <svg width="18" height="18" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span>Rechercher</span>
            </div>

            {/* Droite */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

              {/* Live badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#828282' }}>
                <div style={{
                  width: '22px', height: '12px', borderRadius: '6px',
                  background: 'rgba(111,207,151,0.2)',
                  display: 'flex', alignItems: 'center', padding: '1px',
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#6fcf97',
                  }} />
                </div>
                Live
              </div>

              {/* Notification */}
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <svg width="22" height="22" fill="none" stroke="#828282" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <div style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#e5a0ff',
                }} />
              </div>

              {/* Profil + Déconnexion */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                border: '1px solid rgba(189,189,189,0.2)',
                borderRadius: '10px', padding: '6px 12px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#6fcf97', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white',
                  fontWeight: '700', fontSize: '14px',
                }}>A</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap' }}>
                    Admin CJRM
                  </div>
                  <div style={{ fontSize: '10px', color: '#bdbdbd' }}>ID: CJRM-001</div>
                </div>
                <button onClick={deconnecter} title="Se déconnecter" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#bdbdbd', padding: '4px', marginLeft: '4px',
                  display: 'flex', alignItems: 'center',
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Contenu de la page */}
          <main style={S.content}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}