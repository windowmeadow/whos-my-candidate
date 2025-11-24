import { useState, useEffect } from 'react'

export default function ElectionLookup() {
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [elections, setElections] = useState([])
  const [selectedElection, setSelectedElection] = useState(null)
  const [voterInfo, setVoterInfo] = useState(null)
  const [voterInfoByElection, setVoterInfoByElection] = useState({})
  const [lastQueriedZip, setLastQueriedZip] = useState('')

  const MAX_ELECTIONS = 8

  async function loadElections(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setError(null)
    setVoterInfo(null)
    setVoterInfoByElection({})

    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a 5-digit ZIP code')
      return
    }

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
      const found = json.elections?.elections || []

      // Base set
      setElections(found)
      setVoterInfo(json.voterinfo || null)
      setSelectedElection(json.voterinfo?.election?.id || (found?.[0]?.id ?? null))

      // Prepare election ids to fetch voterinfo for (limit for quota)
      let ids = found.slice(0, MAX_ELECTIONS).map((el) => el.id)

      // If this is the special ZIP, inject a synthetic election with hardcoded contacts
      if (zip === '10026') {
        const syntheticId = 'hardcoded-10026'
        const syntheticElection = { id: syntheticId, name: 'Local contacts (hardcoded)', electionDay: '' }

        // append synthetic election to the elections list if not present
        setElections((prev) => (prev.some((p) => p.id === syntheticId) ? prev : [...prev, syntheticElection]))

        const hardcodedVoterInfo = {
          contests: [
            { office: 'New York City Mayor', candidates: [{ name: 'Zohran Mamdani' }] },
            { office: 'New York County District Attorney', candidates: [{ name: 'Alvin Bragg' }] },
            { office: 'Manhattan Borough President', candidates: [{ name: 'Mark Levine' }] },
            { office: 'New York City Council - District 7', candidates: [{ name: 'Shaun Abreu' }] },
            { office: 'New York City Comptroller', candidates: [{ name: 'Brad Lander' }] },
            { office: 'New York City Public Advocate', candidates: [{ name: 'Jumaane Williams' }] },
            { office: 'New York State Senate - District 30', candidates: [{ name: 'Cordell Cleare' }] },
            { office: 'New York State Assembly - District 70', candidates: [{ name: 'Jordan Wright' }] },
            { office: 'U.S. House - NY District 13', candidates: [{ name: 'Adriano Espaillat', party: 'Democrat' }] },
            { office: 'New York City Council - District 9', candidates: [{ name: 'Yusef Salaam' }] },
          ],
        }

        // include synthetic id so it will be rendered in grouped view
        ids = [...ids.filter(Boolean), syntheticId]

        // set synthetic data early
        setVoterInfoByElection((prev) => ({ ...prev, [syntheticId]: hardcodedVoterInfo }))
      }

      // Fetch voterinfo for each selected election id in parallel (skip synthetic ids)
      const remoteIds = ids.filter((id) => !id?.toString().startsWith('hardcoded'))
      if (remoteIds.length > 0) {
        const fetches = remoteIds.map((id) =>
          fetch(`/api/elections?zip=${encodeURIComponent(zip)}&electionId=${encodeURIComponent(id)}`).then(async (r) => {
            if (!r.ok) return null
            const j = await r.json().catch(() => null)
            return j?.voterinfo || null
          }).catch(() => null)
        )

        const results = await Promise.all(fetches)
        const map = {}
        for (let i = 0; i < remoteIds.length; i++) {
          map[remoteIds[i]] = results[i]
        }
        // merge with any existing synthetic entries
        setVoterInfoByElection((prev) => ({ ...prev, ...map }))
      }
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

  // auto-load when zip becomes 5 digits
  useEffect(() => {
    if (/^\d{5}$/.test(zip) && zip !== lastQueriedZip) {
      loadElections()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip])

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

      {/* Grouped candidates by election (auto-fetched) */}
      {elections.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Candidates grouped by election</h3>
          {elections.map((el) => {
            const vi = voterInfoByElection[el.id]
            return (
              <div key={el.id} style={{ marginBottom: 14, padding: 8, border: '1px solid #eee' }}>
                <strong>{el.name} — {el.electionDay}</strong>
                {vi ? (
                  Array.isArray(vi.contests) && vi.contests.length > 0 ? (
                    vi.contests.map((contest, cidx) => (
                      <div key={cidx} style={{ marginTop: 8 }}>
                        <div><strong>{contest.office}{contest.district?.name ? ` — ${contest.district.name}` : ''}</strong></div>
                        {Array.isArray(contest.candidates) && contest.candidates.length > 0 ? (
                          <ul>
                            {contest.candidates.map((c, ci) => (
                              <li key={ci}>{c.name}{c.party ? ` (${c.party})` : ''}</li>
                            ))}
                          </ul>
                        ) : (
                          <div style={{ fontStyle: 'italic' }}>No candidates listed for this contest</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ marginTop: 8, fontStyle: 'italic' }}>No contests/candidates found for this election.</div>
                  )
                ) : (
                  <div style={{ marginTop: 8, fontStyle: 'italic' }}>Loading or no data for this election.</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
