import Link from "next/link";
import { getArticles } from "./lib/strapi";

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-8 lg:py-14">
      <header className="border-b border-zinc-200 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Strapi CMS
          </p>
          <nav
            aria-label="Primary"
            className="flex items-center gap-4 text-sm font-medium"
          >
            <Link href="/" className="text-zinc-950">
              Articles
            </Link>
            <Link
              href="/branches"
              className="text-zinc-600 hover:text-teal-800"
            >
              Branches
            </Link>
          </nav>
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
          Content from your backend, rendered by Next.js.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          Create, edit, and publish articles in Strapi. The frontend reads the
          published content from the CMS API.
        </p>
      </header>

      <section className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.documentId ?? article.id ?? article.slug}
              href={`/articles/${article.slug}`}
              className="group flex min-h-52 flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-teal-700 hover:shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold leading-7 text-zinc-950 group-hover:text-teal-800">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-600">
                  {article.excerpt ?? article.body}
                </p>
              </div>
              <span className="mt-6 text-sm font-medium text-teal-800">
                Read article
              </span>
            </Link>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">
                No published articles yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Open Strapi at http://localhost:1337/admin, create an Article,
                publish it, then refresh this page.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
