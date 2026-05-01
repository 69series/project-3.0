import PageShell from "../components/PageShell";
import styles from "./Portfolio.module.css";

// ── Hardcoded data ──────────────────────────────────────────────────────────

const bio = {
  name: "Alex Alderson",
  title: "Electronics Engineer",
  tagline: "Building at the edge of hardware and intelligence.",
  about: `I'm an electronics engineer who lives in the intersection of low-level
    hardware and high-level systems. I design circuits, write firmware, and
    occasionally break things on purpose — just to understand them better.
    My work spans embedded systems, signal processing, and whatever rabbit hole
    I happen to be falling down this week.`,
  location: "Somewhere between a soldering iron and a terminal",
  available: true,
};

const skills = [
  {
    category: "Hardware",
    icon: "⬡",
    items: ["PCB Design (KiCad)", "Embedded C/C++", "FPGA (Verilog)", "Oscilloscope & Logic Analyser", "RF & Antenna Design"],
  },
  {
    category: "Software",
    icon: "◈",
    items: ["Python", "Node.js / Express", "React + Vite", "MongoDB", "Git & GitHub"],
  },
  {
    category: "Tools & Platforms",
    icon: "◬",
    items: ["VS Code", "PlatformIO", "LTspice", "Linux / Bash", "Render & Vercel"],
  },
  {
    category: "Currently Learning",
    icon: "◉",
    items: ["Machine Learning (on MCUs)", "RTOS", "Rust", "WebAssembly", "Tailwind + Framer Motion"],
  },
];

const experience = [
  {
    role: "Electronics Engineer Intern",
    org: "Quantum Dynamics Lab",
    period: "Jun 2024 – Present",
    type: "Internship",
    points: [
      "Designed a 6-layer PCB for a multi-sensor IoT gateway (ESP32 + LoRa).",
      "Wrote bare-metal firmware in C for STM32 that reduced boot time by 40%.",
      "Collaborated with the software team to integrate MQTT over TLS.",
    ],
  },
  {
    role: "Freelance Embedded Developer",
    org: "Self-employed",
    period: "Jan 2023 – May 2024",
    type: "Freelance",
    points: [
      "Built a custom home-automation system using ESP32 + React dashboard.",
      "Delivered 3 client projects: BLE beacon, motor controller, RS-485 gateway.",
      "Maintained 100% on-time delivery across all contracts.",
    ],
  },
  {
    role: "Electronics Lab Assistant",
    org: "University Dept. of ECE",
    period: "Aug 2022 – Dec 2022",
    type: "Part-time",
    points: [
      "Assisted 60+ undergrad students with circuit debugging & simulation.",
      "Maintained lab equipment inventory and calibration schedules.",
    ],
  },
];

const education = [
  {
    degree: "B.Tech – Electronics & Communication Engineering",
    institution: "National Institute of Technology",
    period: "2021 – 2025",
    grade: "8.7 CGPA",
    highlight: "Specialisation in Embedded Systems & Signal Processing",
  },
  {
    degree: "Higher Secondary (Science – PCM)",
    institution: "Delhi Public School",
    period: "2019 – 2021",
    grade: "94.6%",
    highlight: "School topper in Physics & Mathematics",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <PageShell>
      {(user) => (
        <div className={styles.page}>

          {/* ── HERO / BIO ── */}
          <section className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden="true" />

            <div className={styles.heroMeta}>
              {bio.available && (
                <span className={styles.availBadge}>
                  <span className={styles.availDot} />
                  Available for work
                </span>
              )}
              <span className={styles.locationTag}>{bio.location}</span>
            </div>

            <h1 className={styles.heroName}>{bio.name}</h1>
            <p className={styles.heroTitle}>{bio.title}</p>
            <p className={styles.heroTagline}>{bio.tagline}</p>
            <p className={styles.heroAbout}>{bio.about}</p>
            
            {/* ── RESUME BUTTON ── */}
            <a 
              href="http://six9series-3-0-b.onrender.com/resume"
              target="_blank"
              rel="noopener noreferrer"
              type="application/pdf"
              className={styles.resumeBtn}
            >
              View Resume ↗
            </a>                         


            <div className={styles.heroDivider} />
          </section>

          {/* ── SKILLS ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Skills & Stack
            </h2>
            <div className={styles.skillsGrid}>
              {skills.map((group) => (
                <div key={group.category} className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillIcon}>{group.icon}</span>
                    <span className={styles.skillCategory}>{group.category}</span>
                  </div>
                  <ul className={styles.skillList}>
                    {group.items.map((item) => (
                      <li key={item} className={styles.skillItem}>
                        <span className={styles.skillBullet} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── EXPERIENCE ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Experience
            </h2>
            <div className={styles.timeline}>
              {experience.map((job, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineLine}>
                    <span className={styles.timelineNode} />
                    {i < experience.length - 1 && <span className={styles.timelineTrack} />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTop}>
                      <span className={styles.timelineRole}>{job.role}</span>
                      <span className={styles.timelinePeriod}>{job.period}</span>
                    </div>
                    <div className={styles.timelineOrg}>
                      {job.org}
                      <span className={styles.timelineType}>{job.type}</span>
                    </div>
                    <ul className={styles.timelinePoints}>
                      {job.points.map((pt, j) => (
                        <li key={j}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── EDUCATION ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Education
            </h2>
            <div className={styles.eduGrid}>
              {education.map((edu, i) => (
                <div key={i} className={styles.eduCard}>
                  <div className={styles.eduTop}>
                    <p className={styles.eduDegree}>{edu.degree}</p>
                    <span className={styles.eduGrade}>{edu.grade}</span>
                  </div>
                  <p className={styles.eduInstitution}>{edu.institution}</p>
                  <p className={styles.eduPeriod}>{edu.period}</p>
                  <p className={styles.eduHighlight}>{edu.highlight}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}
    </PageShell>
  );
}
