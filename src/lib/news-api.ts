
import type { NewsArticle } from '@/types/news';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4/search';

interface GNewsArticle {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string; // ISO 8601 date string
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
  // GNews API includes errors directly in the response sometimes
  errors?: string[];
  message?: string; // For some error types
}

export async function fetchWeatherNews(city: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.warn('GNews API key (NEXT_PUBLIC_NEWS_API_KEY) is not configured. News will not be fetched.');
    return [];
  }

  // Construct a query that is more likely to yield weather-related news for the city
  const query = `"${city}" AND (weather OR climate OR temperature OR forecast OR storm OR flood OR heatwave OR drought)`;
  const url = `${GNEWS_API_BASE_URL}?q=${encodeURIComponent(query)}&token=${NEWS_API_KEY}&lang=en&max=5&sortBy=publishedAt`;

  try {
    const response = await fetch(url);
    const data: GNewsResponse = await response.json();

    if (!response.ok || (data.errors && data.errors.length > 0)) {
      const errorMsg = data.errors ? data.errors.join(', ') : data.message || `GNews API request failed with status ${response.status}`;
      console.error(`Error fetching news from GNews.io: ${errorMsg}`);
      if (errorMsg.toLowerCase().includes('api key') || response.status === 401 || response.status === 403) {
        throw new Error(`Invalid or problematic GNews API key (NEXT_PUBLIC_NEWS_API_KEY). Details: ${errorMsg}`);
      }
      throw new Error(errorMsg);
    }
    
    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    return data.articles.map((article, index) => ({
      id: article.url || `${article.title}-${index}`, // Ensure unique ID
      title: article.title,
      description: article.description,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      imageUrl: article.image,
    }));

  } catch (error: any) {
    console.error('Failed to fetch or process news from GNews.io:', error);
    // Re-throw critical API key errors, otherwise return empty
    if (error.message.includes('GNews API key')) {
        throw error;
    }
    return [];
  }
}
