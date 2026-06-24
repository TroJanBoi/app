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

type StrapiMediaAttributes = {
  url?: string | null;
  alternativeText?: string | null;
  formats?: Record<string, { url?: string | null } | undefined> | null;
};

type StrapiMedia = StrapiMediaAttributes & {
  id?: number;
  documentId?: string;
  attributes?: StrapiMediaAttributes;
  data?: (StrapiMediaAttributes & {
    id?: number;
    documentId?: string;
    attributes?: StrapiMediaAttributes;
  }) | null;
};

export type Branch = {
  id?: number;
  documentId?: string;
  name: string;
  slug: string;
  cover_image?: StrapiMedia | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  opening_hours?: string | null;
  google_map_url?: string | null;
  facebook_url?: string | null;
  description?: string | null;
  order?: number | null;
  is_active?: boolean | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

function unwrapItem<T>(item: StrapiItem<T>): T {
  return {
    ...item,
    ...(item.attributes ?? {}),
  };
}

function unwrapMedia(media?: StrapiMedia | null): StrapiMediaAttributes | null {
  const item = media?.data ?? media;

  if (!item) {
    return null;
  }

  return {
    ...item,
    ...(item.attributes ?? {}),
  };
}

function getMediaUrl(media?: StrapiMedia | null): string | null {
  const item = unwrapMedia(media);
  const path =
    item?.formats?.large?.url ??
    item?.formats?.medium?.url ??
    item?.formats?.small?.url ??
    item?.url;

  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${STRAPI_API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function unwrapBranch(item: StrapiItem<Branch>): Branch {
  const branch = unwrapItem(item);
  const media = unwrapMedia(branch.cover_image);

  return {
    ...branch,
    coverImageUrl: getMediaUrl(branch.cover_image),
    coverImageAlt: media?.alternativeText ?? branch.name,
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

export async function getBranches(): Promise<Branch[]> {
  const params = new URLSearchParams({
    "filters[is_active][$eq]": "true",
    "sort[0]": "order:asc",
    "sort[1]": "name:asc",
    "pagination[pageSize]": "100",
    "populate[cover_image]": "true",
  });

  const payload = await fetchFromStrapi<StrapiListResponse<Branch>>(
    `/api/branches?${params.toString()}`
  );

  return payload?.data?.map(unwrapBranch) ?? [];
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "filters[is_active][$eq]": "true",
    "pagination[pageSize]": "1",
    "populate[cover_image]": "true",
  });

  const payload = await fetchFromStrapi<StrapiListResponse<Branch>>(
    `/api/branches?${params.toString()}`
  );

  const branch = payload?.data?.[0];

  return branch ? unwrapBranch(branch) : null;
}
