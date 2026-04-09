import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ArticleClient from "./ArticleClient";

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getAllArticles().find((a) => a.slug === params.slug && a.publie);
  if (!article) notFound();
  return <ArticleClient article={article} />;
}
