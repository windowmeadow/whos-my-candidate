import { useState, useEffect } from 'react'

export default function ElectionLookup() {
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [lastQueriedZip, setLastQueriedZip] = useState('')

  async function loadCandidates(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setError(null)

    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a 5-digit ZIP code')
      return
    }
    if (zip === lastQueriedZip) return
    setLastQueriedZip(zip)

    setLoading(true)
    try {
      const res = await fetch(`/api/candidates?zip=${encodeURIComponent(zip)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || body.message || res.statusText)
      }
      const json = await res.json()
      setCandidates(json.candidates || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (/^\d{5}$/.test(zip) && zip !== lastQueriedZip) {
      loadCandidates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip])
  return (
    <section className="card" style={{ marginTop: 20 }}>
      <form onSubmit={loadCandidates} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="ZIP code"
          aria-label="ZIP code"
        />
        <button type="submit" disabled={loading}>{loading ? 'Loading…' : 'Submit/Load Elections'}</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {candidates.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Candidates</h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            {candidates.map(c => (
              <article key={c.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, background: '#fafafa' }}>
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={`Portrait of ${c.name}, candidate for ${c.office}`}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }}
                    loading="lazy"
                  />
                )}
                <h4 style={{ margin: '8px 0 4px' }}>{c.name}</h4>
                <div style={{ fontSize: 14, marginBottom: 4 }}>{c.office}</div>
                {c.party && <div style={{ fontSize: 12, fontWeight: 'bold', color: '#555' }}>{c.party}</div>}
                {c.summary && <p style={{ fontSize: 12, marginTop: 8 }}>{c.summary}</p>}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
