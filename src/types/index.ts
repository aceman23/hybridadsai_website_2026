export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  badge?: string;
  badgeColor?: string;
  icon: string;
  latency: string;
  contextWindow: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

export interface Stat {
  value: string;
  label: string;
  sublabel: string;
  trend: string;
}
