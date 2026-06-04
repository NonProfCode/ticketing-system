import { NextResponse } from 'next/server'
import db from '@/lib/db'

export function GET() {
  const tickets = db.prepare('SELECT * FROM tickets ORDER BY created_at DESC').all()
  return NextResponse.json(tickets)
}

export async function POST(request) {
  const body = await request.json()
  const { title, description } = body

  const result = db.prepare(
    'INSERT INTO tickets (title, description) VALUES (?, ?)'
  ).run(title, description)

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}