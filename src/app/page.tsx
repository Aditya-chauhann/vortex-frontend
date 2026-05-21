'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Flame, Clock, TrendingUp, Users, Sparkles } from 'lucide-react'

export default function Home() {
  const { user, loadFromStorage } = useAuthStore()
  const [posts, setPosts] = useState([])
  const [communities, setCommunities] = useState<any[]>([])
  const [sort, setSort] = useState<'new' | 'top'>('new')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFromStorage() }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postsRes, commRes] = await Promise.all([
          api.get('/api/posts?sort=' + sort),
          api.get('/api/communities')
        ])
        setPosts(postsRes.data)
        setCommunities(commRes.data.slice(0, 5))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [sort])

  const colors = ['#6366f1','#8b5cf6','#f97316','#06b6d4','#10b981']

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      {!user && (
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', borderBottom: '1px solid rgba(255,255,255,0.4)', padding: '40px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to Vortex
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>Dive into communities. Share ideas. Vote on what matters.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/signup" style={{ padding: '12px 28px', borderRadius: '999px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>Get Started</Link>
            <Link href="/communities" style={{ padding: '12px 28px', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', fontWeight: '700', fontSize: '15px', background: 'rgba(99,102,241,0.06)' }}>Explore</Link>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {user && (
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '12px 16px', display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{user.username[0].toUpperCase()}</span>
              </div>
              <Link href="/submit" style={{ flex: 1 }}>
                <div style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', fontSize: '14px', color: '#9ca3af', cursor: 'text' }}>
                  Share something with the world...
                </div>
              </Link>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '8px', display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {[{ key: 'new', label: 'New', icon: '🕐' }, { key: 'top', label: 'Top', icon: '🔥' }].map(tab => (
              <button key={tab.key} onClick={() => setSort(tab.key as any)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: sort === tab.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: sort === tab.key ? 'white' : '#6b7280', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s',
              }}>{tab.icon} {tab.label}</button>
            ))}
          </div>
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '20px', height: '140px', marginBottom: '12px' }} />
            ))
          ) : posts.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>Nothing here yet</p>
              <p style={{ color: '#9ca3af', marginTop: '8px' }}>Be the first to post something!</p>
              {user && <Link href="/submit" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '999px', fontWeight: '700' }}>Create a Post</Link>}
            </div>
          ) : (
            posts.map((post: any) => <PostCard key={post.id} post={post} />)
          )}
        </div>
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px', marginBottom: '16px', color: 'white', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <TrendingUp size={20} />
              <p style={{ fontWeight: '700', fontSize: '15px', margin: 0 }}>{user ? 'Welcome back, ' + user.username + '!' : 'Home Feed'}</p>
            </div>
            <p style={{ fontSize: '13px', opacity: 0.85, marginBottom: '16px', lineHeight: 1.5 }}>
              {user ? 'Ready to share something today?' : 'Join Vortex to vote, comment and create posts.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user ? (
                <>
                  <Link href="/submit" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)' }}>Create Post</Link>
                  <Link href="/communities/create" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'transparent', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)' }}>Create Community</Link>
                </>
              ) : (
                <>
                  <Link href="/signup" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)' }}>Sign Up</Link>
                  <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'transparent', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)' }}>Log In</Link>
                </>
              )}
            </div>
          </div>
          {communities.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#6366f1" />
                <p style={{ fontWeight: '700', fontSize: '14px', color: '#1e1b4b', margin: 0 }}>Top Communities</p>
              </div>
              {communities.map((c: any, i: number) => (
                <Link key={c.id} href={'/r/' + c.slug} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '13px', color: '#9ca3af', width: '16px' }}>{i + 1}</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>{c.name[0].toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e1b4b', margin: 0 }}>v/{c.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{c.post_count} posts</p>
                  </div>
                </Link>
              ))}
              <div style={{ padding: '8px 16px 12px' }}>
                <Link href="/communities" style={{ display: 'block', textAlign: 'center', padding: '8px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', color: '#6366f1', background: 'rgba(99,102,241,0.08)' }}>View All Communities</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
