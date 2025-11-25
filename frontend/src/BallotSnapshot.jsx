import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './snapshot.css';

export default function BallotSnapshot() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const zip = params.get('zip');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!zip) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/candidates?zip=${encodeURIComponent(zip)}`);
        if (!res.ok) throw new Error('Failed to load candidates');
        const json = await res.json();
        setCandidates(json.candidates || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [zip]);

  return (
    <main className="ballot-page">
      <button type="button" className="pill home-top-left" onClick={() => navigate('/')}>Home</button>
      <header className="ballot-header">
        <h1 className="page-title">Ballot Snapshot</h1>
        {zip && <h2 className="page-sub">For ZIP Code {zip}</h2>}
      </header>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="loading-text">Loading…</p>}

      <div className="cards-grid">
        {candidates.map(c => (
          <article key={c.id} className="candidate-card">
            <h3 className="candidate-name">{c.name}</h3>
            <div className="candidate-office">{c.office}</div>
            {c.party && <div className="candidate-party">{c.party}</div>}
            <Link to={`/candidate/${c.slug}`} className="details-btn">View Details</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
