export interface ContentProject {
  id: string;
  name: string;
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
