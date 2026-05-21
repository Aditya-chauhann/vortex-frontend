import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Vortex — Dive into what matters',
  description: 'Vortex is a community platform where ideas flow, votes decide, and conversations thrive.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              color: '#1e1b4b',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.15)',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  )
}