import PageShell from "../components/PageShell";
import styles from "./Projects.module.css";

// ── Hardcoded data ──────────────────────────────────────────────────────────

const featured = {
  title: "IoT Smart Home Hub",
  description:
    "A full-stack home automation system built around an ESP32 gateway. Controls lights, sensors, and appliances via a real-time React dashboard. Communicates over MQTT with TLS encryption — no cloud dependency, fully local.",
  tags: ["ESP32", "MQTT", "React", "Node.js", "MongoDB", "PCB Design"],
  github: "https://github.com/69series",
  demo: null,
  status: "Live",
};

const projects = [
  {
    title: "BLE Beacon Tracker",
    description:
      "Bluetooth Low Energy beacon system for indoor asset tracking. Custom firmware on nRF52840, Python scanner on Raspberry Pi.",
    tags: ["BLE", "nRF52840", "Python", "Raspberry Pi"],
    github: "https://github.com/69series",
    demo: null,
    status: "Complete",
  },
  {
    title: "STM32 Motor Controller",
    description:
      "Bare-metal C firmware for a BLDC motor controller using STM32F4. FOC algorithm implemented from scratch.",
    tags: ["STM32", "Embedded C", "FOC", "KiCad"],
    github: "https://github.com/69series",
    demo: null,
    status: "Complete",
  },
  {
    title: "RS-485 Industrial Gateway",
    description:
      "Protocol bridge between RS-485 Modbus devices and a modern REST API. Deployed in a small manufacturing unit.",
    tags: ["RS-485", "Modbus", "Node.js", "Express"],
    github: "https://github.com/69series",
    demo: null,
    status: "Complete",
  },
  {
    title: "project-2.0 Portfolio",
    description:
      "Previous iteration of this portfolio site. Vanilla HTML + CSS + JS frontend with Node.js + Express backend. Live on Render.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Render"],
    github: "https://github.com/69series/project-2.0",
    demo: "https://project-2-0-39x7.onrender.com",
    status: "Live",
  },
  {
    title: "Signal Analyser (FPGA)",
    description:
      "Real-time FFT signal analyser implemented in Verilog on an Artix-7 FPGA. Outputs to a VGA display.",
    tags: ["FPGA", "Verilog", "DSP", "VGA"],
    github: "https://github.com/69series",
    demo: null,
    status: "In Progress",
  },
];

// ── Status badge color map ───────────────────────────────────────────────────

const statusColor = {
  Live: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  Complete: { color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.25)" },
  "In Progress": { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
};

function StatusBadge({ status }) {
  const s = statusColor[status] || statusColor["Complete"];
  return (
    <span
      className={styles.badge}
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {status === "Live" && <span className={styles.badgeDot} style={{ background: s.color }} />}
      {status}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Projects() {
  return (
    <PageShell>
      {(user) => (
        <div className={styles.page}>

          {/* ── PAGE HEADER ── */}
          <div className={styles.header}>
            <h1 className={styles.heading}>Projects</h1>
            <p className={styles.subheading}>
              Things I've built — hardware, firmware, and full-stack.
            </p>
          </div>

          {/* ── FEATURED ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Featured
            </h2>

            <div className={styles.featuredCard}>
              <div className={styles.featuredGlow} aria-hidden="true" />

              <div className={styles.featuredTop}>
                <StatusBadge status={featured.status} />
                <div className={styles.featuredLinks}>
                  {featured.github && (
                    <a href={featured.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      GitHub ↗
                    </a>
                  )}
                  {featured.demo && (
                    <a href={featured.demo} target="_blank" rel="noopener noreferrer" className={styles.linkDemo}>
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>

              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <p className={styles.featuredDesc}>{featured.description}</p>

              <div className={styles.tags}>
                {featured.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </section>

          {/* ── GRID ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              All Projects
            </h2>

            <div className={styles.grid}>
              {projects.map((project, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardTop}>
                    <StatusBadge status={project.status} />
                    <div className={styles.cardLinks}>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                          GitHub ↗
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.linkDemo}>
                          Demo ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardDesc}>{project.description}</p>

                  <div className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}
    </PageShell>
  );
}