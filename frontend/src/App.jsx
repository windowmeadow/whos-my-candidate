import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './snapshot.css';
import Home from './Home';
import BallotSnapshot from './BallotSnapshot';
import CandidateDetails from './CandidateDetails';
import About from './About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ballot-snapshot" element={<BallotSnapshot />} />
        <Route path="/candidate/:slug" element={<CandidateDetails />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
