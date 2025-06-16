
export interface NewsArticle {
  id: string; // Will use URL or a combination for uniqueness
  title: string;
  description: string | null;
  source: string;
  publishedAt: string; // ISO date string
  url: string;
  imageUrl?: string | null;
}
