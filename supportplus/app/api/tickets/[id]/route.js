import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request, { params }) {
  const { id } = await params

  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id)
  if (!ticket) return Response.json({ error: 'Not found' }, { status: 404 })
  
  return Response.json({ ...ticket, id: Number(ticket.id) })
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const { status } = body

  db.prepare('UPDATE tickets SET status = ? WHERE id = ?').run(status, id)

  const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id)
  return Response.json({ ...updated, id: Number(updated.id) })
}