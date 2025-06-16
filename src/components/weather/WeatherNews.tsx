
"use client";

import type { NewsArticle } from '@/types/news';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WeatherNewsProps {
  newsArticles: NewsArticle[] | null;
  cityName?: string;
}

export function WeatherNews({ newsArticles, cityName }: WeatherNewsProps) {
  if (!newsArticles || newsArticles.length === 0) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <Newspaper size={22} className="mr-2 text-primary" />
            Weather News {cityName ? `for ${cityName}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent weather-related news found for {cityName || 'this location'}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Newspaper size={22} className="mr-2 text-primary" />
          Weather News {cityName ? `for ${cityName}` : ''}
        </CardTitle>
        <CardDescription>Latest weather-related headlines from NewsAPI.org.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {newsArticles.map((article) => (
            <div key={article.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
              {article.imageUrl && (
                <div className="w-full sm:w-1/3 md:w-1/4 aspect-video relative overflow-hidden rounded-md bg-muted">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint="news article thumbnail"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {article.source} - {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </p>
                {article.description && (
                   <p className="text-sm text-foreground/90 mb-3 line-clamp-3">{article.description}</p>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read More <ExternalLink size={14} className="ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
