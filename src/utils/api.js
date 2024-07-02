export const fetchTechCrunchArticles = async () => {
  const response = await fetch('https://techcrunch.com/wp-json/wp/v2/posts?per_page=10');
  const data = await response.json();
  return data.map((article) => ({
    title: article.title.rendered,
    url: article.link,
    description: article.excerpt.rendered,
  }));
};

export const fetchHackerNewsVotes = async (url) => {
  const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(url)}`);
  const data = await response.json();
  return data.hits.reduce((acc, hit) => acc + hit.points, 0);
};

export const fetchRedditVotes = async (url) => {
  const response = await fetch(`https://www.reddit.com/api/info.json?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  return data.data.children.reduce((acc, child) => acc + child.data.ups, 0);
};