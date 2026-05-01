import { useState } from "react";
import PageShell from "../components/PageShell";
import styles from "./Contact.module.css";

// ── Social links ────────────────────────────────────────────────────────────

const socials = [
  {
    label: "GitHub",
    handle: "@69series",
    url: "https://github.com/69series",
    icon: "⌥",
  },
  {
    label: "LinkedIn",
    handle: "Alex Alderson",
    url: "https://linkedin.com",
    icon: "◈",
  },
  {
    label: "Email",
    handle: "alex@alderson.dev",
    url: "mailto:alex@alderson.dev",
    icon: "◉",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder — wire to backend later
    setSent(true);
  };

  return (
    <PageShell>
      {(user) => (
        <div className={styles.page}>

          {/* ── PAGE HEADER ── */}
          <div className={styles.header}>
            <h1 className={styles.heading}>Contact</h1>
            <p className={styles.subheading}>
              Got a project, collab, or just want to talk hardware? I'm listening.
            </p>
          </div>

          <div className={styles.grid}>

            {/* ── CONTACT FORM ── */}
            <div className={styles.formWrap}>
              {sent ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>✦</span>
                  <p className={styles.successTitle}>Message sent.</p>
                  <p className={styles.successSub}>I'll get back to you soon.</p>
                </div>
              ) : (
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Message</label>
                    <textarea
                      className={styles.textarea}
                      name="message"
                      placeholder="What's on your mind..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                  >
                    Send Message &#8599;
                  </button>
                </div>
              )}
            </div>

            {/* ── SOCIALS ── */}
            <div className={styles.sidebar}>
              <h2 className={styles.sectionLabel}>
                <span className={styles.labelDot} />
                Find me on
              </h2>

              <div className={styles.socialList}>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialCard}
                  >
                    <span className={styles.socialIcon}>{s.icon}</span>
                    <div>
                      <p className={styles.socialLabel}>{s.label}</p>
                      <p className={styles.socialHandle}>{s.handle}</p>
                    </div>
                    <span className={styles.socialArrow}>&#8599;</span>
                  </a>
                ))}
              </div>

              <div className={styles.availBox}>
                <span className={styles.availDot} />
                <div>
                  <p className={styles.availTitle}>Available for work</p>
                  <p className={styles.availSub}>Open to internships, freelance, and collabs.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </PageShell>
  );
}