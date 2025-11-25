import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './snapshot.css';

export default function CandidateDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/candidates/${slug}`);
        if (!res.ok) throw new Error('Candidate not found');
        const json = await res.json();
        setCandidate(json.candidate);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <main className="details-page"><p className="loading-text">Loading…</p></main>;
  if (error) return <main className="details-page"><p className="error-text">{error}</p><button className="pill" onClick={() => navigate('/ballot-snapshot?zip=10026')}>Back</button></main>;
  if (!candidate) return null;

  return (
    <main className="details-page">
      <button
        type="button"
        className="circle-back"
        aria-label="Back to ballot snapshot"
        onClick={() => navigate('/ballot-snapshot?zip=10026')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/ballot-snapshot?zip=10026'); } }}
      >&larr;</button>
      <img
        src={candidate.imageUrl}
        alt={`Portrait of ${candidate.name}`}
        className="candidate-photo"
        loading="lazy"
      />
      <section className="details-panel">
        <h1 className="details-title">Meet {candidate.name}</h1>
      </section>
      <section className="bio-section">
        <p className="bio-text">{candidate.bio}</p>
        <div className="divider-stars">
          <img src="/images/icons/star-red.svg" alt="" aria-hidden="true" />
          <img src="/images/icons/star-white.svg" alt="" aria-hidden="true" />
          <img src="/images/icons/star-red.svg" alt="" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
