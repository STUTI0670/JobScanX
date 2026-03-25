import React from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import Loader from "./components/Loader";
import ResultPanel from "./components/ResultPanel";
import { useAnalyze } from "./hooks/useAnalyze";
import styles from "./App.module.css";

export default function App() {
  const { result, loading, error, loadingStep, analyze } = useAnalyze();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Header />

        <InputForm onSubmit={analyze} loading={loading} />

        {loading && <Loader step={loadingStep} />}

        {error && !loading && (
          <div className={styles.errorBanner}>
            <span>⚠</span> {error}
          </div>
        )}

        {result && !loading && <ResultPanel result={result} />}

        <footer className={styles.footer}>
          ScamRadar · Always verify independently
          before sharing personal or financial information.
        </footer>
      </div>
    </div>
  );
}
