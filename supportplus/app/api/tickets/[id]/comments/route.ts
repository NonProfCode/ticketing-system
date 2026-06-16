import db from '@/lib/db'

// GET /api/tickets/1/comments — get all comments for a ticket
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const comments = db.prepare(
    'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC'
  ).all(id)

  return Response.json(comments)
}

// POST /api/tickets/1/comments — handler adds a comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { content } = body

  if (!content) {
    return Response.json({ error: 'Content is required' }, { status: 400 })
  }

  const result = db.prepare(
    'INSERT INTO comments (ticket_id, content) VALUES (?, ?)'
  ).run(id, content)

  const comment = db.prepare(
    'SELECT * FROM comments WHERE id = ?'
  ).get(result.lastInsertRowid)

  return Response.json(comment, { status: 201 })
}