import { useState } from "react";

export function useAnalyze() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState("");

  const STEPS = [
    "Parsing content patterns…",
    "Evaluating tone & urgency…",
    "Scoring risk indicators…",
    "Building trust breakdown…",
    "Generating final advice…",
  ];

  async function analyze({ message, domain, reportCount }) {
    setError(null);
    setResult(null);
    setLoading(true);

    let stepIndex = 0;
    setLoadingStep(STEPS[0]);
    const stepTimer = setInterval(() => {
      stepIndex = (stepIndex + 1) % STEPS.length;
      setLoadingStep(STEPS[stepIndex]);
    }, 900);

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, domain, reportCount }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Analysis failed. Please try again.");
      }

      setResult(json.data);
    } catch (err) {
      setError(err.message || "Network error. Is the backend running?");
    } finally {
      clearInterval(stepTimer);
      setLoadingStep("");
      setLoading(false);
    }
  }

  return { result, loading, error, loadingStep, analyze };
}
