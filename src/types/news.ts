
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string; // ISO date string
  url: string; // URL to the article
  imageUrl?: string; // Optional image URL
}
