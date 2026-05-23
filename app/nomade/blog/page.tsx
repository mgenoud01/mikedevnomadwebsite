import { getAllArticles } from "@/lib/articles";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = (await getAllArticles()).filter((a) => a.publie);
  return <BlogClient articles={articles} />;
}
