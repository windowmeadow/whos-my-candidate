import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './snapshot.css';

export default function Home() {
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    if (zip === '10026') {
      navigate('/ballot-snapshot?zip=10026');
    } else {
      // Keep zip entry but show simple validation (could add toast)
      alert('For now, only demo ZIP 10026 is supported.');
    }
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <h1 className="app-title">Ballot<br/>Snapshot</h1>
        <button className="pill" onClick={() => navigate('/about')}>About Us</button>
      </header>
      <section className="home-hero">
        <div className="hero-panel">
          <p className="hero-quote">We the People of the United States,<br/>Deserve The Leaders We Need,<br/>For a Better America!</p>
          <form onSubmit={onSubmit} className="zip-form">
            <input
              className="zip-input"
              value={zip}
              maxLength={5}
              onChange={e => setZip(e.target.value.replace(/[^0-9]/g,'').slice(0,5))}
              placeholder="Type the ZIP code 10026"
              aria-label="ZIP code"
            />
            <div className="zip-hint">For now, we only support 10026<br/>as the demo ZIP code.</div>
            <button type="submit" className="primary-btn">Submit/Load Elections</button>
          </form>
        </div>
        <div className="hero-image" aria-hidden="true" />
      </section>
    </main>
  );
}
