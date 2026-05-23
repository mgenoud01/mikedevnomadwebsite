import { getAllArticles } from "@/lib/articles";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const articles = getAllArticles().filter((a) => a.publie);
  return <BlogClient articles={articles} />;
}
