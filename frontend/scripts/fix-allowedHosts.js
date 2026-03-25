/**
 * Patches react-scripts' webpack dev server config to fix:
 * "options.allowedHosts[0] should be a non-empty string"
 * This is a known bug in react-scripts 5 on Windows.
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-scripts",
  "config",
  "webpackDevServer.config.js"
);

if (!fs.existsSync(filePath)) {
  console.log("[fix-allowedHosts] node_modules not found yet, skipping.");
  process.exit(0);
}

let content = fs.readFileSync(filePath, "utf8");

// Check if already patched
if (content.includes("// [PATCHED: allowedHosts fix]")) {
  console.log("[fix-allowedHosts] Already patched, skipping.");
  process.exit(0);
}

// The bug: allowedHosts is set to [undefined] when HOST env var is not set
// Fix: replace the allowedHosts array assignment to filter out falsy values
const bugPattern = /allowedHosts:\s*\[\s*process\.env\.DANGEROUSLY_DISABLE_HOST_CHECK\s*===\s*['"]true['"]\s*\?\s*['"]all['"]\s*:\s*['"](.*?)['"]\s*\]/s;

if (bugPattern.test(content)) {
  content = content.replace(bugPattern, `allowedHosts: // [PATCHED: allowedHosts fix]
      process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true'
        ? 'all'
        : [process.env.HOST || 'localhost'].filter(Boolean)`);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("[fix-allowedHosts] Patch applied successfully.");
} else {
  // Broader patch: find and neutralise any empty-string allowedHosts entry
  const broaderPattern = /(allowedHosts\s*:\s*\[)([^\]]*?)(\])/g;
  const patched = content.replace(broaderPattern, (match, open, inner, close) => {
    // Replace empty strings or undefined entries
    const fixed = inner
      .split(",")
      .map(s => s.trim())
      .filter(s => s && s !== "''" && s !== '""' && s !== "undefined")
      .join(", ");
    if (fixed !== inner.trim()) {
      return `${open}${fixed || "'localhost'"}${close} // [PATCHED: allowedHosts fix]`;
    }
    return match;
  });

  if (patched !== content) {
    fs.writeFileSync(filePath, patched, "utf8");
    console.log("[fix-allowedHosts] Broad patch applied successfully.");
  } else {
    console.log("[fix-allowedHosts] Pattern not found — may already be fixed or different version.");
  }
}
