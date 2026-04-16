import { shopifyClient } from "../../lib/shopify/client";
import { getProductsQuery } from "../../lib/shopify/queries/product";
import Image from "next/image";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    after?: string;
    before?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;

  const limit = Number(params.limit) || 10;

  const variables: any = {
    first: limit,
  };

  if (params.after) {
    variables.after = params.after;
    variables.first = limit;
  } else if (params.before) {
    variables.before = params.before;
    variables.last = limit;
    delete variables.first;
  }

  const data = await shopifyClient.request(getProductsQuery, variables);

  const products = data.products.edges;
  const pageInfo = data.products.pageInfo;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(({ node }: any) => (
            <div key={node.id} className="group relative">
              <Image
                src={node.featuredImage?.url || "/card-placeholder.jpg"}
                alt={node.featuredImage?.altText || node.title}
                width={node.featuredImage?.width || 300}
                height={node.featuredImage?.height || 300}
                className="aspect-square w-full rounded-md object-cover group-hover:opacity-75"
              />

              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">
                  <Link href={`/products/${node.handle}`}>{node.title}</Link>
                </h3>

                <p className="text-sm font-medium text-gray-900">
                  {node.priceRange?.minVariantPrice.amount} {node.priceRange?.minVariantPrice.currencyCode}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="mt-10 flex gap-4">
          {pageInfo.hasPreviousPage && (
            <Link href={`?before=${pageInfo.startCursor}&limit=${limit}`} className="px-4 py-2 bg-gray-200 rounded">
              Previous
            </Link>
          )}

          {pageInfo.hasNextPage && (
            <Link
              href={`?after=${pageInfo.endCursor}&limit=${limit}`}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
