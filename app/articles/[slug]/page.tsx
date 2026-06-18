import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "../../lib/strapi";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return {
    title: article ? `${article.title} | Strapi CMS` : "Article not found",
    description: article?.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:px-8 lg:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-teal-800 hover:text-teal-950"
      >
        Back to articles
      </Link>

      <article className="mt-8">
        <header className="border-b border-zinc-200 pb-8">
          <h1 className="text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              {article.excerpt}
            </p>
          ) : null}
        </header>

        <div className="prose-content mt-8 whitespace-pre-line text-base leading-8 text-zinc-700">
          {article.body}
        </div>
      </article>
    </main>
  );
}
