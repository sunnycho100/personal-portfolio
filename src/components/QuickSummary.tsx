const languages = [
  'Python', 'TypeScript', 'C/C++', 'SystemVerilog',
  'Java', 'SQL', 'Go', 'Swift', 'MATLAB',
]

const QuickSummary = () => {
  return (
    <div className="accordion-list quick-summary">
      <div className="qs-body">
        <div className="qs-row">
          <span className="qs-label">Education</span>
          <span className="qs-value">University of Wisconsin–Madison</span>
          <span className="qs-detail">
            B.S. Computer Engineering &amp; Computer Science
          </span>
          <span className="qs-meta">
            GPA 3.93 / 4.00 · Dean's Honor List
          </span>
        </div>

        <div className="qs-divider" />

        <div className="qs-row">
          <span className="qs-label">Languages</span>
          <div className="qs-tags">
            {languages.map((lang) => (
              <span className="qs-tag" key={lang}>{lang}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickSummary
