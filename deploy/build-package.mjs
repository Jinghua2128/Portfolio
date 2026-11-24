#!/usr/bin/env node
/*
 * Builds the deployable Cloudflare Pages artifact from the explicit runtime allowlist.
 *
 * - The allowlist is read from deploy/package-cloudbase.ps1 (single source of truth).
 * - Firebase browser config is NOT committed. In CI it is generated from environment
 *   variables; locally it falls back to the ignored firebase-config.js file.
 * - The build fails loudly if a file is missing, the allowlist drifts, a local
 *   reference breaks, or the Firebase config cannot be produced.
 *
 * Usage: node deploy/build-package.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const recipePath = path.join(root, "deploy/package-cloudbase.ps1");

function fail(message) {
  console.error(`\nBUILD FAILED: ${message}\n`);
  process.exit(1);
}

function block(name) {
  const recipe = fs.readFileSync(recipePath, "utf8");
  const match = recipe.match(new RegExp("\\$" + name + "\\s*=\\s*@\\(([\\s\\S]*?)\\)"));
  if (!match) fail(`missing $${name} array in deploy/package-cloudbase.ps1`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const rootFiles = block("rootFiles");
const assetFiles = block("assetFiles");
const sideFiles = block("sideFiles").map((file) => `editorial-portfolio/${file}`);
const adminFiles = block("adminFiles").map((file) => `admin/${file}`);
const files = [...rootFiles, ...assetFiles, ...sideFiles, ...adminFiles];

if (files.length !== 50) fail(`expected 50 allowlisted files, found ${files.length}`);
if (new Set(files).size !== files.length) fail("duplicate entries in the deployment allowlist");

const configRelPaths = ["firebase-config.js", "editorial-portfolio/firebase-config.js"];
const requiredEnv = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

function listEnv(name) {
  return String(process.env[name] || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function generatedConfig() {
  const missing = requiredEnv.filter((name) => !process.env[name] || /YOUR_/i.test(process.env[name]));
  const admins = listEnv("FIREBASE_ADMIN_UIDS");
  if (missing.length) fail(`missing Firebase build secrets: ${missing.join(", ")}`);
  if (!admins.length) fail("missing FIREBASE_ADMIN_UIDS build secret");
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  };
  if (process.env.FIREBASE_DATABASE_URL) config.databaseURL = process.env.FIREBASE_DATABASE_URL;
  config.projectId = process.env.FIREBASE_PROJECT_ID;
  config.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  config.messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
  config.appId = process.env.FIREBASE_APP_ID;
  const body = Object.entries(config).map(([key, value]) => `    ${key}: ${JSON.stringify(value)}`).join(",\n");
  return `// Generated at build time from environment secrets; do not commit.\nconst firebaseConfig = {\n${body}\n};\n\nconst firebaseAvailable = typeof firebase !== "undefined"\n    && typeof firebase.initializeApp === "function"\n    && typeof firebase.auth === "function"\n    && typeof firebase.firestore === "function";\n\nif (firebaseAvailable) {\n    firebase.initializeApp(firebaseConfig);\n} else {\n    console.warn("Firebase SDK unavailable. Local portfolio content will remain available.");\n}\n\nconst auth = firebaseAvailable ? firebase.auth() : null;\nconst db = firebaseAvailable ? firebase.firestore() : null;\n\nconst ALLOW_ANY_SIGNED_IN_USER_TO_EDIT = false;\nconst ADMIN_EMAILS = ${JSON.stringify(listEnv("FIREBASE_ADMIN_EMAILS"))};\nconst ADMIN_UIDS = ${JSON.stringify(admins)};\n`;
}

function resolveConfig() {
  const envConfigured = requiredEnv.some((name) => process.env[name]);
  if (envConfigured) return { content: generatedConfig(), source: "environment secrets" };
  const localPath = path.join(root, "firebase-config.js");
  if (!fs.existsSync(localPath)) {
    fail("no Firebase config: set the FIREBASE_* build secrets, or restore the ignored firebase-config.js locally");
  }
  const content = fs.readFileSync(localPath, "utf8");
  if (/YOUR_/.test(content)) fail("local firebase-config.js still contains template placeholders");
  return { content, source: "local ignored firebase-config.js" };
}

fs.rmSync(dist, { recursive: true, force: true });
const config = resolveConfig();

for (const rel of files) {
  const destination = path.join(dist, rel);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (configRelPaths.includes(rel)) {
    fs.writeFileSync(destination, config.content);
    continue;
  }
  const source = path.join(root, rel);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) fail(`missing allowlisted file: ${rel}`);
  fs.copyFileSync(source, destination);
}

// The ignored/mixed-case media must survive with exact case.
for (const image of assetFiles) {
  if (!fs.existsSync(path.join(dist, image))) fail(`missing media in dist: ${image}`);
}

if (!fs.existsSync(path.join(dist, "index.html"))) fail("dist/index.html missing");

// Validate every local HTML reference and cross-page anchor inside dist.
let documents = 0;
let references = 0;
let anchors = 0;
for (const rel of files.filter((file) => file.endsWith(".html"))) {
  const source = fs.readFileSync(path.join(dist, rel), "utf8");
  documents += 1;
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) fail(`duplicate id in ${rel}`);
  const base = source.match(/<base\s+href="([^"]+)"/i)?.[1] || "";
  const directory = path.resolve(dist, path.dirname(rel), base);
  const withoutBase = source.replace(/<base\b[^>]*>/gi, "");
  for (const match of withoutBase.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
    const reference = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
    const pathname = reference.split(/[?#]/)[0];
    const target = path.relative(dist, path.resolve(directory, pathname));
    if (target.startsWith("..")) fail(`${rel} references outside dist: ${reference}`);
    if (!fs.existsSync(path.join(dist, target))) fail(`${rel} has a broken reference: ${target}`);
    references += 1;
    const fragment = reference.split("#")[1];
    if (fragment && target.endsWith(".html")) {
      const destination = fs.readFileSync(path.join(dist, target), "utf8");
      if (!destination.includes(`id="${fragment}"`)) fail(`missing anchor ${reference}`);
      anchors += 1;
    }
  }
}

const forbidden = ["README.md", "HANDOFF.md", "MAC-HANDOFF.md", "firestore.rules", "firebase.json", ".env", "package.json"];
for (const name of forbidden) {
  if (fs.existsSync(path.join(dist, name))) fail(`private/non-runtime file leaked into dist: ${name}`);
}

console.log(`PASS: ${files.length} files -> dist/`);
console.log(`PASS: ${documents} HTML documents, ${references} local references, ${anchors} cross-page anchors`);
console.log(`PASS: Firebase config from ${config.source}`);
console.log("Ready to deploy: dist/");
