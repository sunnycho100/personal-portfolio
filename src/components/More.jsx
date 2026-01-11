// src/components/More.jsx
import Reveal from './Reveal.jsx';
import CommentsSection from './CommentsSection.jsx';

export default function More({ reloadComments }) {
  return (
    <section id="more" className="section">
      <Reveal delay="320ms" className="list-container">
        <h2>More About Me</h2>

        <details className="accordion" open>
          <summary>
            <div className="summary-left">
              <i className="fa-solid fa-user" aria-hidden="true"></i>
              <span>Open to see interests and mentors</span>
            </div>
            <i className="fa-solid fa-chevron-down chev" aria-hidden="true"></i>
          </summary>

          <div className="accordion-content stagger">
            <div className="about-block">
              <h3>Interests</h3>
              <ul className="chips-inline">
                <li>Traveling</li>
                <li>Learning systems</li>
                <li>Writing reflections</li>
                <li>Technology consulting</li>
              </ul>
            </div>

            <div className="about-block">
              <h3>My Mentors and Lessons Learned</h3>
              <ul className="bulleted">
                <li>My Beloved Parents – "Always share what you have."</li>
                <li>Major Ok – "Provide unconditional love to everyone."</li>
                <li>Lawyer Kim – "Imagine where you'll be in 3 days, 3 weeks, 3 months."</li>
              </ul>
            </div>
          </div>
        </details>

        {/* New: Comments accordion */}
        <CommentsSection onReloadRequest={reloadComments} />
      </Reveal>
    </section>
  );
}
