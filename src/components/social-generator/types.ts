export interface BrandData {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  domain: string;
}

export interface FeatureCardData {
  icon: string;
  title: string;
  description: string;
  stat: string;
}

export interface TestimonialCardData {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
  rating: number;
}

export interface QuoteCardData {
  quote: string;
  author: string;
  authorImage: string;
  context: string;
}

export interface PromoCardData {
  badge: string;
  productName: string;
  valueProp: string;
  benefits: string[];
  originalPrice: string;
  discountedPrice: string;
  qualification: string;
}

export type CardTab = 'features' | 'testimonials' | 'quotes' | 'custom-quote' | 'promotional' | 'viral-posts';
