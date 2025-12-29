import './App.css';
import { useState } from 'react';
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

export default function App() {
  const [reloadComments, setReloadComments] = useState(0);
  return (
    <>
      <TopNav />
      <div className="container">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Activities />
        <Github />   {/* new tab section between Activities and More */}
        <More reloadComments={reloadComments} />
        <Contact onCommentAdded={() => setReloadComments(prev => prev + 1)} />
      </div>
    </>
  );
}