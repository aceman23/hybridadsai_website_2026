/*
# Revoke GraphQL schema visibility for content lab and GTM tables

## Changes
- Revoke SELECT from `authenticated` on 6 tables to hide them from the GraphQL introspection schema:
  - public.content_projects
  - public.content_sessions
  - public.content_sources
  - public.gtm_campaigns
  - public.gtm_customers
  - public.gtm_payments

## Security
- These tables already have RLS enabled with owner-scoped policies.
- Table-level SELECT grants let authenticated users discover table structure via GraphQL even if RLS blocks data access.
- Revoking removes them from the schema entirely.

## Notes
1. Data access is unchanged — RLS policies still govern row-level reads/writes.
2. This only affects GraphQL introspection visibility.
*/

REVOKE SELECT ON public.content_projects FROM authenticated;
REVOKE SELECT ON public.content_sessions FROM authenticated;
REVOKE SELECT ON public.content_sources FROM authenticated;
REVOKE SELECT ON public.gtm_campaigns FROM authenticated;
REVOKE SELECT ON public.gtm_customers FROM authenticated;
REVOKE SELECT ON public.gtm_payments FROM authenticated;
