export interface ContentProject {
  id: string;
  user_id: string;
  name: string;
  used_section_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface ContentSource {
  id: string;
  project_id: string;
  url: string;
  domain: string;
  note: string;
  summary: string;
  sections: Array<{ id: string; title: string; category: string; angle: string; data: string; sourceUrl?: string }>;
  added_at: string;
}

export interface ContentPost {
  platform: string;
  text: string;
  imgPrompt: string;
}

export interface ContentSession {
  id: string;
  project_id: string;
  name: string;
  tone: string;
  format: string;
  topic: string;
  platforms: string[];
  post_count: number;
  source_refs: Array<{ id: string; label: string; url: string }>;
  section_used?: { id: string; title: string; category: string };
  url_sections_used?: Array<{ id: string; title: string }>;
  posts: ContentPost[];
  created_at: string;
}

export interface GeneratingPost {
  id: string;
  platform: string;
  index: number;
  text: string | null;
  imgPrompt: string | null;
  loading: boolean;
  imgLoading: boolean;
}
