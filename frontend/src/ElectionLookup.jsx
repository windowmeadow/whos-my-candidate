import { useState, useEffect } from 'react'

export default function ElectionLookup() {
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [elections, setElections] = useState([])
  const [selectedElection, setSelectedElection] = useState(null)
  const [voterInfo, setVoterInfo] = useState(null)
  const [lastQueriedZip, setLastQueriedZip] = useState('')

  async function loadElections(e) {
    // allow calling without an event (useEffect) or from a submit
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setError(null)
    // clear previous voter info while loading
    setVoterInfo(null)

    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a 5-digit ZIP code')
      return
    }

    // avoid re-querying same zip repeatedly
    if (zip === lastQueriedZip) return
    setLastQueriedZip(zip)

    setLoading(true)
    try {
      const res = await fetch(`/api/elections?zip=${encodeURIComponent(zip)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || body.message || res.statusText)
      }
      const json = await res.json()
      setElections(json.elections?.elections || [])
      setVoterInfo(json.voterinfo || null)
      setSelectedElection(json.voterinfo?.election?.id || (json.elections?.elections?.[0]?.id ?? null))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadForElection(electionId) {
    if (!electionId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/elections?zip=${encodeURIComponent(zip)}&electionId=${encodeURIComponent(electionId)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || body.message || res.statusText)
      }
      const json = await res.json()
      setVoterInfo(json.voterinfo || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="card" style={{ marginTop: 20 }}>
      <h2>Election participants by ZIP</h2>
      <form onSubmit={loadElections} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="ZIP code"
          aria-label="ZIP code"
        />
        <button type="submit" disabled={loading}>{loading ? 'Loading…' : 'Load elections'}</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {elections.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <label htmlFor="election-select">Select election:</label>
          <select id="election-select" value={selectedElection || ''} onChange={(ev) => { setSelectedElection(ev.target.value); loadForElection(ev.target.value) }}>
            {elections.map((el) => (
              <option key={el.id} value={el.id}>{el.name} — {el.electionDay}</option>
            ))}
          </select>
        </div>
      )}

      {voterInfo && (
        <div style={{ marginTop: 12 }}>
          <h3>Voter information</h3>

          {/* Election meta */}
          {voterInfo.election && (
            <div style={{ marginBottom: 8 }}>
              <strong>Election:</strong> {voterInfo.election.name} — {voterInfo.election.electionDay}
            </div>
          )}

          {/* Normalized input (what Google parsed) */}
          {voterInfo.normalizedInput && (
            <div style={{ marginBottom: 8 }}>
              <strong>Address parsed:</strong> {[
                voterInfo.normalizedInput.line1,
                voterInfo.normalizedInput.city,
                voterInfo.normalizedInput.state,
                voterInfo.normalizedInput.zip,
              ].filter(Boolean).join(', ')}
            </div>
          )}

          {/* State-level administration body info and helpful URLs */}
          {Array.isArray(voterInfo.state) && voterInfo.state.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <h4>State election info</h4>
              {voterInfo.state.map((s, si) => {
                const body = s.electionAdministrationBody || {}
                return (
                  <div key={si} style={{ marginBottom: 10 }}>
                    <strong>{s.name}</strong>
                    <div style={{ marginTop: 4 }}>
                      {body.electionInfoUrl && <div><a href={body.electionInfoUrl} target="_blank" rel="noreferrer">Election info</a></div>}
                      {body.electionRegistrationUrl && <div><a href={body.electionRegistrationUrl} target="_blank" rel="noreferrer">Register to vote</a></div>}
                      {body.electionRegistrationConfirmationUrl && <div><a href={body.electionRegistrationConfirmationUrl} target="_blank" rel="noreferrer">Registration confirmation</a></div>}
                      {body.absenteeVotingInfoUrl && <div><a href={body.absenteeVotingInfoUrl} target="_blank" rel="noreferrer">Absentee / Mail-in voting</a></div>}
                      {body.votingLocationFinderUrl && <div><a href={body.votingLocationFinderUrl} target="_blank" rel="noreferrer">Find voting locations</a></div>}
                      {body.ballotInfoUrl && <div><a href={body.ballotInfoUrl} target="_blank" rel="noreferrer">Ballot information</a></div>}
                      {body.electionRulesUrl && <div><a href={body.electionRulesUrl} target="_blank" rel="noreferrer">Election rules</a></div>}
                      {body.correspondenceAddress && (
                        <div style={{ marginTop: 6 }}>
                          <em>Election office address:</em>
                          <div>{[body.correspondenceAddress.line1, body.correspondenceAddress.city, body.correspondenceAddress.state, body.correspondenceAddress.zip].filter(Boolean).join(', ')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Participants / Contests (existing display) */}
          <div style={{ marginTop: 12 }}>
            <h4>Participants / Contests</h4>
            {Array.isArray(voterInfo.contests) && voterInfo.contests.length > 0 ? (
              voterInfo.contests.map((contest, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <strong>{contest.office}</strong>
                  {Array.isArray(contest.candidates) ? (
                    <ul>
                      {contest.candidates.map((c, i) => (
                        <li key={i}>{c.name}{c.party ? ` (${c.party})` : ''}</li>
                      ))}
                    </ul>
                  ) : <p>No candidates listed</p>}
                </div>
              ))
            ) : (
              <p>No contests/candidates found for this election and address.</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
