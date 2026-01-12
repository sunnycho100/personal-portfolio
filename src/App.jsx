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
import Books from './components/Books.jsx';     // new Books section
import More from './components/More.jsx';
import Contact from './components/Contact.jsx';
import DeveloperMode from './components/DeveloperMode.jsx';

export default function App() {
  const [reloadComments, setReloadComments] = useState(0);
  const [reloadBooks, setReloadBooks] = useState(0);
  const [githubData, setGithubData] = useState(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [books, setBooks] = useState([]);
  const [preloadedBooks, setPreloadedBooks] = useState(null);

  // Fetch GitHub data once at app level
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    fetch(`${API_URL}/api/github/overview`)
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

  // Preload books with low priority (after initial render)
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    
    // Use setTimeout to defer this to after critical rendering
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/books?language=en`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch books');
        })
        .then(apiBooks => {
          setPreloadedBooks(apiBooks);
        })
        .catch(err => {
          console.error('Failed to preload books:', err);
          setPreloadedBooks([]); // Set empty array to indicate fetch was attempted
        });
    }, 100); // Small delay to ensure critical components render first

    return () => clearTimeout(timer);
  }, [reloadBooks]);

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
        <Github githubData={githubData} />   {/* new tab section between Activities and Books */}
        <Books 
          isDevMode={isDevMode} 
          reloadBooks={reloadBooks}
          onBooksLoaded={setBooks}
          preloadedBooks={preloadedBooks}
        />
        <More 
          reloadComments={reloadComments} 
        />
        <Contact onCommentAdded={() => setReloadComments(prev => prev + 1)} />
      </div>
      <DeveloperMode 
        onDevModeChange={setIsDevMode} 
        books={books}
        onBookUpdate={() => setReloadBooks(prev => prev + 1)}
      />
    </>
  );
}