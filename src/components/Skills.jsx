import Reveal from './Reveal.jsx';

export default function Skills({ githubData }) {
  // Static skills that aren't programming languages
  const staticSkills = ['MATLAB', 'Excel', 'PowerPoint'];

  // Extract languages from GitHub data
  const getGithubLanguages = () => {
    if (!githubData) return [];
    
    const raw = 
      githubData.languageBytes && Object.keys(githubData.languageBytes).length > 0
        ? githubData.languageBytes
        : githubData.languages || {};
    
    const entries = Object.entries(raw);
    if (entries.length === 0) return [];
    
    // Sort by usage and get language names
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .filter(lang => lang !== 'Other'); // Exclude "Other" category
  };

  const githubLanguages = getGithubLanguages();
  
  // Combine GitHub languages with static skills, removing duplicates
  const allSkills = [...new Set([...githubLanguages, ...staticSkills])];

  return (
    <section id="skills" className="section">
      <Reveal delay="260ms" className="list-container">
        <h2>Skills</h2>
        <ul className="chip-list">
          {allSkills.length > 0 ? (
            allSkills.map((skill) => (
              <li key={skill} className="skill-chip">
                {skill}
              </li>
            ))
          ) : (
            // Fallback if no data is available yet
            <>
              <li className="skill-chip">SystemVerilog</li>
              <li className="skill-chip">Java</li>
              <li className="skill-chip">Python</li>
              <li className="skill-chip">MATLAB</li>
              <li className="skill-chip">Excel</li>
              <li className="skill-chip">PowerPoint</li>
            </>
          )}
        </ul>
      </Reveal>
    </section>
  );
}