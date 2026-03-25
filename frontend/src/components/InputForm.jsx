import React, { useState } from "react";
import styles from "./InputForm.module.css";

const EXAMPLES = [
  {
    label: "🚨 High Risk",
    message:
      "Congratulations! You have been selected for a remote job ₹80,000/month. No interview required. Pay ₹999 registration fee to confirm your seat. Limited slots — apply NOW! Contact: hr.jobs2024@gmail.com",
    domain: "hr.jobs2024@gmail.com",
    reports: "14",
  },
  {
    label: "⚠️ Medium Risk",
    message:
      "Exciting WFH opportunity! Earn $5000/week doing simple data entry. No experience needed. Reply on WhatsApp — only today's applicants will be considered!",
    domain: "",
    reports: "",
  },
  {
    label: "✅ Likely Safe",
    message:
      "Hi, I'm a recruiter at Google. We found your LinkedIn profile and would like to schedule a technical interview for a Senior SWE role. Compensation $130k–$160k + equity. Verify me on LinkedIn.",
    domain: "google.com",
    reports: "0",
  },
];

export default function InputForm({ onSubmit, loading }) {
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("");
  const [reportCount, setReportCount] = useState("");
  const [formError, setFormError] = useState("");

  function loadExample(ex) {
    setMessage(ex.message);
    setDomain(ex.domain);
    setReportCount(ex.reports);
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!message.trim() || message.trim().length < 20) {
      setFormError("Please paste a job offer or message (at least 20 characters).");
      return;
    }
    onSubmit({ message, domain, reportCount });
  }

  function handleClear() {
    setMessage("");
    setDomain("");
    setReportCount("");
    setFormError("");
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        {/* Main textarea */}
        <div className={styles.field}>
          <label className={styles.label}>Job offer or recruiter message</label>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste a job offer, recruiter email, WhatsApp message, or hiring communication here..."
            rows={7}
            disabled={loading}
          />
        </div>

        {/* Metadata row */}
        <div className={styles.metaRow}>
          <div className={styles.field}>
            <label className={styles.label}>Domain / Email (optional)</label>
            <input
              className={styles.input}
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. hr@jobs-portal.com or jobs-portal.com"
              disabled={loading}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Scam Reports (optional)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={reportCount}
              onChange={(e) => setReportCount(e.target.value)}
              placeholder="e.g. 12"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error */}
        {formError && <p className={styles.error}>⚠ {formError}</p>}

        {/* Actions */}
        <div className={styles.btnRow}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Analyzing...
              </>
            ) : (
              <>🔍 Analyze Now</>
            )}
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Examples */}
      <div className={styles.examples}>
        <p className={styles.examplesLabel}>Try an example</p>
        <div className={styles.examplesGrid}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className={styles.exampleChip}
              onClick={() => loadExample(ex)}
              disabled={loading}
              type="button"
            >
              <strong>{ex.label}</strong>
              <span>{ex.message.substring(0, 80)}…</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
