import { readData, writeData } from "./storage";

export interface Article {
  id: string;
  titre: string;
  slug: string;
  categorie: string;
  date: string;
  resume: string;
  photoCouverture: string;
  contenu: string;
  tags: string[];
  publie: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllArticles(): Promise<Article[]> {
  return readData<Article[]>("articles", "articles.json", []);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find((a) => a.id === id) || null;
}

async function save(articles: Article[]): Promise<void> {
  await writeData("articles", "articles.json", articles);
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">
): Promise<Article> {
  const articles = await getAllArticles();
  const article: Article = {
    ...data,
    id: `article_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articles.unshift(article);
  await save(articles);
  return article;
}

export async function updateArticle(
  id: string,
  data: Partial<Article>
): Promise<Article | null> {
  const articles = await getAllArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  articles[idx] = {
    ...articles[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await save(articles);
  return articles[idx];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getAllArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  await save(filtered);
  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
