'use client'

import { useState, useEffect } from 'react'

type Ticket = {
  id: number
  title: string
  description: string
  status: string
  created_at: string
}

type Comment = {
  id: number
  ticket_id: number
  content: string
  created_at: string
}

export default function HandlerPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [commentInput, setCommentInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const res = await fetch('/api/tickets')
    const data = await res.json()
    setTickets(data)
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchTickets()
  }

  async function fetchComments(ticketId: number) {
    const res = await fetch(`/api/tickets/${ticketId}/comments`)
    const data = await res.json()
    setComments((prev) => ({ ...prev, [ticketId]: data }))
  }

  async function handleExpand(ticketId: number) {
    if (expandedId === ticketId) {
      setExpandedId(null)
      setCommentInput('')
      return
    }
    setExpandedId(ticketId)
    setCommentInput('')
    fetchComments(ticketId)
  }

  async function handleAddComment(ticketId: number) {
    if (!commentInput.trim()) return
    setSubmitting(true)

    await fetch(`/api/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentInput })
    })

    setCommentInput('')
    setSubmitting(false)
    fetchComments(ticketId)
  }

  function getStatusColor(status: string) {
    if (status === 'Solved') return { bg: '#dcfce7', color: '#16a34a' }
    if (status === 'In Progress') return { bg: '#fef9c3', color: '#b45309' }
    return { bg: '#fee2e2', color: '#dc2626' }
  }

  const filters = ['All', 'Unsolved', 'In Progress', 'Solved']

  const filteredTickets = filter === 'All'
    ? tickets
    : tickets.filter((t) => t.status === filter)

  const counts = {
    total: tickets.length,
    unsolved: tickets.filter(t => t.status === 'Unsolved').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    solved: tickets.filter(t => t.status === 'Solved').length,
  }

  async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this ticket?')) return

  await fetch(`/api/tickets/${id}`, {
    method: 'DELETE'
  })

  fetchTickets()
}

  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '4px' }}>Handler Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Manage and update support tickets.</p>
      </div>

      {/* Summary cards — your original */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total', value: counts.total, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Unsolved', value: counts.unsolved, color: '#dc2626', bg: '#fee2e2' },
          { label: 'In Progress', value: counts.inProgress, color: '#b45309', bg: '#fef9c3' },
          { label: 'Solved', value: counts.solved, color: '#16a34a', bg: '#dcfce7' },
        ].map((card) => (
          <div key={card.label} style={{
            backgroundColor: card.bg,
            borderRadius: '10px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.6rem', fontWeight: '700', color: card.color }}>{card.value}</p>
            <p style={{ fontSize: '0.8rem', color: card.color, fontWeight: '500' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filter buttons — your original */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              fontWeight: filter === f ? '600' : '400',
              backgroundColor: filter === f ? '#2563eb' : 'white',
              color: filter === f ? 'white' : '#374151',
              fontSize: '0.875rem',
              transition: 'all 0.15s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state — your original */}
      {filteredTickets.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#9ca3af',
          border: '1px dashed #e5e7eb',
          borderRadius: '12px',
          backgroundColor: 'black'
        }}>
          No tickets found.
        </div>
      )}

      {/* Ticket list */}
      {filteredTickets.map((ticket) => {
        const { bg, color } = getStatusColor(ticket.status)
        const isExpanded = expandedId === ticket.id
        const ticketComments = comments[ticket.id] || []

        return (
          <div
            key={ticket.id}
            style={{
              backgroundColor: 'black',
              border: `1px solid ${isExpanded ? '#2563eb' : '#e5e7eb'}`,
              borderRadius: '12px',
              marginBottom: '1rem',
              overflow: 'hidden'
            }}
          >
            {/* Your original ticket card layout — click to expand */}
            <div
              onClick={() => handleExpand(ticket.id)}
              style={{
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: 'pointer'
              }}
            >
              {/* Ticket info — your original */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600' }}>{ticket.title}</p>
                  <span style={{
                    backgroundColor: bg,
                    color: color,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '600'
                  }}>
                    {ticket.status}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '8px' }}>
                  {ticket.description}
                </p>
                <p style={{ color: '#d1d5db', fontSize: '0.75rem' }}>
                  #{ticket.id} · {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>

              {/* Status dropdown — your original, with e.stopPropagation so clicking it doesn't expand */}
              <div style={{ flexShrink: 0 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                  UPDATE STATUS
                </label>
                <select
                  value={ticket.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(ticket.id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    backgroundColor: 'black',
                    outline: 'none'
                  }}
                >
                  <option value="Unsolved">Unsolved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Solved">Solved</option>
                </select>
                {/* Expand hint */}
                <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '6px', textAlign: 'right' }}>
                  {isExpanded ? '▲ collapse' : '▼ comments'}
                </p>
              </div>
            </div>

            {/* Comments section — only shows when expanded */}
            {isExpanded && (
              <div style={{
                borderTop: '1px solid #222',
                padding: '1.25rem',
                backgroundColor: '#111'
              }}>
                <p style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '1rem', color: '#9ca3af' }}>
                  COMMENTS {ticketComments.length > 0 && `(${ticketComments.length})`}
                </p>

                {/* Empty comments */}
                {ticketComments.length === 0 && (
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    No comments yet.
                  </p>
                )}

                {/* Comment thread */}
                {ticketComments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      backgroundColor: 'black',
                      border: '1px solid #222',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '8px'
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', color: '#e5e7eb', marginBottom: '4px' }}>
                      {comment.content}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Handler · {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}

                {/* Add comment */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ticket.id)}
                    placeholder="Write a comment..."
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'black',
                      color: 'white'
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(ticket.id)}
                    disabled={submitting}
                    style={{
                      padding: '9px 18px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    {submitting ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </main>
  )
}