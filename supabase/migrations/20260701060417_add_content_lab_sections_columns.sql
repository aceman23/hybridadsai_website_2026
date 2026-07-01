-- Add used_section_ids array to content_projects for section cycling
ALTER TABLE content_projects ADD COLUMN used_section_ids jsonb NOT NULL DEFAULT '[]';

-- Add sections jsonb to content_sources for extracted URL sections
ALTER TABLE content_sources ADD COLUMN sections jsonb NOT NULL DEFAULT '[]';

-- Add section_used and url_sections_used to content_sessions
ALTER TABLE content_sessions ADD COLUMN section_used jsonb;
ALTER TABLE content_sessions ADD COLUMN url_sections_used jsonb;