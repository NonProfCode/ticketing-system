'use client'

import { useState, useEffect } from 'react'

type Ticket = {
  id: number
  title: string
  description: string
  status: string
  created_at: string
}

export default function HandlerPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filter, setFilter] = useState('All')

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

    // Refresh the list after update
    fetchTickets()
  }

  function getStatusColor(status: string) {
    if (status === 'Solved') return '#16a34a'
    if (status === 'In Progress') return '#d97706'
    return '#dc2626'
  }

  // Filter tickets based on selected filter
  const filteredTickets = filter === 'All'
    ? tickets
    : tickets.filter((t) => t.status === filter)

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Handler Dashboard
      </h1>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {['All', 'Unsolved', 'In Progress', 'Solved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              fontWeight: filter === f ? '600' : '400',
              backgroundColor: filter === f ? '#2563eb' : 'white',
              color: filter === f ? 'white' : '#333',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredTickets.length === 0 && (
        <p style={{ color: '#888' }}>No tickets found.</p>
      )}

      {/* Ticket list */}
      {filteredTickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          {/* Ticket info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <p style={{ fontWeight: '600' }}>{ticket.title}</p>
              <span style={{
                backgroundColor: getStatusColor(ticket.status),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {ticket.status}
              </span>
            </div>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '6px' }}>{ticket.description}</p>
            <p style={{ color: '#aaa', fontSize: '0.75rem' }}>
              #{ticket.id} · {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>

          {/* Status dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>
              Update status
            </label>
            <select
              value={ticket.status}
              onChange={(e) => updateStatus(ticket.id, e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <option value="Unsolved">Unsolved</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>
        </div>
      ))}
    </main>
  )
}