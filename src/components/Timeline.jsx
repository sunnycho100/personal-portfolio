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
        ></div>
        
        {/* Experience markers */}}
        {sortedExperiences.map((exp, index) => {
          // Calculate position starting from the top offset
          // The first item starts at the offset, then spreads downward
          const totalRange = 90; // percentage of container height to use
          const position = sortedExperiences.length > 1 
            ? (totalRange / (sortedExperiences.length - 1)) * index 
            : 0;
          
          return (
            <div
              key={index}
              className="timeline-item"
              style={{ 
                top: `calc(${position}% + var(--timeline-top-offset))` 
              }}
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
