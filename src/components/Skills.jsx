import Reveal from './Reveal.jsx';

export default function Skills({ githubData }) {
  // Categorize skills
  const skillCategories = {
    'Languages': [
      'JavaScript', 'Python', 'Java', 'TypeScript', 'C', 'C++', 
      'SystemVerilog', 'HTML', 'CSS', 'SQL', 'Shell', 'Verilog'
    ],
    'Tools & Platforms': [
      'React', 'Node.js', 'Git', 'Docker', 'AWS', 'Azure', 
      'VS Code', 'Prisma', 'MySQL', 'PostgreSQL', 'MongoDB'
    ],
    'Other': [
      'MATLAB', 'Excel', 'PowerPoint', 'Figma', 'Photoshop'
    ]
  };

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
  
  // Merge GitHub languages with predefined categories
  const mergedSkills = {
    'Languages': [...new Set([...githubLanguages, ...skillCategories['Languages']])],
    'Tools & Platforms': skillCategories['Tools & Platforms'],
    'Other': skillCategories['Other']
  };

  return (
    <section id="skills" className="section">
      <Reveal delay="260ms" className="list-container">
        <h2>Skills</h2>
        
        <div className="skills-categories">
          {Object.entries(mergedSkills).map(([category, skills]) => (
            <div key={category} className="skill-category">
              <h3 className="category-title">{category}</h3>
              <ul className="chip-list">
                {skills.map((skill) => (
                  <li key={skill} className="skill-chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}