import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ArticleClient from "./ArticleClient";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articles = await getAllArticles();
  const article = articles.find((a) => a.slug === params.slug && a.publie);
  if (!article) notFound();
  return <ArticleClient article={article} />;
}
