import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllArticles } from "@/lib/articles";
import BlogAdminClient from "./BlogAdminClient";

export default function BlogAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const articles = getAllArticles();
  return <BlogAdminClient articles={articles} />;
}
