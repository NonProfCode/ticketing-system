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

  // Fetch all tickets when page loads
  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const res = await fetch('/api/tickets')
    const data = await res.json()
    setTickets(data)
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

    // Clear the form
    setTitle('')
    setDescription('')
    setLoading(false)

    // Refresh the ticket list
    fetchTickets()
  }

  function getStatusColor(status: string) {
    if (status === 'Solved') return '#16a34a'
    if (status === 'In Progress') return '#d97706'
    return '#dc2626'
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Submit a Ticket
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short description of your issue"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your issue in detail"
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>

      {/* Ticket List */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Tickets</h2>

      {tickets.length === 0 && (
        <p style={{ color: '#888' }}>No tickets yet. Submit one above!</p>
      )}

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}
        >
          {/* Solved banner */}
          {ticket.status === 'Solved' && (
            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px', fontWeight: '500' }}>
              ✓ Your issue has been resolved!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>{ticket.title}</p>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>{ticket.description}</p>
            </div>

            {/* Status badge */}
            <span style={{
              backgroundColor: getStatusColor(ticket.status),
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              {ticket.status}
            </span>
          </div>

          <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '8px' }}>
            {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  )
}