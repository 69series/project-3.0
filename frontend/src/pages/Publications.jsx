import PageShell from "../components/PageShell";
import styles from "./Publications.module.css";

// ── Hardcoded data ──────────────────────────────────────────────────────────

const conferences = [
  {
    title: "Low-Power BLDC Motor Control Using FOC on STM32",
    conference: "IEEE International Conference on Embedded Systems",
    location: "New Delhi, India",
    date: "March 2024",
    type: "Oral Presentation",
    abstract:
      "This paper presents an efficient Field-Oriented Control implementation for brushless DC motors using the STM32F4 microcontroller. The approach reduces power consumption by 28% compared to conventional trapezoidal control, with real-time torque response under 2ms.",
    doi: "https://doi.org/10.1109/example",
    pdf: null,
  },
  {
    title: "MQTT-Based IoT Gateway Architecture for Smart Home Automation",
    conference: "National Conference on IoT & Embedded Intelligence (NCIEI)",
    location: "Bangalore, India",
    date: "November 2023",
    type: "Poster Presentation",
    abstract:
      "A scalable IoT gateway design using ESP32 and MQTT over TLS for secure local home automation. The architecture eliminates cloud dependency while maintaining sub-100ms response latency across all connected nodes.",
    doi: null,
    pdf: "/resume.pdf",
  },
  {
    title: "Indoor Asset Tracking Using BLE Beacon Trilateration",
    conference: "International Symposium on Wireless & Mobile Computing",
    location: "Chennai, India",
    date: "July 2023",
    type: "Oral Presentation",
    abstract:
      "Presents a cost-effective indoor positioning system using nRF52840 BLE beacons and RSSI-based trilateration. Achieved mean positioning error of 1.2m in a 400m² test environment without any infrastructure modification.",
    doi: "https://doi.org/10.1109/example2",
    pdf: null,
  },
];

// ── Type badge color map ─────────────────────────────────────────────────────

const typeColor = {
  "Oral Presentation": { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  "Poster Presentation": { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
};

function TypeBadge({ type }) {
  const s = typeColor[type] || typeColor["Oral Presentation"];
  return (
    <span
      className={styles.badge}
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {type}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Publications() {
  return (
    <PageShell>
      {(user) => (
        <div className={styles.page}>

          {/* ── PAGE HEADER ── */}
          <div className={styles.header}>
            <h1 className={styles.heading}>Works & Publications</h1>
            <p className={styles.subheading}>
              Conference presentations, papers, and research work.
            </p>
          </div>

          {/* ── STATS ROW ── */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{conferences.length}</span>
              <span className={styles.statLabel}>Conferences</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>
                {conferences.filter(c => c.type === "Oral Presentation").length}
              </span>
              <span className={styles.statLabel}>Oral Presentations</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>
                {conferences.filter(c => c.type === "Poster Presentation").length}
              </span>
              <span className={styles.statLabel}>Poster Presentations</span>
            </div>
          </div>

          {/* ── CONFERENCE LIST ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Conference Presentations
            </h2>

            <div className={styles.list}>
              {conferences.map((item, i) => (
                <div key={i} className={styles.card}>

                  <div className={styles.cardLeft}>
                    <span className={styles.cardIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <TypeBadge type={item.type} />
                      <span className={styles.cardDate}>{item.date}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{item.title}</h3>

                    <div className={styles.cardMeta}>
                      <span className={styles.cardConference}>{item.conference}</span>
                      <span className={styles.cardSep}>·</span>
                      <span className={styles.cardLocation}>{item.location}</span>
                    </div>

                    <p className={styles.cardAbstract}>{item.abstract}</p>

                    <div className={styles.cardLinks}>
                      {item.doi && (
                          <a
                          href={item.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkDoi}
                        >
                          DOI &#8599;
                        </a>
                      )}
                      {item.pdf && (
                          <a
                          href={item.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkPdf}
                        >
                         PDF &#8599;
                        </a>
                      )}
                    </div>
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