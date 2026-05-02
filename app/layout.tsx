import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'CJRM — Gestion des membres',
  description: 'Commission des Jeunes pour la Refondation de Madagascar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body style={{ fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif', margin: 0, background: '#fcfcfc' }}>
        {children}
      </body>
    </html>
  )
}