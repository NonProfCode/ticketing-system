'use client'

import { useState, useEffect } from 'react'

type Ticket = {
  id: number
  title: string
  description: string
  status: string
  created_at: string
}

export default function CustomerPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const res = await fetch('/api/tickets')
    const data = await res.json()
    setTickets(data)
  }

  async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this ticket?')) return

  await fetch(`/api/tickets/${id}`, {
    method: 'DELETE'
  })

  fetchTickets()
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !description) return
    setLoading(true)

    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })

    setTitle('')
    setDescription('')
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    fetchTickets()
  }

  function getStatusColor(status: string) {
    if (status === 'Solved') return { bg: '#dcfce7', color: '#16a34a' }
    if (status === 'In Progress') return { bg: '#fef9c3', color: '#b45309' }
    return { bg: '#fee2e2', color: '#dc2626' }
  }

  return (
    <main style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '4px' }}>Submit a Ticket</h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Describe your issue and we'll get back to you.</p>
      </div>

      {/* Success toast */}
      {submitted && (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontWeight: '500',
          fontSize: '0.9rem'
        }}>
          ✓ Ticket submitted successfully!
        </div>
      )}

      {/* Form */}
      <div style={{
        backgroundColor: 'black',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short description of your issue"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your issue in detail..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px',
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>

      {/* Ticket list */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Your Tickets</h2>

      {tickets.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#9ca3af',
          border: '1px dashed #e5e7eb',
          borderRadius: '12px'
        }}>
          No tickets yet. Submit one above!
        </div>
      )}

      {tickets.map((ticket) => {
        const { bg, color } = getStatusColor(ticket.status)
        return (
          <div
            key={ticket.id}
            style={{
              backgroundColor: 'black',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            {/* Solved banner */}
            {ticket.status === 'Solved' && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '10px',
                fontWeight: '500',
                fontSize: '0.85rem'
              }}>
                ✓ Your issue has been resolved!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{ticket.title}</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>{ticket.description}</p>
              </div>
              <span style={{
                backgroundColor: bg,
                color: color,
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {ticket.status}
              </span>
            </div>

            <p style={{ color: '#d1d5db', fontSize: '0.75rem', marginTop: '10px' }}>
              #{ticket.id} · {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
        )
      })}
    </main>
  )
}