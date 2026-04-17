import { shopifyClient } from "../../lib/shopify/client";
import { getProductByHandleQuery } from "../../lib/shopify/queries/product";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { addToCartAction } from "./actions";
import QuantitySelector from "./components/QuantitySelector";
import AddToCartButton from "./components/AddToCartButton";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { handle } = await params;
  const queryParams = await searchParams;

  const data = await shopifyClient.request(getProductByHandleQuery, {
    handle,
  });

  const product = data.product;

  if (!product) {
    notFound();
  }

  const variants = product.variants.edges.map((v: any) => v.node);

  // ✅ Helpers
  const getNumericId = (gid: string) => gid.split("/").pop();

  // ✅ Redirect to first variant if none in URL
  if (!queryParams.variant && variants.length > 0) {
    const firstVariantId = getNumericId(variants[0].id);
    redirect(`?variant=${firstVariantId}`);
  }

  // ✅ Find selected variant using numeric ID
  const selectedVariant = variants.find((v: any) => getNumericId(v.id) === queryParams.variant) || variants[0];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
            <Image
              src={selectedVariant?.image?.url || product.featuredImage?.url || "/card-placeholder.jpg"}
              alt={product.title}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{product.title}</h1>

          {/* PRICE */}
          <p className="mt-3 text-2xl font-medium text-gray-900">
            {selectedVariant.price.amount}{" "}
            <span className="text-gray-500 text-lg">{selectedVariant.price.currencyCode}</span>
          </p>

          {/* DESCRIPTION */}
          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {/* VARIANTS */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Variant</h3>

            <div className="flex flex-wrap gap-3">
              {variants.map((variant: any) => {
                const variantId = getNumericId(variant.id);
                const isActive =
                  variantId === queryParams.variant || (!queryParams.variant && variant.id === selectedVariant.id);

                // ✅ Prevent click if already active
                if (isActive) {
                  return (
                    <span
                      key={variant.id}
                      className="px-4 py-2 rounded-full text-sm bg-black text-white border border-black cursor-default"
                    >
                      {variant.title}
                    </span>
                  );
                }

                return (
                  <Link
                    key={variant.id}
                    href={`?variant=${variantId}`}
                    replace
                    scroll={false}
                    className="px-4 py-2 rounded-full text-sm border border-gray-300 bg-white text-gray-800 hover:border-black hover:text-black transition"
                  >
                    {variant.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* STOCK */}
          <div className="mt-6">
            <span
              className={`text-sm font-medium ${selectedVariant.availableForSale ? "text-green-600" : "text-red-500"}`}
            >
              {selectedVariant.availableForSale ? "● In Stock" : "● Out of Stock"}
            </span>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";

              const quantity = Number(formData.get("quantity")) || 1;
              await addToCartAction(selectedVariant.id, quantity);
            }}
          >
            <div className="mt-6">
              <QuantitySelector />
            </div>

            <AddToCartButton disabled={!selectedVariant.availableForSale} />
          </form>
        </div>
      </div>
    </div>
  );
}
