/**
 * The data layer's public surface. Pages and components import from here and
 * nowhere else — an ESLint rule blocks `@/data/*` outside this directory.
 *
 * Every function is async even though v1 records are static, so swapping the
 * bodies for a database or HTTP client in v2 touches only these files.
 * docs/architecture.md §2.1.
 */
export * from "./jurisdictions";
export * from "./laws";
export * from "./comparisons";
export * from "./drafts";
export * from "./ai-crimes";
export * from "./sources";
export * from "./stats";
