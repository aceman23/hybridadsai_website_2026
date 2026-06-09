-- Revoke SELECT from anon to hide tables from public GraphQL schema
REVOKE SELECT ON public.aps_reports FROM anon;
REVOKE SELECT ON public.chat_messages FROM anon;
REVOKE SELECT ON public.chat_sessions FROM anon;
REVOKE SELECT ON public.demo_interactions FROM anon;
REVOKE SELECT ON public.waitlist FROM anon;

-- Revoke SELECT from authenticated to hide tables from signed-in GraphQL schema
REVOKE SELECT ON public.aps_reports FROM authenticated;
REVOKE SELECT ON public.chat_messages FROM authenticated;
REVOKE SELECT ON public.chat_sessions FROM authenticated;
REVOKE SELECT ON public.demo_interactions FROM authenticated;
REVOKE SELECT ON public.waitlist FROM authenticated;
