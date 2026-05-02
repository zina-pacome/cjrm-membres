'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [verifie, setVerifie] = useState(false)
  const [nonAutorise, setNonAutorise] = useState(false)

  useEffect(() => {
    const verifier = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setNonAutorise(true)
        // Redirection douce sans useRouter
        window.location.href = '/auth/connexion'
      } else {
        setVerifie(true)
      }
    }
    verifier()
  }, [])

  if (nonAutorise) return null

  if (!verifie) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#fcfcfc', gap: '16px',
      fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '3px solid #f2f2f2', borderTop: '3px solid #333',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: '13px', color: '#bdbdbd', fontWeight: '500' }}>Vérification...</span>
    </div>
  )

  return <>{children}</>
}