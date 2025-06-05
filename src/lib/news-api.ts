
import type { NewsArticle } from '@/types/news';

// Mock function to simulate fetching weather news
// In a real application, this would call a news API
export async function fetchWeatherNews(city: string): Promise<NewsArticle[]> {
  console.log(`Fetching news for ${city}... (mocked)`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return mock data
  return [
    {
      id: '1',
      title: `Major Storm System Developing Near ${city}`,
      description: 'Meteorologists are tracking a significant weather system expected to bring heavy rain and strong winds to the region later this week.',
      source: 'Global Weather Network',
      publishedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
      url: '#',
      imageUrl: 'https://placehold.co/300x200.png',
    },
    {
      id: '2',
      title: `${city} Experiences Unusually Warm Temperatures for Season`,
      description: 'Residents are enjoying a spell of warm weather, but experts caution about potential impacts on local ecosystems.',
      source: 'Local News Chronicle',
      publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      url: '#',
      imageUrl: 'https://placehold.co/300x200.png',
    },
    {
      id: '3',
      title: 'Understanding the Impact of Climate Change on Weather Patterns in Your Area',
      description: 'A new report highlights long-term weather trends and discusses how climate change might be affecting local conditions around ' + city + '.',
      source: 'Climate Watch Institute',
      publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      url: '#',
      imageUrl: 'https://placehold.co/300x200.png',
    },
  ];
}
