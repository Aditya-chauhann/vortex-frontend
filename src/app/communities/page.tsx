'use client'
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
