import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchTechCrunchArticles, fetchHackerNewsVotes, fetchRedditVotes } from '@/utils/api';

const ArticleSortingPage = () => {
  const [articles, setArticles] = useState([]);

  const { data: techCrunchArticles, isLoading: isLoadingTechCrunch } = useQuery({
    queryKey: ['techCrunchArticles'],
    queryFn: fetchTechCrunchArticles,
  });

  useEffect(() => {
    if (techCrunchArticles) {
      const fetchVotes = async () => {
        const articlesWithVotes = await Promise.all(
          techCrunchArticles.map(async (article) => {
            const hackerNewsVotes = await fetchHackerNewsVotes(article.url);
            const redditVotes = await fetchRedditVotes(article.url);
            return {
              ...article,
              votes: hackerNewsVotes + redditVotes,
            };
          })
        );
        setArticles(articlesWithVotes.sort((a, b) => b.votes - a.votes));
      };
      fetchVotes();
    }
  }, [techCrunchArticles]);

  if (isLoadingTechCrunch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Top Articles</h1>
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.url}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{article.description}</p>
              <p className="mt-2 text-sm text-muted-foreground">Votes: {article.votes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticleSortingPage;