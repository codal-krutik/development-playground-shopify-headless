import { notFound } from "next/navigation";
import { shopifyClient } from "../../lib/shopify/client";
import { getCollectionByHandleQuery } from "../../lib/shopify/queries/collection";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    after?: string;
    before?: string;
    limit?: string;
  }>;
}) {
  const { handle } = await params;
  const queryParams = await searchParams;

  const limit = Number(queryParams.limit) || 10;

  const variables: any = {
    handle,
    first: limit,
  };

  if (queryParams.after) {
    variables.after = queryParams.after;
    variables.first = limit;
  } else if (queryParams.before) {
    variables.before = queryParams.before;
    variables.last = limit;
    delete variables.first;
  }

  const data = await shopifyClient.request(getCollectionByHandleQuery, variables);

  const collection = data.collection;
  if (!collection) {
    notFound();
  }

  const products = collection.products.edges;
  const pageInfo = collection.products.pageInfo;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* COLLECTION TITLE */}
        <h1 className="text-2xl font-bold mb-6">{collection.title}</h1>

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
