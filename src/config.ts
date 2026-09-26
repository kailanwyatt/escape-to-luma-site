export const site = {
  name: "Spark: Escape to Luma",
  brand: "SPARK",
  productLine: "ESCAPE TO LUMA",
  tagline: "A small spark. A long way home.",
  publisher: "Kailan Wyatt",
  email: "info@suiteplugins.com",
  bundleId: "com.kurt.sparkescapetoluma",
  removeAdsProductId: "aperture_remove_ads",
  saveKey: "ball-game-cs.save.v1",
  updated: "September 21, 2026",
} as const;

/** Store-build ad pacing. Matches the game's interstitial config. */
export const ads = {
  runsBeforeFirstInterstitial: 3,
  runsBetweenInterstitials: 2,
  secondsBetweenInterstitials: 180,
} as const;
