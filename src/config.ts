export const site = {
  url: "https://escapetoluma.com",
  name: "Spark: Escape to Luma",
  brand: "SPARK",
  productLine: "ESCAPE TO LUMA",
  tagline: "A small spark. A long way home.",
  publisher: "n17 Apps",
  email: "game@escapetoluma.com",
  bundleId: "com.escapetoluma.spark",
  analyticsMeasurementId: "G-10RVZ0MKX7",
  appStoreUrl: "https://apps.apple.com/us/app/spark-escape-to-luma/id6816341260",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.escapetoluma.spark",
  removeAdsProductId: "aperture_remove_ads",
  saveKey: "ball-game-cs.save.v1",
  updated: "October 8, 2026",
} as const;

/** Directory routes are served with a trailing slash. The slashless URL redirects. */
export function pagePath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function pageUrl(pathname: string): string {
  return new URL(pagePath(pathname), site.url).toString();
}

/** Store-build ad pacing. Matches the game's interstitial config. */
export const ads = {
  runsBeforeFirstInterstitial: 3,
  runsBetweenInterstitials: 2,
  secondsBetweenInterstitials: 180,
} as const;
