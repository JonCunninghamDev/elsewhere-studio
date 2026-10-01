import fs from "node:fs";

export const DEFAULT_BROWSER_CANDIDATES = [
  process.env.CHROME_PATH,
  "/snap/bin/chromium",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
].filter(Boolean);

export const findInstalledBrowser = (
  candidates = DEFAULT_BROWSER_CANDIDATES,
  exists = fs.existsSync,
) => candidates.find((candidate) => exists(candidate)) ?? null;
