/**
 * ISO instant, in UTC, of the last edit to the datasets in this directory.
 * Bump it with every change to `devices.ts` or `rumors.ts`; the header shows
 * it as the "last updated" time (in the visitor's time zone, UTC without
 * JavaScript) and the rumors section as its "as of" date.
 */
export const DATA_UPDATED_AT = '2026-09-09T19:14:00Z';

/** Calendar day (YYYY-MM-DD, UTC) of `DATA_UPDATED_AT`, for date comparisons. */
export const DATA_UPDATED_ON = DATA_UPDATED_AT.slice(0, 10);
