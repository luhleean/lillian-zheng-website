import { ArrowDown, ArrowUpRight, Code2, Database, HeartPulse, Sigma } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

const liveProject = 'https://health.lillian-zheng.com/community-health-explorer';
const projectRepo = 'https://github.com/luhleean/community-health-explorer';
const githubProfile = 'https://github.com/luhleean';

export default function Home() {
  return (
    <main className="portfolio-shell">
      <header className="top-frame">
        <a className="wordmark" href="#top">LZ<span>/</span>PORTFOLIO</a>
        <div className="top-meta" aria-label="Site information">
          <span>STUDENT PORTFOLIO</span>
          <span>HEALTH · MATHEMATICS · DATA</span>
        </div>
        <nav aria-label="Primary navigation">
          <a href="#work">WORK</a>
          <a href="#profile">PROFILE</a>
          <a href="/flashcards">FLASHCARDS</a>
          <a href={githubProfile} target="_blank" rel="noreferrer">GITHUB ↗</a>
          <ThemeToggle />
        </nav>
      </header>

      <section className="identity" id="top">
        <aside className="index-rail" aria-hidden="true">
          <span>00</span>
          <i />
          <span>02</span>
        </aside>

        <div className="identity-main">
          <p className="eyebrow"><span>HELLO, I’M</span></p>
          <h1><span>LILLIAN</span><span>ZHENG</span></h1>
          <div className="identity-line">
            <span>HEALTH</span><i />
            <span>MATHEMATICS</span><i />
            <span>DATA</span>
          </div>
          <div className="intro-block">
            <p>
              I’m interested in how health information, mathematics, and technology can work
              together to make complicated questions easier to understand.
            </p>
            <a href="#work">VIEW SELECTED WORK <ArrowDown /></a>
          </div>
        </div>

        <aside className="resume-module" aria-label="Mini resume">
          <div className="resume-header"><span>MINI RÉSUMÉ</span><span>EDUCATION + SKILLS</span></div>
          <div className="resume-section education-section">
            <p className="resume-label">EDUCATION / UNIVERSITY OF NORTH FLORIDA</p>
            <div className="education-row">
              <div><strong>Bachelor’s degree</strong><span>Expected May 2028</span></div>
              <b>2028</b>
            </div>
            <div className="education-row">
              <div><strong>Master’s degree</strong><span>Expected May 2029</span></div>
              <b>2029</b>
            </div>
          </div>
          <div className="resume-section">
            <p className="resume-label">TECHNICAL EXPERIENCE</p>
            <ul className="skill-readout">
              <li><span>01</span>Virtual machine setup &amp; management</li>
              <li><span>02</span>SQL &amp; relational databases</li>
              <li><span>03</span>Data analysis &amp; visualization</li>
              <li><span>04</span>React &amp; TypeScript</li>
              <li><span>05</span>REST APIs &amp; data integration</li>
              <li><span>06</span>Git &amp; GitHub</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="work" id="work">
        <header className="section-bar">
          <span>01 / SELECTED WORK</span>
          <span>CDC PLACES / 2025 DATA</span>
        </header>

        <article className="project">
          <div className="project-index">
            <span>PROJECT</span>
            <strong>001</strong>
            <small>PUBLIC HEALTH<br />DATA EXPLORATION</small>
          </div>

          <div className="project-view">
            <div className="screen-frame">
              <div className="screen-top"><span>COMMUNITY HEALTH EXPLORER</span><span>LIVE / CDC PLACES 2025</span></div>
              <div className="screen-grid">
                <div className="screen-stat"><small>U.S. ESTIMATE</small><b>12.1</b><span>% DIAGNOSED DIABETES</span></div>
                <div className="heat-grid" aria-hidden="true">
                  {[22, 48, 63, 31, 78, 51, 89, 42, 69, 56, 34, 82, 45, 72, 58, 91, 39, 66, 53, 76, 28, 61, 86, 47].map((heat, index) => (
                    <i key={index} style={{ opacity: heat / 100 }} />
                  ))}
                </div>
                <div className="screen-chart" aria-hidden="true">
                  <svg viewBox="0 0 430 120">
                    <path d="M0 101C45 103 58 76 91 82C130 89 150 42 186 54C220 65 246 33 279 42C321 55 341 16 374 30C397 40 414 19 430 12" />
                    {[42, 91, 148, 208, 279, 341, 402].map((x, i) => <circle key={x} cx={x} cy={[98,82,56,58,42,28,24][i]} r="4" />)}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="project-info">
            <p className="project-code">WEB PROJECT / 2026</p>
            <h2>Community<br />Health Explorer</h2>
            <p className="project-summary">
              County-level health estimates are useful, but the source tables are difficult to
              navigate. This project turns the CDC PLACES dataset into a focused tool for comparing
              patterns across communities.
            </p>
            <dl>
              <div><dt>SOURCE</dt><dd>CDC PLACES API</dd></div>
              <div><dt>SCOPE</dt><dd>3,000+ U.S. counties</dd></div>
              <div><dt>STACK</dt><dd>React / TypeScript</dd></div>
              <div><dt>ROLE</dt><dd>Data / UI / Development</dd></div>
            </dl>
            <div className="project-actions">
              <a href={liveProject} target="_blank" rel="noreferrer">OPEN LIVE PROJECT <ArrowUpRight /></a>
              <a href={projectRepo} target="_blank" rel="noreferrer">SOURCE CODE <Code2 /></a>
            </div>
          </div>
        </article>
      </section>

      <section className="profile" id="profile">
        <header className="section-bar light-bar">
          <span>02 / PROFILE</span>
          <span>INTERESTS & EXPERIENCE</span>
        </header>
        <div className="profile-grid">
          <div className="profile-statement">
            <p className="profile-marker">WHAT I’M INTERESTED IN</p>
            <h2>Health,<br /><span>mathematics,</span><br />and data.</h2>
          </div>
          <div className="profile-copy">
            <p>
              I’m especially interested in health, mathematics, and data. I like work where
              accuracy matters, context changes the meaning, and the result needs to be clear to
              someone outside the field.
            </p>
            <p>
              I’m building experience across data analysis, database systems, virtualization,
              interface design, and development through coursework and practical projects.
            </p>
          </div>
          <div className="focus-list">
            <article><HeartPulse /><span>01</span><h3>Health</h3><p>Using information to better understand patterns that affect people and communities.</p></article>
            <article><Sigma /><span>02</span><h3>Mathematics</h3><p>Working through quantitative questions and making the reasoning easier to follow.</p></article>
            <article><Database /><span>03</span><h3>Data</h3><p>Finding useful structure in complex information without losing the context behind it.</p></article>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-id"><span>LILLIAN ZHENG</span><span>PORTFOLIO / 2026</span></div>
        <p>Current work, experiments, and source code live on GitHub.</p>
        <a href={githubProfile} target="_blank" rel="noreferrer">github.com/luhleean <ArrowUpRight /></a>
      </footer>
    </main>
  );
}
