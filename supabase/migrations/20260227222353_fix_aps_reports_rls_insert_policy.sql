/*
  # Fix APS Reports RLS Insert Policy

  ## Summary
  Replaces the unrestricted INSERT policy on `aps_reports` with a constrained version
  that validates the data being inserted, eliminating the always-true WITH CHECK clause.

  ## Changes
  - `aps_reports` table
    - Drops the overly permissive "Anyone can insert a report" policy (WITH CHECK (true))
    - Adds a new "Anyone can insert a valid report" policy that enforces:
        * `url` must not be null or empty
        * `overall_score` must be between 0 and 100 (valid score range)

  ## Security
  - The new INSERT policy is no longer always-true
  - Anon and authenticated users can still submit reports, but only valid ones
  - Prevents junk/malicious rows with empty URLs or out-of-range scores from being inserted
*/

DROP POLICY IF EXISTS "Anyone can insert a report" ON aps_reports;

CREATE POLICY "Anyone can insert a valid report"
  ON aps_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    url IS NOT NULL
    AND url <> ''
    AND overall_score >= 0
    AND overall_score <= 100
  );
