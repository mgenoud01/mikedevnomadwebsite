import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "articles.json");

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

export function getAllArticles(): Article[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function getArticleById(id: string): Article | null {
  return getAllArticles().find((a) => a.id === id) || null;
}

function save(articles: Article[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
}

export function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
  const articles = getAllArticles();
  const article: Article = { ...data, id: `article_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  articles.unshift(article);
  save(articles);
  return article;
}

export function updateArticle(id: string, data: Partial<Article>): Article | null {
  const articles = getAllArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  articles[idx] = { ...articles[idx], ...data, updatedAt: new Date().toISOString() };
  save(articles);
  return articles[idx];
}

export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  save(filtered);
  return true;
}

export function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
