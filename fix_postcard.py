content = r"""'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { ArrowUp, ArrowDown, MessageSquare, ExternalLink, Clock, Trash2 } from 'lucide-react'

const communityColors = ['#6366f1','#8b5cf6','#f97316','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']
const getColor = (name: string) => communityColors[name.charCodeAt(0) % communityColors.length]

interface Post {
  id: number; title: string; content: string | null; image_url: string | null
  link_url: string | null; post_type: string; vote_count: number
  comment_count: number; author_username: string; community_name: string
  community_slug: string; created_at: string; user_vote: string | null
}

export default function PostCard({ post: initialPost }: { post: Post }) {
  const { user } = useAuthStore()
  const [post, setPost] = useState(initialPost)
  const [voteAnim, setVoteAnim] = useState<'up'|'down'|null>(null)
  const [deleted, setDeleted] = useState(false)

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) { toast.error('Sign in to vote'); return }
    setVoteAnim(voteType)
    setTimeout(() => setVoteAnim(null), 300)
    try {
      const res = await api.post('/api/votes', { post_id: post.id, vote_type: voteType })
      setPost(prev => ({ ...prev, vote_count: res.data.vote_count, user_vote: res.data.vote_type }))
    } catch { toast.error('Failed to vote') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      await api.delete('/api/posts/' + post.id)
      setDeleted(true)
      toast.success('Post deleted')
    } catch { toast.error('Failed to delete post') }
  }

  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60) return s + 's ago'
    if (s < 3600) return Math.floor(s/60) + 'm ago'
    if (s < 86400) return Math.floor(s/3600) + 'h ago'
    return Math.floor(s/86400) + 'd ago'
  }

  const color = getColor(post.community_slug)
  if (deleted) return null

  return (
    <div style={{
      background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: '20px', marginBottom: '12px', overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(99,102,241,0.06)', transition: 'all 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.82)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.65)' }}
    >
      <div style={{ height: '3px', background: 'linear-gradient(90deg, ' + color + ', transparent)' }} />
      <div style={{ display: 'flex', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginRight: '16px', minWidth: '36px' }}>
          <button onClick={() => handleVote('up')} style={{ background: post.user_vote === 'up' ? 'rgba(249,115,22,0.12)' : 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: post.user_vote === 'up' ? '#f97316' : '#9ca3af', transform: voteAnim === 'up' ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.15s ease' }}><ArrowUp size={18} /></button>
          <span style={{ fontSize: '13px', fontWeight: '700', minWidth: '24px', textAlign: 'center', color: post.user_vote === 'up' ? '#f97316' : post.user_vote === 'down' ? '#6366f1' : '#374151' }}>{post.vote_count}</span>
          <button onClick={() => handleVote('down')} style={{ background: post.user_vote === 'down' ? 'rgba(99,102,241,0.12)' : 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: post.user_vote === 'down' ? '#6366f1' : '#9ca3af', transform: voteAnim === 'down' ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.15s ease' }}><ArrowDown size={18} /></button>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <Link href={'/r/' + post.community_slug} onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', background: color + '15', border: '1px solid ' + color + '30', fontSize: '12px', fontWeight: '600', color }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color, opacity: 0.8 }} />
              v/{post.community_name}
            </Link>
            <span style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} /> {timeAgo(post.created_at)} · u/{post.author_username}
            </span>
          </div>
          <Link href={'/r/' + post.community_slug + '/comments/' + post.id}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e1b4b', margin: '0 0 8px', lineHeight: '1.4', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.color = '#1e1b4b'}
            >{post.title}</h3>
          </Link>
          {post.post_type === 'text' && post.content && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 10px', lineHeight: '1.6', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any }}>{post.content}</p>
          )}
          {post.post_type === 'image' && post.image_url && (
            <img src={post.image_url} alt={post.title} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }} />
          )}
          {post.post_type === 'link' && post.link_url && (
            <a href={post.link_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontSize: '12px', fontWeight: '500', marginBottom: '10px' }}>
              <ExternalLink size={12} /> {post.link_url}
            </a>
          )}
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px', alignItems: 'center' }}>
            <Link href={'/r/' + post.community_slug + '/comments/' + post.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#9ca3af', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' }}
            ><MessageSquare size={15} /> {post.comment_count} Comments</Link>

            {user && user.username === post.author_username && (
              <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' }}
              ><Trash2 size={15} /> Delete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
"""

with open('src/components/PostCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done! Size:', len(content))