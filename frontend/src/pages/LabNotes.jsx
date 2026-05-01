import PageShell from "../components/PageShell";
import styles from "./LabNotes.module.css";

// ── Hardcoded data ──────────────────────────────────────────────────────────

const notes = [
  {
    id: 1,
    title: "Why I stopped using HAL and went bare-metal on STM32",
    date: "April 12, 2024",
    tags: ["STM32", "Embedded C", "Firmware"],
    excerpt:
      "HAL is great for prototyping but when you need deterministic timing and minimal overhead, there's no substitute for writing directly to registers. Here's what I learned after ditching HAL on a motor control project.",
  },
  {
    id: 2,
    title: "MQTT vs WebSockets — which one for real-time IoT?",
    date: "March 3, 2024",
    tags: ["IoT", "MQTT", "WebSockets", "Node.js"],
    excerpt:
      "Both protocols solve real-time communication but in very different ways. After running both in production on my smart home project, here's my honest comparison — latency, reliability, and when to pick which.",
  },
  {
    id: 3,
    title: "Debugging a ghost oscillation on a 6-layer PCB",
    date: "January 28, 2024",
    tags: ["PCB Design", "EMI", "KiCad", "Debugging"],
    excerpt:
      "Spent three days chasing a 47MHz oscillation that only appeared when the LoRa module was transmitting. Turned out to be a ground plane split I introduced trying to separate analog and digital domains. Lesson learned.",
  },
  {
    id: 4,
    title: "Getting Rust to run on a Cortex-M4 — a beginner's pain diary",
    date: "December 10, 2023",
    tags: ["Rust", "Embedded", "Cortex-M4"],
    excerpt:
      "Everyone says Rust is the future of embedded. Nobody warns you about the toolchain setup. This is my honest experience getting a blinking LED in Rust on an STM32F4 — spoiler: it took way longer than it should have.",
  },
  {
    id: 5,
    title: "FFT on an FPGA — from theory to actual Verilog",
    date: "October 5, 2023",
    tags: ["FPGA", "Verilog", "DSP", "FFT"],
    excerpt:
      "Implementing an FFT in software is one thing. Doing it in hardware where everything runs in parallel is a completely different mindset. Here's how I approached it, what broke, and what the output looked like on a VGA display.",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function LabNotes() {
  return (
    <PageShell>
      {(user) => (
        <div className={styles.page}>

          {/* ── PAGE HEADER ── */}
          <div className={styles.header}>
            <h1 className={styles.heading}>Lab Notes</h1>
            <p className={styles.subheading}>
              Engineering journal — experiments, findings, and rabbit holes.
            </p>
          </div>

          {/* ── NOTES LIST ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              All Entries
            </h2>

            <div className={styles.list}>
              {notes.map((note) => (
                <div key={note.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardDate}>{note.date}</span>
                    <div className={styles.tags}>
                      {note.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{note.title}</h3>
                  <p className={styles.cardExcerpt}>{note.excerpt}</p>

                  <span className={styles.readMore}>Read more &#8599;</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}
    </PageShell>
  );
}