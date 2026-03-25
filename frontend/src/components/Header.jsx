import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.badge}>
        <span className={styles.dot} />
        AI-Powered Detection
        <span className={styles.vtag}></span>
      </div>
      <h1 className={styles.title}>
        Scam<span>Radar</span>
      </h1>
      <p className={styles.subtitle}>
        Analyze job offers &amp; recruiter messages for scam signals
      </p>
    </header>
  );
}
