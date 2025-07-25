import { motion } from 'framer-motion';
import Header from '../../components/Header';
import styles from '../../styles/xenco.module.css';

export default function Proposal() {
  return (
    <>
      <main className={`min-h-screen bg-gradient-to-br from-zinc-900 to-black ${styles.xencoPage}`}>
        <Header />
        {/* Splash Section */}
        <section className={styles.splash}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="splash-text"
          >
            XENCO MEDICAL
          </motion.span>
        </section>

        <div className={styles.mainContainer}>
          {/* Proposal Title and Info */}
          <div className={styles.topinfo}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>PHASE ONE: SURGEON NETWORK AND DATA FORUM</h1>
            <p>
              <strong>Prepared for:</strong> Xenco Medical<br />
              <strong>Prepared by:</strong> AI WRAP<br />
              <strong>Date:</strong> 7/15/2025<br />
              <strong>Version:</strong> 1.1
            </p>
          </div>

          {/* 1. Executive Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.section}
          >
            <h2>1. Executive Summary</h2>
            <p>
            AI WRAP is excited to partner with Xenco Medical to transform your brand into a modern,
trusted, and surgeon-centric identity, integrating innovative AI strategies that align with today’s
expectations in healthcare excellence. This proposal outlines our phased approach to delivering a
complete rebrand tailored specifically to the medical and AI spaces, with a strong focus on
credibility, accessibility, and innovation.
</p><p>
This proposal will focus on the first phase of the project, the surgeon network and forum.
            </p>
          </motion.section>

          {/* 2. Objectives */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.section}
          >
            <h2>2. Objectives</h2>
            <ol>
              <li>Modernize the visual identity</li>
              <li>Align branding with compliance (HIPAA, ADA, etc.)</li>
              <li>Improve digital experience across platforms</li>
              <li>Elevate perception to match clinical excellence</li>
              <li>Create a surgeon network and data forum</li>
              <li>Allow surgeons to share their data and insights with each other</li>
              <li>Allow surgeons to create profiles and upload x-rays, and other medical images</li>
              <li>Allow surgeons to comment on, tag, and interact with each other's data/posts</li>
              <li>Data uploaded and stored in a secure database</li>
              <li>Verified Data will grant access to XENAI models</li>
              <li>Encourage discovery and organic engagement</li>
              <li>Organically recruit and foster surgeon pride and ownership</li>
            </ol>
          </motion.section>

         

          {/* 3. Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.section}
          >
            <h2>3. Timeline</h2>
            <p>Estimated timeline: 9 weeks<br />
            Starts: 7/21/2025<br />
            Launch Goal: 9/22/2025</p>
          </motion.section>

          {/* 4. Pricing */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={styles.section}
          >
            <h2>4. Pricing</h2>
            <p>Total Project Fee: $50,000</p>
          </motion.section>

          {/* 5b. Detailed Timeline (Duplicated Section) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className={`${styles.section} ${styles.timelineOuterSection}`}
          >
            <h2>5. SCOPE OF WORK AND DETAILED TIMELINE</h2>
            {/* Weeks 1-2 */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Weeks 1-2</h3>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineColumn}>
                  <h4>DESIGN</h4>
                  <ul>
                    <li>Discovery & Strategy</li>
                    <li>Deep Dive Brand Audit</li>
                    <li>Competitor & Industry Analysis (including AI opportunities)</li>
                  </ul>
                </div>
                <div className={styles.timelineColumn}>
                  <h4>DEVELOPMENT</h4>
                  <ul>
                    <li>Tech stack research, platform, data architecture, and codebase decisions</li>
                    <li>Xenco IT Audit</li>
                    <li>Server setup (or use Xenco Medical Server), hosting, network setup, and integration with Xenco's live website</li>
                    <li>Development environment setup (React / Node base)</li>
                    <li>Platform launch order of operations</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Weeks 3-4 */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Weeks 3-4</h3>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineColumn}>
                  <h4>DESIGN</h4>
                  <ul>
                    <li>Brand Identity Design</li>
                    <li>Logo (Primary & Secondary Lockups)</li>
                    <li>Color Palette & Typography System</li>
                    <li>Brand Tone & Voice Guide</li>
                    <li>AI-Focused Design Direction</li>
                  </ul>
                </div>
                <div className={styles.timelineColumn}>
                  <h4>DEVELOPMENT</h4>
                  <ul>
                    <li>Back-end Forum build (user registration, user groups, post/thread structure)</li>
                    <li>Admin interface (calendar, email sync, messaging, website updates)</li>
                    <li>Preliminary front-end development (user pages, posts, threads, integration)</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Weeks 5-6 */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Weeks 5-6</h3>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineColumn}>
                  <h4>DESIGN</h4>
                  <ul>
                    <li>Updated Brand Asset Delivery</li>
                    <li>Surgeon/Patient Experience Design (Navigation, Appointment/Meeting Flow)</li>
                  </ul>
                </div>
                <div className={styles.timelineColumn}>
                  <h4>DEVELOPMENT</h4>
                  <ul>
                    <li>Front-end design development</li>
                    <li>Integration of branding and new style guide</li>
                    <li>User experience enhancements (page transitions, interactive elements, animations)</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Weeks 7-8 */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Weeks 7-8</h3>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineColumn}>
                  <h4>DESIGN</h4>
                  <ul>
                    <li>Final Surgeon interface design edits</li>
                    <li>Xenco Medical feedback and design edits</li>
                  </ul>
                </div>
                <div className={styles.timelineColumn}>
                  <h4>DEVELOPMENT</h4>
                  <ul>
                    <li>Back-end finalization and testing</li>
                    <li>Back-end branding integration</li>
                    <li>Complete testing and QA</li>
                    <li>Prelaunch preparations</li>
                    <li>UX Revisions</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Week 9 */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Week 9</h3>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineColumn}>
                  <ul>
                    <li>Launch preparation</li>
                  </ul>
                </div>
                <div className={styles.timelineColumn}>
                  <ul>
                    <li>v1.0 Launch</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Deliverables */}
            <div className={`${styles.timelineWeekContainer} ${styles.section}`}>
              <h3>Deliverables</h3>
              <ul>
                <li>Comprehensive AI-Enhanced Brand Strategy Report</li>
                <li>Updated Brand Guidelines with Visual and Innovative AI Elements</li>
                <li>AI-Driven Visual Identity Recommendations</li>
                <li>Implementation and AI Integration Roadmap</li>
                <li>Regular Strategic and Innovation-Focused Consultations</li>
                <li>Full Suite of Marketing Assets (Digital and Print)</li>
                <li>Forum Website and Interactive Ecosystem</li>
              </ul>
            </div>
          </motion.section>







          {/* Next Phases / Tranches */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={styles.section}
          >
            <h2>6. Future Phases / Tranches</h2>
            <ol>
              <li>Phase 2 of forum and surgeon network
                <ul>
                  <li>+ Exclusive sections</li>
                  <li>+ Personal pages</li>
                  <li>+ Blockchain connection</li>
                </ul>
              </li>
              <li><br></br>Complete front-end Xenco website redesign and multimedia marketing campaigns</li>
              <li><br></br>Internal integration of surgeon forum as admin system</li>
              <li><br></br>Progress assessment and forecasting</li>
            </ol>
          </motion.section>





          {/* 7. Next Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={styles.section}
          >
            <h2>7. Next Steps</h2>
            <ol>
              <li>Review and approve proposal</li>
              <li>Sign contract</li>
              <li>Project Kickoff Session</li>
            </ol>
          </motion.section>




        </div>
      </main>
    </>
  );
}