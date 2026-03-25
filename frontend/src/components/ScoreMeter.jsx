import React, { useEffect, useState } from "react";
import styles from "./ScoreMeter.module.css";

function getRiskClass(risk) {
  if (!risk) return "suspicious";
  const r = risk.toLowerCase();
  if (r === "low") return "safe";
  if (r === "high") return "scam";
  return "suspicious";
}

export default function ScoreMeter({ score, riskLevel }) {
  const [width, setWidth] = useState(0);
  const cls = getRiskClass(riskLevel);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className={styles.card}>
      <div className={styles.sectionLabel}>
        <span className={`${styles.dot} ${styles[cls]}`} />
        Scam Score
      </div>
      <div className={styles.scoreRow}>
        <span className={`${styles.scoreNum} ${styles[cls]}`}>{score}</span>
        <span className={styles.outOf}>/100</span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[cls]}`}
          style={{
            width: `${width}%`,
            transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
      <div className={styles.ticks}>
        <span>0 · Safe</span>
        <span>50 · Suspicious</span>
        <span>100 · Scam</span>
      </div>
    </div>
  );
}
