import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const forbiddenTrackedFiles = [
  /^\.env$/,
  /^\.env\.(?!example$).+/,
  /(?:^|\/)(?:credentials|service-account)[^/]*\.json$/i,
  /\.(?:pem|p12|pfx)$/i,
];

const secretPatterns = [
  { name: "Supabase secret key", regex: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g },
  {
    name: "Supabase service-role JWT",
    regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/g,
  },
  { name: "private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: "GitHub token", regex: /\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g },
  { name: "OpenAI-style secret key", regex: /\bsk-[A-Za-z0-9_-]{30,}\b/g },
  { name: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/g },
];

const guardFiles = new Set(["scripts/security-check.mjs"]);
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const findings = [];

for (const file of files) {
  if (forbiddenTrackedFiles.some((pattern) => pattern.test(file))) {
    findings.push(`${file}: sensitive file must not be tracked`);
  }

  if (guardFiles.has(file)) continue;

  let size;
  try {
    size = statSync(file).size;
  } catch {
    continue;
  }
  if (size > 2_000_000) continue;

  let buffer;
  try {
    buffer = readFileSync(file);
  } catch {
    continue;
  }
  if (buffer.includes(0)) continue;

  const text = buffer.toString("utf8");
  for (const { name, regex } of secretPatterns) {
    regex.lastIndex = 0;
    if (regex.test(text)) findings.push(`${file}: possible ${name}`);
  }
}

if (findings.length > 0) {
  console.error("Security check failed:\n" + findings.map((finding) => `- ${finding}`).join("\n"));
  process.exit(1);
}

console.log(`Security check passed (${files.length} tracked files scanned).`);
