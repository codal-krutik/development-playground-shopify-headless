import { cookies } from "next/headers";
import { shopifyClient } from "../lib/shopify/client";
import { getCartQuery } from "../lib/shopify/queries/cart";
import Image from "next/image";
import Link from "next/link";
import { getNumericId } from "../lib/utils";
import { removeCartLine } from "../cart/actions";

export default async function Page() {
  const store = await cookies();
  const cartId = store.get("cartId")?.value;

  if (!cartId) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  const data = await shopifyClient.request(getCartQuery, {
    cartId,
  });

  const cart = data.cart;

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold">Cart not found</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  const items = cart.lines.edges;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Your cart is empty</p>
          <Link href="/" className="mt-4 inline-block text-blue-600">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="space-y-6">
            {items.map(({ node }: any, index: number) => {
              const variant = node.merchandise;
              const variantId = getNumericId(variant.id);
              const product = variant.product;
              const isLast = index === items.length - 1;

              return (
                <div key={node.id} className={`flex gap-4 pb-6 ${!isLast ? "border-b" : ""}`}>
                  {/* IMAGE */}
                  <Image
                    src={product.featuredImage?.url || "/placeholder.jpg"}
                    alt={product.title}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <a href={`products/${product.handle}?variant=${variantId}`} className="h2 font-medium">
                      {product.title}
                    </a>

                    <p className="text-sm text-gray-500">{variant.title}</p>

                    <p className="mt-1 text-sm">
                      {variant.price.amount} {variant.price.currencyCode}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">Quantity: {node.quantity}</p>

                    {/* REMOVE BUTTON */}
                    <form
                      action={async () => {
                        "use server";
                        await removeCartLine(node.id);
                      }}
                    >
                      <button className="mt-3 text-sm text-red-500 hover:text-red-700" type="submit">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="border-t pt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-xl font-bold">
                {cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
              </p>
            </div>

            <a href={cart.checkoutUrl} className="bg-black text-white px-6 py-3 rounded-lg">
              Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
}
