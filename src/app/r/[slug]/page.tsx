'use client'
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
