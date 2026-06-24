import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBranchBySlug, getBranches } from "../../lib/strapi";

type BranchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ContactRowProps = {
  label: string;
  value: string;
  href?: string | null;
  external?: boolean;
};

function getHttpUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function getPhoneHref(phone?: string | null): string | null {
  const normalized = phone?.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

function getEmailHref(email?: string | null): string | null {
  const trimmed = email?.trim();
  return trimmed ? `mailto:${trimmed}` : null;
}

function ContactRow({ label, value, href, external }: ContactRowProps) {
  return (
    <div className="border-b border-zinc-200 py-4 last:border-b-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-6 text-zinc-800">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="font-medium text-teal-800 hover:text-teal-950"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export async function generateStaticParams() {
  const branches = await getBranches();

  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  return {
    title: branch ? `${branch.name} | Branches` : "Branch not found",
    description: branch?.description ?? branch?.address ?? undefined,
  };
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  const mapHref = getHttpUrl(branch.google_map_url);
  const facebookHref = getHttpUrl(branch.facebook_url);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-8 lg:py-14">
      <Link
        href="/branches"
        className="text-sm font-medium text-teal-800 hover:text-teal-950"
      >
        Back to branches
      </Link>

      <article className="mt-8">
        <header className="border-b border-zinc-200 pb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Branch
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            {branch.name}
          </h1>
          {branch.address ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              {branch.address}
            </p>
          ) : null}
        </header>

        {branch.coverImageUrl ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-zinc-100">
            <Image
              unoptimized
              fill
              src={branch.coverImageUrl}
              alt={branch.coverImageAlt ?? branch.name}
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover"
              preload
            />
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-10">
            {branch.description ? (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-950">
                  รายละเอียด
                </h2>
                <div className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-700">
                  {branch.description}
                </div>
              </section>
            ) : null}

            {branch.opening_hours ? (
              <section>
                <h2 className="text-2xl font-semibold text-zinc-950">
                  เวลาเปิดทำการ
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-700">
                  {branch.opening_hours}
                </p>
              </section>
            ) : null}
          </div>

          <aside className="border-t border-zinc-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="text-lg font-semibold text-zinc-950">ติดต่อ</h2>
            <dl className="mt-3">
              {branch.address ? (
                <ContactRow label="ที่อยู่" value={branch.address} />
              ) : null}
              {branch.phone ? (
                <ContactRow
                  label="โทรศัพท์"
                  value={branch.phone}
                  href={getPhoneHref(branch.phone)}
                />
              ) : null}
              {branch.email ? (
                <ContactRow
                  label="อีเมล"
                  value={branch.email}
                  href={getEmailHref(branch.email)}
                />
              ) : null}
              {mapHref ? (
                <ContactRow
                  label="แผนที่"
                  value="เปิด Google Maps"
                  href={mapHref}
                  external
                />
              ) : null}
              {facebookHref ? (
                <ContactRow
                  label="Facebook"
                  value="เปิด Facebook"
                  href={facebookHref}
                  external
                />
              ) : null}
            </dl>
          </aside>
        </div>
      </article>
    </main>
  );
}
