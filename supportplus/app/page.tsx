import Image from "next/image";

export default function Home() {
  return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>SupportPlus</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
        A simple ticketing system. Submit a support request as a customer, or manage tickets as a handler.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/customer" style={{
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600'
        }}>
          Customer View
        </a>
        <a href="/handler" style={{
          padding: '12px 24px',
          backgroundColor: 'white',
          color: '#2563eb',
          border: '1px solid #2563eb',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600'
        }}>
          Handler View
        </a>
      </div>
    </main>
  )
}
