'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { ArrowUp, ArrowDown, MessageSquare, Clock, ArrowLeft, Send, ExternalLink } from 'lucide-react'

const communityColors = ['#6366f1','#8b5cf6','#f97316','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']
const getColor = (name: string) => communityColors[name.charCodeAt(0) % communityColors.length]

export default function PostDetailPage() {
  const { slug, id } = useParams()
  const router = useRouter()
  const { user, loadFromStorage } = useAuthStore()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [voteAnim, setVoteAnim] = useState<string|null>(null)

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return
    try {
      await api.delete('/api/comments/' + commentId)
      setComments(prev => prev.filter((c: any) => c.id !== commentId))
      setPost((prev: any) => ({ ...prev, comment_count: Math.max(0, prev.comment_count - 1) }))
      toast.success('Comment deleted')
    } catch { toast.error('Failed to delete comment') }
  }

  useEffect(() => { loadFromStorage() }, [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get('/api/posts/' + id),
          api.get('/api/comments/post/' + id)
        ])
        setPost(postRes.data)
        setComments(commentsRes.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (id) fetchAll()
  }, [id])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) { toast.error('Sign in to vote'); return }
    setVoteAnim(voteType)
    setTimeout(() => setVoteAnim(null), 300)
    try {
      const res = await api.post('/api/votes', { post_id: Number(id), vote_type: voteType })
      setPost((prev: any) => ({ ...prev, vote_count: res.data.vote_count, user_vote: res.data.vote_type }))
    } catch { toast.error('Failed to vote') }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { toast.error('Sign in to comment'); return }
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post('/api/comments', { content: comment, post_id: Number(id) })
      setComments(prev => [...prev, res.data])
      setPost((prev: any) => ({ ...prev, comment_count: prev.comment_count + 1 }))
      setComment('')
      toast.success('Comment posted!')
    } catch { toast.error('Failed to post comment') }
    finally { setSubmitting(false) }
  }

  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60) return s + 's ago'
    if (s < 3600) return Math.floor(s/60) + 'm ago'
    if (s < 86400) return Math.floor(s/3600) + 'h ago'
    return Math.floor(s/86400) + 'd ago'
  }

  const color = post ? getColor(post.community_slug) : '#6366f1'

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '20px', height: i === 0 ? '300px' : '100px', marginBottom: '16px' }} />
        ))}
      </div>
    </div>
  )

  if (!post) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontSize: '24px', color: '#374151' }}>Post not found</p>
        <Link href="/" style={{ color: '#6366f1', fontWeight: '700' }}>Go home</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        <button onClick={() => router.back()} style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px',
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px',
          padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
          fontWeight: '600', color: '#6b7280', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#6366f1' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#6b7280' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: '24px', overflow: 'hidden', marginBottom: '16px',
          boxShadow: '0 8px 40px rgba(99,102,241,0.1)',
        }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg, ' + color + ', ' + color + '50)' }} />
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Link href={'/r/' + post.community_slug} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
                borderRadius: '999px', background: color + '15', border: '1px solid ' + color + '30',
                fontSize: '13px', fontWeight: '700', color,
              }}>v/{post.community_name}</Link>
              <span style={{ fontSize: '13px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {timeAgo(post.created_at)} Â· Posted by u/{post.author_username}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 16px', lineHeight: 1.4 }}>
              {post.title}
            </h1>
            {post.post_type === 'text' && post.content && (
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.7, margin: '0 0 20px' }}>{post.content}</p>
            )}
            {post.post_type === 'image' && post.image_url && (
              <img src={post.image_url} alt={post.title} style={{ width: '100%', borderRadius: '16px', marginBottom: '20px', maxHeight: '600px', objectFit: 'cover' }} />
            )}
            {post.post_type === 'link' && post.link_url && (
              <a href={post.link_url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                borderRadius: '12px', background: 'rgba(99,102,241,0.08)', color: '#6366f1',
                fontSize: '14px', fontWeight: '600', marginBottom: '20px',
              }}><ExternalLink size={14} /> {post.link_url}</a>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.06)', borderRadius: '999px', padding: '4px' }}>
                <button onClick={() => handleVote('up')} style={{
                  background: post.user_vote === 'up' ? 'rgba(249,115,22,0.15)' : 'transparent',
                  border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: '999px',
                  color: post.user_vote === 'up' ? '#f97316' : '#9ca3af',
                  transform: voteAnim === 'up' ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.15s',
                }}><ArrowUp size={18} /></button>
                <span style={{ fontSize: '15px', fontWeight: '800', minWidth: '32px', textAlign: 'center', color: post.user_vote === 'up' ? '#f97316' : post.user_vote === 'down' ? '#6366f1' : '#1e1b4b' }}>
                  {post.vote_count}
                </span>
                <button onClick={() => handleVote('down')} style={{
                  background: post.user_vote === 'down' ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: '999px',
                  color: post.user_vote === 'down' ? '#6366f1' : '#9ca3af',
                  transform: voteAnim === 'down' ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.15s',
                }}><ArrowDown size={18} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                <MessageSquare size={16} /> {post.comment_count} comments
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: '20px', padding: '20px', marginBottom: '16px',
          boxShadow: '0 4px 24px rgba(99,102,241,0.06)',
        }}>
          {user ? (
            <form onSubmit={handleComment}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '10px' }}>
                Comment as <span style={{ color: '#6366f1' }}>u/{user.username}</span>
              </p>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts..." rows={4}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(99,102,241,0.2)', fontSize: '14px', background: 'rgba(255,255,255,0.6)', color: '#1e1b4b', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" disabled={submitting || !comment.trim()} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                  background: submitting || !comment.trim() ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px',
                  cursor: submitting || !comment.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                }}><Send size={15} /> {submitting ? 'Posting...' : 'Post Comment'}</button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '14px' }}>Sign in to join the conversation</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Link href="/login" style={{ padding: '8px 20px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px', color: '#6366f1', fontWeight: '600', fontSize: '14px', background: 'rgba(99,102,241,0.06)' }}>Sign In</Link>
                <Link href="/signup" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '999px', color: 'white', fontWeight: '600', fontSize: '14px' }}>Sign Up</Link>
              </div>
            </div>
          )}
        </div>

        <div>
          {comments.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
              <MessageSquare size={32} color="#9ca3af" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: '#9ca3af', fontSize: '15px' }}>No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((c: any) => (
              <div key={c.id} style={{
                background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)',
                borderRadius: '18px', padding: '18px', marginBottom: '10px',
                boxShadow: '0 2px 12px rgba(99,102,241,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{c.author_username?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>u/{c.author_username}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '8px' }}>{timeAgo(c.created_at)}</span>
                  </div>
                </div>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px', paddingLeft: '42px' }}>{c.content}</p>
                {user && user.username === c.author_username && (
                  <div style={{ paddingLeft: '42px' }}>
                    <button onClick={() => handleDeleteComment(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' }}
                    >🗑 Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
