import { useNavigate } from 'react-router-dom';
import './snapshot.css';

export default function About() {
  const navigate = useNavigate();
  return (
    <main className="about-page">
      <button className="pill" onClick={() => navigate('/')}>Home</button>
      <h1 className="about-title">About Us</h1>
      <div className="about-columns">
        <div className="about-col">
          <h2>WHY DID WE<br/>BUILD BALLOT<br/>SNAPSHOT?</h2>
          <p>We built Ballot Snapshot to empower non-political or first-time voters with clear, concise, and trustworthy information so they can make confident, informed choices in their local elections.</p>
          <p>Many voters, especially those who are not politically inclined, find it challenging to learn about their local representatives or understand who's running for office in their district. Websites and campaign materials can be confusing, outdated, or scattered across multiple sources. As a result, voters often make uninformed decisions or opt not to vote at all.</p>
          <p>Ballot Snapshot seeks to bridge this gap by creating an easy-to-use, educational web app that summarizes local ballots, candidates, and their key policies. Users will be able to quickly view who's running, what each position entails, and how candidates differ—all in one accessible interface.</p>
        </div>
        <div className="about-col">
          <h2>WHAT ARE<br/>LOCAL<br/>ELECTIONS?</h2>
          <p><strong>Local elections</strong>, often called municipal or first-level elections, are elections held at the city, county, or municipal level where citizens vote for officials such as mayors, city council members, county commissioners, judges, and school board members.</p>
          <p>These elections determine how local governments operate and directly affect daily life through policies on education, transportation, housing, and public safety.</p>
          <p><strong>Always remember that every year is an election year!</strong></p>
          <p>Even when there aren't national or statewide elections, local elections are taking place across the country.</p>
        </div>
        <div className="about-col">
          <h2>COMMON POSITIONS<br/>FOR LOCAL<br/>GOVERNMENT</h2>
          <p><strong>Mayor:</strong> the chief executive of a city or town, overseeing municipal departments and budgets.</p>
          <p><strong>City Council Members:</strong> Represent districts or wards within a city, passing local laws and ordinances.</p>
          <p><strong>County Commissioners/Executives:</strong> Manage county budgets, infrastructure, and services like public health and transportation.</p>
          <p><strong>School Board Members:</strong> Set policies for local public schools, including curriculum, budgets, and superintendent oversight.</p>
          <p><strong>Judges:</strong> Depending on the state, local judges (such as municipal or district judges) may be elected to preside over local courts.</p>
          <p><strong>Sheriffs:</strong> Elected law enforcement officials responsible for county policing, jails, and public safety.</p>
        </div>
      </div>
      <div className="divider-stars big">
        <img src="/images/icons/star-red.svg" alt="" aria-hidden="true" />
        <img src="/images/icons/star-white.svg" alt="" aria-hidden="true" />
        <img src="/images/icons/star-red.svg" alt="" aria-hidden="true" />
      </div>
    </main>
  );
}
