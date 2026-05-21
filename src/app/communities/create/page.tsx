'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { Hash, Sparkles } from 'lucide-react'

export default function CreateCommunityPage() {
  const router = useRouter()
  const { user, loadFromStorage } = useAuthStore()
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => { if (user === null) router.push('/login') }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/communities', form)
      toast.success('v/' + res.data.name + ' launched!')
      router.push('/r/' + res.data.slug)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create community')
    } finally { setLoading(false) }
  }

  const inputStyle: any = { width: '100%', padding: '13px 16px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            <Sparkles size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 8px' }}>Create a Community</h1>
          <p style={{ fontSize: '15px', color: '#9ca3af' }}>Build your own space on Vortex</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 40px rgba(99,102,241,0.1)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px', letterSpacing: '0.05em' }}>COMMUNITY NAME</label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} color="#6366f1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="community_name" maxLength={21} required
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <p style={{ fontSize: '12px', color: form.name.length > 18 ? '#ef4444' : '#9ca3af', margin: '4px 0 0', textAlign: 'right' }}>{21 - form.name.length} characters remaining</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px', letterSpacing: '0.05em' }}>DESCRIPTION <span style={{ fontWeight: '400', color: '#9ca3af' }}>(optional)</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this community about?" rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            {form.name && (
              <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px' }}>Preview</p>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#6366f1', margin: 0 }}>v/{form.name.toLowerCase()}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '12px', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', color: '#6366f1', background: 'rgba(99,102,241,0.06)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                {loading ? 'Launching...' : '🚀 Launch Community'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
