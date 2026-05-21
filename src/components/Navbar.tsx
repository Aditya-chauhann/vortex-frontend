'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Search, Plus, LogOut, User, Compass, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout, loadFromStorage } = useAuthStore()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); setMenuOpen(false); router.push('/') }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.5)',
      boxShadow: scrolled ? '0 4px 24px rgba(99,102,241,0.1)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', height: '60px',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>v</span>
          </div>
          <span style={{ fontWeight: '800', fontSize: '20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Vortex
          </span>
        </Link>

        <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input placeholder="Search communities, posts..."
            style={{
              width: '100%', padding: '10px 14px 10px 40px',
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: '999px',
              fontSize: '14px', color: '#1e1b4b', outline: 'none', transition: 'all 0.2s',
            }}
            onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.95)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
            onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.7)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        <Link href="/communities" style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
          borderRadius: '999px', fontSize: '14px', fontWeight: '500', color: '#6b7280', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
        >
          <Compass size={16} /> Explore
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          {user ? (
            <>
              <Link href="/submit" style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                borderRadius: '999px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontSize: '14px', fontWeight: '700',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.35)' }}
              >
                <Plus size={16} /> Create
              </Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px 6px 6px',
                  borderRadius: '999px', background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #f97316)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e1b4b' }}>{user.username}</span>
                  <ChevronDown size={14} color="#9ca3af" />
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.6)', borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.15)', minWidth: '180px', zIndex: 200,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e1b4b', margin: 0 }}>{user.username}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{user.email}</p>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <Link href={`/user/${user.username}`} onClick={() => setMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        borderRadius: '10px', fontSize: '14px', color: '#1e1b4b',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={16} color="#6366f1" /> Profile
                      </Link>
                      <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        borderRadius: '10px', width: '100%', fontSize: '14px', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                padding: '8px 18px', borderRadius: '999px',
                border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1',
                fontSize: '14px', fontWeight: '600', background: 'rgba(99,102,241,0.06)', transition: 'all 0.2s',
              }}>Log In</Link>
              <Link href="/signup" style={{
                padding: '8px 18px', borderRadius: '999px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontSize: '14px', fontWeight: '700',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.2s',
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
