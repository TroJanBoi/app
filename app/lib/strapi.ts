const STRAPI_API_URL = process.env.STRAPI_API_URL ?? "http://localhost:1337";

type StrapiItem<T> = T & {
  id?: number;
  documentId?: string;
  attributes?: T;
};

export type Article = {
  id?: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  publishedAt?: string | null;
  createdAt?: string | null;
};

type StrapiListResponse<T> = {
  data?: Array<StrapiItem<T>>;
};

function unwrapItem<T>(item: StrapiItem<T>): T {
  return {
    ...item,
    ...(item.attributes ?? {}),
  };
}

async function fetchFromStrapi<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${STRAPI_API_URL}${path}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getArticles(): Promise<Article[]> {
  const params = new URLSearchParams({
    "sort[0]": "publishedAt:desc",
    "pagination[pageSize]": "12",
  });

  const payload = await fetchFromStrapi<StrapiListResponse<Article>>(
    `/api/articles?${params.toString()}`
  );

  return payload?.data?.map(unwrapItem) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  });

  const payload = await fetchFromStrapi<StrapiListResponse<Article>>(
    `/api/articles?${params.toString()}`
  );

  const article = payload?.data?.[0];

  return article ? unwrapItem(article) : null;
}
