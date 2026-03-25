import React, { useEffect, useRef, useState } from "react";
import styles from "./TrustBar.module.css";

function getColor(val) {
  if (val >= 70) return "#e8445a";
  if (val >= 40) return "#f59e0b";
  return "#22c55e";
}

export default function TrustBar({ label, value }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={styles.row} ref={ref}>
      <div className={styles.meta}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} style={{ color: getColor(value) }}>
          {value}%
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${width}%`,
            background: getColor(value),
            transition: "width 1s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}
