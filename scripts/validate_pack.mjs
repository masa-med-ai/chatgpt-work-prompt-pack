import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || absolute.includes("legacy-claude-assets")) return [];
      return walk(absolute);
    }
    return [absolute];
  });
}

function privacyText(absolute) {
  const extension = path.extname(absolute).toLowerCase();
  const archiveExtensions = new Set([".docx", ".xlsx", ".pptx"]);
  if (archiveExtensions.has(extension)) {
    const unpacked = spawnSync("unzip", ["-p", absolute], {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
    if (unpacked.error || unpacked.status !== 0) {
      errors.push(`Could not inspect Office archive: ${path.relative(root, absolute)}`);
      return "";
    }
    return unpacked.stdout;
  }

  return fs.readFileSync(absolute).toString("utf8");
}

const start = read("00_START_ここから.md");
const moduleReferences = [...start.matchAll(/`((?:0[1-9]|1[0-2])_[^`]+\.md)`/g)].map(
  (match) => match[1],
);

if (moduleReferences.length !== 12) {
  errors.push(`00_START must reference 12 Level files; found ${moduleReferences.length}.`);
}

for (const reference of moduleReferences) {
  if (!fs.existsSync(path.join(root, reference))) {
    errors.push(`Missing Level file referenced by 00_START: ${reference}`);
  }
}

const requiredFiles = [
  "AGENTS.md",
  "CAPABILITY_MATRIX.md",
  "FAQ_つまずいたら.md",
  "samples/cade_reference_verification_demo.md",
  ".agents/skills/pubmed-evidence-discovery/SKILL.md",
  ".agents/skills/pubmed-reference-verifier/SKILL.md",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}

const bannedPatterns = [
  ["present_files", /\bpresent_files\b/],
  ["AskUserQuestion", /\bAskUserQuestion\b/],
  ["Save skill", /Save skill/],
  ["CLAUDE.md", /CLAUDE\.md/],
  ["Claude Code tab", /Codeタブ/],
  ["Anthropic loop", /\/loop\b/],
  ["Anthropic schedule command", /\/schedule\b/],
];

const privacyPatterns = [
  ["email address", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  [
    "personal computer path",
    /(?:\/Users\/|\/home\/[^/\s]+\/|[A-Z]:\\Users\\|file:\/\/\/(?:Users|home)\/|\/private\/var\/folders\/)/i,
  ],
];

for (const absolute of walk(root).filter((file) => file.endsWith(".md"))) {
  const text = fs.readFileSync(absolute, "utf8");
  for (const [label, pattern] of bannedPatterns) {
    if (pattern.test(text)) {
      errors.push(`${label} remains in ${path.relative(root, absolute)}`);
    }
  }
}

for (const absolute of walk(root)) {
  const content = privacyText(absolute);
  for (const [label, pattern] of privacyPatterns) {
    if (pattern.test(content)) {
      errors.push(`${label} found in ${path.relative(root, absolute)}`);
    }
  }
}

const skillRoot = path.join(root, ".agents", "skills");
for (const entry of fs.readdirSync(skillRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillPath = path.join(skillRoot, entry.name, "SKILL.md");
  const metadataPath = path.join(skillRoot, entry.name, "agents", "openai.yaml");
  if (!fs.existsSync(skillPath)) {
    errors.push(`Skill ${entry.name} has no SKILL.md.`);
    continue;
  }
  const skill = fs.readFileSync(skillPath, "utf8");
  const name = skill.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = skill.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== entry.name) errors.push(`Skill directory/name mismatch: ${entry.name} / ${name}`);
  if (!description) errors.push(`Skill ${entry.name} has no description.`);
  if (!fs.existsSync(metadataPath)) {
    errors.push(`Skill ${entry.name} has no agents/openai.yaml.`);
  } else if (!fs.readFileSync(metadataPath, "utf8").includes(`$${entry.name}`)) {
    errors.push(`Skill ${entry.name} default_prompt does not mention $${entry.name}.`);
  }
}

if (!read(".gitignore").split(/\r?\n/).includes("workshop_output/")) {
  errors.push(".gitignore must exclude workshop_output/.");
}

const trackedOutputs = spawnSync("git", ["ls-files", "workshop_output"], {
  cwd: root,
  encoding: "utf8",
});
if (trackedOutputs.status !== 0) {
  errors.push("Could not inspect tracked workshop_output files.");
} else if (trackedOutputs.stdout.trim()) {
  errors.push("workshop_output contains tracked files.");
}

const commitAuthors = spawnSync("git", ["log", "--format=%ae"], {
  cwd: root,
  encoding: "utf8",
});
if (commitAuthors.status !== 0) {
  errors.push("Could not inspect commit author privacy.");
} else {
  const githubNoreply = ["noreply", "github.com"].join("@");
  const unsafeAuthors = commitAuthors.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(
      (email) =>
        !email.endsWith("@users.noreply.github.com") && email !== githubNoreply,
    );
  if (unsafeAuthors.length) {
    errors.push("Commit history contains a non-noreply author email.");
  }
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Prompt Pack validation passed: ${moduleReferences.length} Levels, all Skills valid.`);
