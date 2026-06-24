import Image from "next/image";
import Link from "next/link";
import { getBranches } from "../lib/strapi";

export const metadata = {
  title: "Branches | Strapi CMS Frontend",
  description: "Published branch locations from Strapi CMS",
};

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-8 lg:py-14">
      <header className="border-b border-zinc-200 pb-8">
        <Link
          href="/"
          className="text-sm font-medium text-teal-800 hover:text-teal-950"
        >
          Back to home
        </Link>
        <p className="mt-6 text-sm font-medium uppercase tracking-wide text-teal-700">
          Branches
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
          สาขา
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          เลือกดูที่อยู่ ช่องทางติดต่อ และเวลาเปิดทำการของแต่ละสาขา
        </p>
      </header>

      <section className="grid gap-5 py-8" aria-label="Branch list">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <Link
              key={branch.documentId ?? branch.id ?? branch.slug}
              href={`/branches/${branch.slug}`}
              className="group grid gap-5 rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-teal-700 hover:shadow-sm md:grid-cols-[14rem_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-100">
                {branch.coverImageUrl ? (
                  <Image
                    unoptimized
                    fill
                    src={branch.coverImageUrl}
                    alt={branch.coverImageAlt ?? branch.name}
                    sizes="(max-width: 768px) 100vw, 14rem"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-zinc-400">
                    {branch.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold leading-8 text-zinc-950 group-hover:text-teal-800">
                    {branch.name}
                  </h2>
                  {branch.address ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {branch.address}
                    </p>
                  ) : null}
                  {branch.description ? (
                    <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-zinc-600">
                      {branch.description}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600">
                  {branch.phone ? <span>{branch.phone}</span> : null}
                  {branch.email ? <span>{branch.email}</span> : null}
                  {branch.opening_hours ? (
                    <span className="line-clamp-1">{branch.opening_hours}</span>
                  ) : null}
                </div>

                <span className="mt-5 text-sm font-medium text-teal-800">
                  View branch
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6">
            <h2 className="text-lg font-semibold text-zinc-950">
              ยังไม่มีสาขาที่เผยแพร่
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Publish an active Branch in Strapi, then refresh this page.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
