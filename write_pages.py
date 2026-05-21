import os

# ── COMMUNITY PAGE ──────────────────────────────────────────
community_page = r"""'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Flame, Clock, Users, Calendar, Plus, Hash } from 'lucide-react'

const communityColors = ['#6366f1','#8b5cf6','#f97316','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']
const getColor = (name: string) => communityColors[name.charCodeAt(0) % communityColors.length]

export default function CommunityPage() {
  const { slug } = useParams()
  const { user, loadFromStorage } = useAuthStore()
  const [community, setCommunity] = useState<any>(null)
  const [posts, setPosts] = useState([])
  const [sort, setSort] = useState<'new' | 'top'>('new')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFromStorage() }, [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [commRes, postsRes] = await Promise.all([
          api.get('/api/communities/' + slug),
          api.get('/api/communities/' + slug + '/posts?sort=' + sort)
        ])
        setCommunity(commRes.data)
        setPosts(postsRes.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (slug) fetchAll()
  }, [slug, sort])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const color = community ? getColor(community.slug) : '#6366f1'

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      {community && (
        <>
          <div style={{ height: '120px', background: 'linear-gradient(135deg, ' + color + '30, ' + color + '10)', borderBottom: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '10%', width: '200px', height: '200px', borderRadius: '50%', background: color + '15' }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '16px', marginTop: '-32px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', flexShrink: 0, background: 'linear-gradient(135deg, ' + color + ', ' + color + '99)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 8px 24px ' + color + '40' }}>
                  <Hash size={28} color="white" />
                </div>
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 2px' }}>v/{community.name}</h1>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>{community.post_count} posts · Created {formatDate(community.created_at)}</p>
                </div>
                {user && (
                  <Link href={'/submit?community=' + slug} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '999px', background: 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)', color: 'white', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px ' + color + '40' }}>
                    <Plus size={16} /> Post
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '8px', display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {[{ key: 'new', label: 'New', icon: '🕐' }, { key: 'top', label: 'Top', icon: '🔥' }].map(tab => (
              <button key={tab.key} onClick={() => setSort(tab.key as any)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer', background: sort === tab.key ? 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)' : 'transparent', color: sort === tab.key ? 'white' : '#6b7280', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '20px', height: '140px', marginBottom: '12px' }} />)
          ) : posts.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>No posts yet</p>
              {user && <Link href={'/submit?community=' + slug} style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', background: 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)', color: 'white', borderRadius: '999px', fontWeight: '700' }}>Create First Post</Link>}
            </div>
          ) : posts.map((post: any) => <PostCard key={post.id} post={post} />)}
        </div>
        {community && (
          <div style={{ width: '300px', flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(99,102,241,0.08)' }}>
              <div style={{ padding: '16px', background: 'linear-gradient(135deg, ' + color + '20, ' + color + '08)', borderBottom: '1px solid ' + color + '20' }}>
                <p style={{ fontWeight: '700', fontSize: '15px', color: '#1e1b4b', margin: '0 0 8px' }}>About v/{community.name}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{community.description || 'Welcome to v/' + community.name + '!'}</p>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} color="#6366f1" /></div>
                  <div><p style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#1e1b4b' }}>{community.post_count}</p><p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Posts</p></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} color="#6366f1" /></div>
                  <div><p style={{ fontSize: '13px', fontWeight: '600', margin: 0, color: '#1e1b4b' }}>{formatDate(community.created_at)}</p><p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Created</p></div>
                </div>
                {user && <Link href={'/submit?community=' + slug} style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', marginTop: '4px' }}>+ Create Post</Link>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
"""

# ── COMMUNITIES LIST ─────────────────────────────────────────
communities_page = r"""'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Hash, Plus, FileText } from 'lucide-react'

const colors = ['#6366f1','#8b5cf6','#f97316','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#3b82f6']
const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

export default function CommunitiesPage() {
  const { user, loadFromStorage } = useAuthStore()
  const [communities, setCommunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => { api.get('/api/communities').then(r => { setCommunities(r.data); setLoading(false) }) }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 6px' }}>Explore Communities</h1>
            <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0 }}>Find your people. Join the conversation.</p>
          </div>
          {user && (
            <Link href="/communities/create" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '999px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              <Plus size={16} /> New Community
            </Link>
          )}
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: '160px', borderRadius: '20px', background: 'rgba(255,255,255,0.4)' }} />)}
          </div>
        ) : communities.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '24px', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌀</div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>No communities yet</p>
            {user && <Link href="/communities/create" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '999px', fontWeight: '700' }}>Create Community</Link>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {communities.map((c: any) => {
              const color = getColor(c.slug)
              return (
                <Link key={c.id} href={'/r/' + c.slug} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', overflow: 'hidden', display: 'block', boxShadow: '0 4px 20px rgba(99,102,241,0.06)', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px ' + color + '25' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.06)' }}
                >
                  <div style={{ height: '6px', background: 'linear-gradient(90deg, ' + color + ', ' + color + '50)' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0, background: 'linear-gradient(135deg, ' + color + ', ' + color + '99)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px ' + color + '40' }}>
                        <Hash size={20} color="white" />
                      </div>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>v/{c.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {c.description || 'A community about ' + c.name + '.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={13} color="#9ca3af" />
                      <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>{c.post_count} posts</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
"""

# ── CREATE COMMUNITY ─────────────────────────────────────────
create_community_page = r"""'use client'
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
"""

# ── SUBMIT POST ──────────────────────────────────────────────
submit_page = r"""'use client'
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
"""

# Write all files
files = {
    'src/app/r/[slug]/page.tsx': community_page,
    'src/app/communities/page.tsx': communities_page,
    'src/app/communities/create/page.tsx': create_community_page,
    'src/app/submit/page.tsx': submit_page,
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Written: {path} ({len(content)} bytes)')

print('\nAll pages written successfully!')