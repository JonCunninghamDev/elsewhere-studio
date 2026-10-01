export const DEFAULT_BROWSER_CANDIDATES: string[];

export function findInstalledBrowser(
  candidates?: string[],
  exists?: (candidate: string) => boolean,
): string | null;
