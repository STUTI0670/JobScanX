import React from "react";
import ScoreMeter from "./ScoreMeter";
import TrustBar from "./TrustBar";
import styles from "./ResultPanel.module.css";

function getRiskClass(risk) {
  if (!risk) return "suspicious";
  const r = risk.toLowerCase();
  if (r === "low") return "safe";
  if (r === "high") return "scam";
  return "suspicious";
}

function getVerdictIcon(decision) {
  if (!decision) return "⚠️";
  if (decision === "Apply") return "✅";
  if (decision === "Avoid") return "🚫";
  return "⚠️";
}

function getDecisionClass(decision) {
  if (!decision) return "caution";
  if (decision === "Apply") return "apply";
  if (decision === "Avoid") return "avoid";
  return "caution";
}

const TRUST_LABELS = {
  salary_risk: "Salary Risk",
  tone_risk: "Tone / Urgency",
  domain_risk: "Domain Risk",
  payment_risk: "Payment Risk",
};

export default function ResultPanel({ result }) {
  if (!result) return null;

  const {
    scam_score,
    risk_level,
    summary,
    reasons = [],
    highlighted_phrases = [],
    trust_breakdown = {},
    final_advice = {},
  } = result;

  const riskClass = getRiskClass(risk_level);
  const decision = final_advice.decision || "Proceed with Caution";
  const steps = final_advice.steps || [];
  const decisionClass = getDecisionClass(decision);
  const verdictIcon = getVerdictIcon(decision);

  return (
    <div className={styles.wrapper}>

      {/* ── Verdict Banner ── */}
      <div className={`${styles.banner} ${styles[riskClass]}`}>
        <span className={styles.bannerIcon}>{verdictIcon}</span>
        <div>
          <div className={styles.bannerTitle}>{decision.toUpperCase()}</div>
          <div className={styles.bannerSummary}>{summary}</div>
        </div>
      </div>

      {/* ── Score + Trust Breakdown ── */}
      <div className={styles.scoreRow}>
        <ScoreMeter score={scam_score} riskLevel={risk_level} />

        <div className={styles.trustCard}>
          <div className={styles.sectionLabel}>
            <span className={`${styles.labelDot} ${styles.orange}`} />
            Trust Breakdown
          </div>
          {Object.entries(TRUST_LABELS).map(([key, label]) => (
            <TrustBar
              key={key}
              label={label}
              value={trust_breakdown[key] || 0}
            />
          ))}
        </div>
      </div>

      {/* ── Red Flags + Phrases ── */}
      <div className={styles.twoCol}>
        <div className={styles.card}>
          <div className={styles.sectionLabel}>
            <span className={`${styles.labelDot} ${styles.red}`} />
            Red Flags Detected
          </div>
          {reasons.length > 0 ? (
            reasons.map((r, i) => (
              <div key={i} className={styles.reasonItem}>
                <span className={styles.arrow}>→</span>
                {r}
              </div>
            ))
          ) : (
            <span className={styles.empty}>No specific red flags found.</span>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.sectionLabel}>
            <span className={`${styles.labelDot} ${styles.orange}`} />
            Suspicious Phrases
          </div>
          {highlighted_phrases.length > 0 ? (
            <div className={styles.phrases}>
              {highlighted_phrases.map((p, i) => (
                <span key={i} className={styles.phraseTag}>
                  "{p}"
                </span>
              ))}
            </div>
          ) : (
            <span className={styles.empty}>No suspicious phrases detected.</span>
          )}
        </div>
      </div>

      {/* ── Final Advice ── */}
      <div className={styles.adviceCard}>
        <div className={styles.sectionLabel}>
          <span className={`${styles.labelDot} ${styles.green}`} />
          Final Advice
        </div>
        <div className={`${styles.decisionBadge} ${styles[decisionClass]}`}>
          {verdictIcon} {decision}
        </div>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
