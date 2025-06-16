
import type { NewsArticle } from '@/types/news';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';

interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO date string
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
  code?: string; // For error responses
  message?: string; // For error responses
}

export async function fetchWeatherNews(city: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.warn('News API key (NEXT_PUBLIC_NEWS_API_KEY) is not configured. News will not be fetched.');
    return [];
  }

  const query = `${city} weather OR climate OR temperature OR forecast`;
  const url = `${NEWS_API_BASE_URL}?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=5`;

  try {
    const response = await fetch(url);
    const data: NewsAPIResponse = await response.json();

    if (!response.ok || data.status === 'error') {
      const errorMsg = data.message || `NewsAPI request failed with status ${response.status}`;
      console.error(`Error fetching news from NewsAPI.org: ${errorMsg} (Code: ${data.code})`);
      if (data.code === 'apiKeyInvalid' || data.code === 'apiKeyMissing') {
        throw new Error(`Invalid or missing NewsAPI key (NEXT_PUBLIC_NEWS_API_KEY). Details: ${errorMsg}`);
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
      imageUrl: article.urlToImage,
    }));

  } catch (error: any) {
    console.error('Failed to fetch or process news from NewsAPI.org:', error);
    // Re-throw critical API key errors, otherwise return empty or allow caller to handle
    if (error.message.includes('NewsAPI key')) {
        throw error;
    }
    // For other errors, we can return empty or throw a generic message
    // depending on how strictly we want to enforce news availability.
    // For now, let's return an empty array to not break the UI.
    return [];
  }
}
