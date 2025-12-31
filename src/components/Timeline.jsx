import React from 'react';

export default function Timeline({ experiences }) {
  // Sort experiences by start date (earliest first for proper timeline display)
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  // Get the earliest and latest dates for the timeline range
  const dates = sortedExperiences.map(exp => new Date(exp.startDate));
  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));

  // Calculate position percentage for each experience
  const getPosition = (date) => {
    const start = earliestDate.getTime();
    const end = latestDate.getTime();
    const current = new Date(date).getTime();
    return ((current - start) / (end - start)) * 100;
  };

  // Generate year markers
  const startYear = earliestDate.getFullYear();
  const endYear = latestDate.getFullYear();
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    const yearDate = new Date(year, 0, 1); // January 1st of each year
    if (yearDate >= earliestDate && yearDate <= latestDate) {
      years.push({
        year,
        position: getPosition(yearDate.toISOString())
      });
    }
  }
  // Always include start and end years
  if (years.length === 0 || years[0].year !== startYear) {
    years.unshift({ year: startYear, position: 0 });
  }
  if (years[years.length - 1].year !== endYear) {
    years.push({ year: endYear, position: 100 });
  }

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {/* Year markers */}
        {years.map((yearData, index) => (
          <div
            key={`year-${yearData.year}`}
            className="timeline-year-marker"
            style={{ left: `${yearData.position}%` }}
          >
            <div className="timeline-year-label">{yearData.year}</div>
          </div>
        ))}
        
        {/* Experience markers */}
        {sortedExperiences.map((exp, index) => {
          const position = getPosition(exp.startDate);
          const isAbove = index % 2 === 0; // Alternate above and below
          return (
            <div
              key={index}
              className={`timeline-marker ${isAbove ? 'above' : 'below'}`}
              style={{ left: `${position}%` }}
            >
              <div className="timeline-connector"></div>
              <div className="timeline-dot"></div>
              <div className="timeline-label">
                <div className="timeline-date">{exp.displayDate}</div>
                <div className="timeline-title">{exp.role}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
