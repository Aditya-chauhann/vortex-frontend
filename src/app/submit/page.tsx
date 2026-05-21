'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FileText, Image, Link as LinkIcon, ChevronDown } from 'lucide-react'

function SubmitForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loadFromStorage } = useAuthStore()
  const [communities, setCommunities] = useState<any[]>([])
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text')
  const [form, setForm] = useState({ title: '', content: '', image_url: '', link_url: '', community_slug: searchParams.get('community') || '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => { if (user === null) router.push('/login') }, [user])
  useEffect(() => { api.get('/api/communities').then(r => setCommunities(r.data)) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.community_slug) { toast.error('Select a community'); return }
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const payload: any = { title: form.title, post_type: postType, community_slug: form.community_slug }
      if (postType === 'text') payload.content = form.content
      if (postType === 'image') payload.image_url = form.image_url
      if (postType === 'link') payload.link_url = form.link_url
      const res = await api.post('/api/posts', payload)
      toast.success('Post published!')
      router.push('/r/' + form.community_slug + '/comments/' + res.data.id)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create post')
    } finally { setLoading(false) }
  }

  const inputStyle: any = { width: '100%', padding: '13px 16px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }
  const focusStyle = (e: any) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }
  const blurStyle = (e: any) => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Create a Post</h1>
        <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '16px', marginBottom: '16px', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>COMMUNITY</label>
          <div style={{ position: 'relative' }}>
            <select value={form.community_slug} onChange={e => setForm({ ...form, community_slug: e.target.value })}
              style={{ width: '100%', padding: '12px 40px 12px 16px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: '#1e1b4b', background: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
              <option value="">Choose a community...</option>
              {communities.map((c: any) => <option key={c.id} value={c.slug}>v/{c.name}</option>)}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,102,241,0.1)', padding: '8px 8px 0' }}>
            {[{ key: 'text', label: 'Text', icon: <FileText size={16} /> }, { key: 'image', label: 'Image', icon: <Image size={16} /> }, { key: 'link', label: 'Link', icon: <LinkIcon size={16} /> }].map(t => (
              <button key={t.key} onClick={() => setPostType(t.key as any)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: 'none', cursor: 'pointer', background: postType === t.key ? 'rgba(99,102,241,0.08)' : 'transparent', borderBottom: postType === t.key ? '2px solid #6366f1' : '2px solid transparent', color: postType === t.key ? '#6366f1' : '#9ca3af', fontWeight: '600', fontSize: '14px', borderRadius: '10px 10px 0 0', transition: 'all 0.2s', marginBottom: '-1px' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <input placeholder="An interesting title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={300} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{form.title.length}/300</div>
            </div>
            {postType === 'text' && <textarea placeholder="What's on your mind? (optional)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusStyle} onBlur={blurStyle} />}
            {postType === 'image' && <input placeholder="Paste an image URL..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />}
            {postType === 'link' && <input placeholder="https://..." value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
              <button type="button" onClick={() => router.back()} style={{ padding: '10px 20px', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', color: '#6366f1', background: 'rgba(99,102,241,0.06)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SubmitPage() {
  return <Suspense><SubmitForm /></Suspense>
}
