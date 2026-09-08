import { permanentRedirect } from "next/navigation";

interface ProductRedirectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Permanent canonical redirect from /products/[slug] to /shop/[slug].
 * Prevents URL fragmentation across search crawlers and preserves 100% PageRank.
 */
export default async function ProductRedirectPage({
  params,
}: ProductRedirectPageProps) {
  const { slug } = await params;
  permanentRedirect(`/shop/${slug}`);
}
