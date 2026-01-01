import React from 'react';

export default function Timeline({ experiences }) {
  // Sort experiences by start date (most recent first for timeline display)
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  // Format end date
  const formatEndDate = (exp) => {
    if (exp.current || !exp.endDate) return 'Present';
    const date = new Date(exp.endDate);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        <div 
          className="timeline-line"
          style={{ 
            height: sortedExperiences.length > 1 ? '90%' : '0%' 
          }}
        ></div>
        
        {/* Experience markers */}}
        {sortedExperiences.map((exp, index) => {
          // Equal spacing from 0% to 90% (leaving room for bottom card)
          const position = sortedExperiences.length > 1 
            ? (90 / (sortedExperiences.length - 1)) * index 
            : 0;
          
          return (
            <div
              key={index}
              className="timeline-item"
              style={{ top: `${position}%` }}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-date">{exp.displayDate} – {formatEndDate(exp)}</div>
                <div className="timeline-title">{exp.role}</div>
                <div className="timeline-company">{exp.company}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
