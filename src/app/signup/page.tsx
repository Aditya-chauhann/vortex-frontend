'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Lock, User, Mail } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/auth/signup', form)
      setAuth(res.data.user, res.data.access_token)
      toast.success('Welcome to Vortex, ' + res.data.user.username + '!')
      router.push('/')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Signup failed. Please try again.'
      setError(msg)
    } finally { setLoading(false) }
  }

  const fields = [
    { key: 'email', placeholder: 'Email address', icon: <Mail size={16} />, type: 'email' },
    { key: 'username', placeholder: 'Username', icon: <User size={16} />, type: 'text' },
    { key: 'password', placeholder: 'Password (min 6 chars)', icon: <Lock size={16} />, type: 'password' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(99,102,241,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.4)' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>v</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 6px' }}>Join Vortex</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Create your account in seconds</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fields.map(field => (
            <div key={field.key} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>{field.icon}</div>
              <input type={field.type} placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required
                style={{ width: '100%', padding: '13px 14px 13px 42px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none' }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ padding: '13px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', marginTop: '4px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
          Already on Vortex? <Link href="/login" style={{ color: '#6366f1', fontWeight: '700' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
