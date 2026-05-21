'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.append('username', form.username)
      params.append('password', form.password)
      const res = await api.post('/api/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      setAuth(res.data.user, res.data.access_token)
      router.push('/')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Invalid username or password'
      setError(msg)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(99,102,241,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.4)' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>v</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 6px' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Sign in to your Vortex account</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><User size={16} /></div>
            <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required
              style={{ width: '100%', padding: '13px 14px 13px 42px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><Lock size={16} /></div>
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              style={{ width: '100%', padding: '13px 14px 13px 42px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '13px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', marginTop: '4px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
          New to Vortex? <Link href="/signup" style={{ color: '#6366f1', fontWeight: '700' }}>Create account</Link>
        </p>
      </div>
    </div>
  )
}
