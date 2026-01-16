import { useState } from 'react';
import Reveal from './Reveal.jsx';
import Timeline from './Timeline.jsx';

export default function Experience() {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' or 'list'

  // Experience data with extracted dates
  // TODO: Create automatic date extraction function (see README)
  const experienceData = [
    {
      role: "Robotics Research Intern",
      company: "Connected & Autonomous Transportation Systems Lab",
      startDate: "2025-09-01",
      endDate: null,
      displayDate: "Sep 2025",
      current: true
    },
    {
      role: "Undergraduate Teaching Assistant",
      company: "University of Wisconsin–Madison",
      startDate: "2025-08-01",
      endDate: null,
      displayDate: "Aug 2025",
      current: true
    },
    {
      role: "Information Technology Consulting Intern",
      company: "Deloitte",
      startDate: "2025-06-01",
      endDate: "2025-08-01",
      displayDate: "Jun 2025",
      current: false
    },
    {
      role: "Student Tutor",
      company: "University of Wisconsin–Madison",
      startDate: "2025-01-01",
      endDate: null,
      displayDate: "Jan 2025",
      current: true
    },
    {
      role: "Data Analytics Intern",
      company: "PNS Networks",
      startDate: "2025-12-01",
      endDate: "2026-01-01",
      displayDate: "Dec 2025",
      current: false
    },
    {
      role: "Sergeant, Network Engineer",
      company: "Republic of Korea Army",
      startDate: "2023-06-01",
      endDate: "2024-12-01",
      displayDate: "Jun 2023",
      current: false
    }
  ];

  return (
    <section id="experience" className="section">
      <Reveal delay="180ms" className="list-container">
        <h2>Experience</h2>
        
        {/* Internal tab switcher */}
        <div className="experience-tab-switcher">
          <button 
            className={`experience-tab ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
          >
            Timeline
          </button>
          <button 
            className={`experience-tab ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            Work Experience
          </button>
        </div>

        {/* Timeline View */}
        {activeView === 'timeline' && (
          <div className="experience-view">
            <Timeline experiences={experienceData} />
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="experience-view">
            <ul className="item-list stagger">
          <li className="list-item">
            <div className="role-line">
              <strong>Robotics Research Intern</strong> — Connected & Autonomous Transportation Systems Lab (Prof. Xiaopeng Li)
              <span className="meta">Sep 2025 – Present · Madison, WI</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Implemented multi-camera <strong>3D object detection pipelines in Python</strong> using <strong>PyTorch</strong> and <strong>MMDetection3D</strong> to support real-time perception research for autonomous driving across standard datasets (DAIR-V2X, KITTI).</li>
              <li>Performed <strong>performance evaluation and benchmarking</strong> of <strong>BEV-based perception models</strong> by running training and inference pipelines and analyzing detection metrics for roadside-infrastructure scenarios.</li>
            </ul>
          </li>

          <li className="list-item">
            <div className="role-line">
              <strong>Undergraduate Teaching Assistant</strong> — University of Wisconsin–Madison
              <span className="meta">Aug 2025 – Present · Madison, WI</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Instructed <strong>100+ students</strong> through one-on-one tutoring and weekly office hours, reinforcing <strong>digital logic</strong>, <strong>RTL design</strong>, and <strong>SystemVerilog</strong> concepts while guiding students through <strong>debugging</strong> and <strong>root-cause analysis</strong>.</li>
              <li>Collaborated with professors and fellow TAs to implement a <strong>reverse classroom model</strong>, facilitating active learning through guided debugging, problem decomposition, and interactive problem-solving sessions.</li>
            </ul>
          </li>

          <li className="list-item">
            <div className="role-line">
              <strong>Information Technology Consulting Intern</strong> — Deloitte
              <span className="meta">Jun 2025 – Aug 2025 · Seoul, South Korea</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Initiated the digital transformation of a <strong>$50B financial institution</strong> using <strong>enterprise architecture frameworks</strong> to develop a <strong>modernization roadmap</strong> focused on <strong>process improvement</strong> and <strong>workflow optimization</strong>.</li>
              <li>Assessed <strong>AI-OCR, blockchain, and eForm solutions</strong> through cross-industry <strong>benchmarking</strong>, <strong>requirements analysis</strong>, and a <strong>KPI-based scoring framework</strong> incorporating <strong>cost–benefit analysis</strong> for enterprise digitization.</li>
              <li>Partnered with stakeholders to <strong>analyze Java-based application source code</strong> and <strong>define a reference architecture</strong> by creating inter-application connections that streamlined workflows and improved system efficiency.</li>
            </ul>
          </li>

          <li className="list-item">
            <div className="role-line">
              <strong>Student Tutor</strong> — University of Wisconsin–Madison
              <span className="meta">Jan 2025 – Present · Madison, WI</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Provided tutoring in Physics, Chemistry, Mathematics, and Computer Engineering, adapting explanations to individual learning styles.</li>
              <li>Supported peers through both paid and volunteer tutoring, reinforcing subject mastery while developing communication and mentoring skills.</li>
            </ul>
          </li>

          <li className="list-item">
            <div className="role-line">
              <strong>Data Analytics Intern</strong> — PNS Networks
              <span className="meta">Dec 2025 – Jan 2026 · Seoul, South Korea</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Built a <strong>full-stack freight analytics platform</strong> using <strong>Python</strong>, <strong>Flask</strong>, <strong>React</strong>, and <strong>TypeScript</strong>, automating multi-year <strong>intermodal freight ETL pipelines</strong>, reducing manual processing by <strong>95%</strong>, enabling data-backed carrier renegotiation.</li>
              <li>Analyzed <strong>100k+ intermodal shipment records</strong> using <strong>regression modeling</strong> to compare operational variables and identify loss drivers, developing a <strong>continuous risk-scoring model</strong> to evaluate contract risk and high-loss scenarios.</li>
            </ul>
          </li>

          <li className="list-item">
            <div className="role-line">
              <strong>Sergeant, Network Engineer</strong> — Republic of Korea Army
              <span className="meta">Jun 2023 – Dec 2024 · Seoul, South Korea</span>
            </div>
            <ul className="bullet-list stagger">
              <li>Specialized in military signaling and operation of advanced communication devices to ensure secure, reliable communications during missions.</li>
              <li>Performed geospatial analysis to determine optimal relay station placement, enabling stable brigade-level communication networks.</li>
              <li>Coordinated across units during field training exercises, developing effective combat signaling strategies under varied conditions.</li>
              <li>Served as the communication link between upper command and front-line units, strengthening leadership and precise message delivery.</li>
              <li><em>Awards:</em> 2nd Place, Brigade Encryption/Decryption Competition; Soldier of the Month.</li>
            </ul>
          </li>
        </ul>
          </div>
        )}
      </Reveal>
    </section>
  );
}