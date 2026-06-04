import Database from 'better-sqlite3'

const db = new Database('./tickets.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    status      TEXT DEFAULT 'Unsolved',
    created_at  TEXT DEFAULT (datetime('now'))
  )
`)

export default db