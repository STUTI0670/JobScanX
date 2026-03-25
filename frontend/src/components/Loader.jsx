import React from "react";
import styles from "./Loader.module.css";

export default function Loader({ step }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rings}>
        <div className={`${styles.ring} ${styles.ring1}`} />
        <div className={`${styles.ring} ${styles.ring2}`} />
        <div className={`${styles.ring} ${styles.ring3}`} />
        <div className={styles.dot} />
      </div>
      <p className={styles.title}>SCANNING FOR SCAM SIGNALS...</p>
      {step && <p className={styles.step}>{step}</p>}
    </div>
  );
}
