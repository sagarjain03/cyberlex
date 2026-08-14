/**
 * ISO 3166-1 numeric codes, kept separate from `lib/map/world.ts` so that data
 * files can reference them without pulling in d3-geo and the topojson dataset.
 */

/** The 27 EU member states, for rendering the bloc as a group. */
export const EU_MEMBER_IDS = [
  "040", // Austria
  "056", // Belgium
  "100", // Bulgaria
  "191", // Croatia
  "196", // Cyprus
  "203", // Czechia
  "208", // Denmark
  "233", // Estonia
  "246", // Finland
  "250", // France
  "276", // Germany
  "300", // Greece
  "348", // Hungary
  "372", // Ireland
  "380", // Italy
  "428", // Latvia
  "440", // Lithuania
  "442", // Luxembourg
  "470", // Malta
  "528", // Netherlands
  "616", // Poland
  "620", // Portugal
  "642", // Romania
  "703", // Slovakia
  "705", // Slovenia
  "724", // Spain
  "752", // Sweden
];
