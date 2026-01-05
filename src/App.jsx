import './App.css';
import { useState, useEffect } from 'react';
import TopNav from './components/TopNav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Activities from './components/Activities.jsx';
import Github from './components/Github.jsx';   // new
import More from './components/More.jsx';
import Contact from './components/Contact.jsx';
import DeveloperMode from './components/DeveloperMode.jsx';

export default function App() {
  const [reloadComments, setReloadComments] = useState(0);
  const [githubData, setGithubData] = useState(null);
  const [isDevMode, setIsDevMode] = useState(false);

  // Fetch GitHub data once at app level
  useEffect(() => {
    fetch("http://localhost:4000/api/github/overview")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load GitHub data");
        return res.json();
      })
      .then((json) => {
        setGithubData(json);
      })
      .catch((err) => {
        console.error("GitHub data fetch error:", err);
      });
  }, []);

  return (
    <>
      <TopNav />
      <div className="container">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills githubData={githubData} />
        <Activities />
        <Github githubData={githubData} />   {/* new tab section between Activities and More */}
        <More reloadComments={reloadComments} isDevMode={isDevMode} />
        <Contact onCommentAdded={() => setReloadComments(prev => prev + 1)} />
      </div>
      <DeveloperMode onDevModeChange={setIsDevMode} />
    </>
  );
}