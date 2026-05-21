content = open('src/app/r/[slug]/comments/[id]/page.tsx').read()

old = '''                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6, margin: 0, paddingLeft: '42px' }}>{c.content}</p>
              </div>
            ))
          )}'''

new = '''                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px', paddingLeft: '42px' }}>{c.content}</p>
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
          )}'''

content = content.replace(old, new)

old2 = "  const [voteAnim, setVoteAnim] = useState<string|null>(null)"
new2 = """  const [voteAnim, setVoteAnim] = useState<string|null>(null)

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return
    try {
      await api.delete('/api/comments/' + commentId)
      setComments(prev => prev.filter((c: any) => c.id !== commentId))
      setPost((prev: any) => ({ ...prev, comment_count: Math.max(0, prev.comment_count - 1) }))
      toast.success('Comment deleted')
    } catch { toast.error('Failed to delete comment') }
  }"""

content = content.replace(old2, new2)

with open('src/app/r/[slug]/comments/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done! Size:', len(content))