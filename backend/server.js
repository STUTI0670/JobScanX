require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ─── Root (fix "Cannot GET /") ────────────────────────────
app.get("/", (req, res) => {
  res.send("ScamRadar Backend Running 🚀");
});

// ─── Health check ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "ScamRadar API is running" });
});

// ─── Scam Analysis Route ──────────────────────────────────
app.post("/analyze", async (req, res) => {
  const { message, domain, reportCount } = req.body;

  if (!message || message.trim().length < 20) {
    return res.status(400).json({
      error: "Message must be at least 20 characters.",
    });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "OpenRouter API key missing.",
    });
  }

  let context = `Job message:\n${message}`;
  if (domain) context += `\nDomain: ${domain}`;
  if (reportCount) context += `\nReports: ${reportCount}`;

  const prompt = `
Return ONLY valid JSON:

{
  "scam_score": number,
  "risk_level": "Low" | "Medium" | "High",
  "summary": "string",
  "reasons": ["string"],
  "highlighted_phrases": ["string"],
  "trust_breakdown": {
    "salary_risk": number,
    "tone_risk": number,
    "domain_risk": number,
    "payment_risk": number
  },
  "final_advice": {
    "decision": "Apply" | "Avoid" | "Proceed with Caution",
    "steps": ["string"]
  }
}

Analyze:
${context}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // ✅ stable
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    let rawText = response.data.choices?.[0]?.message?.content || "";

    if (!rawText) {
      throw new Error("Empty AI response");
    }

    // Clean response
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("AI response not valid JSON");
      }
      result = JSON.parse(match[0]);
    }

    // Safety clamp
    result.scam_score = Math.min(100, Math.max(0, result.scam_score || 0));

    return res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});
app.get("/test", (req, res) => {
  res.json({ working: true });
});
// ─── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛡️ Backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Analyze: POST http://localhost:${PORT}/analyze\n`);
});