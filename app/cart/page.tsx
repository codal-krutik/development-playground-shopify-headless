import { cookies } from "next/headers";
import { shopifyClient } from "../lib/shopify/client";
import { getCartQuery } from "../lib/shopify/queries/cart";
import Image from "next/image";
import Link from "next/link";
import { getNumericId } from "../lib/utils";
import { removeCartLine, updateCartLine } from "../cart/actions";

export default async function Page() {
  const store = await cookies();
  const cartId = store.get("cartId")?.value;

  if (!cartId) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/collections/all" className="mt-4 inline-block text-blue-600">
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
        <Link href="/collections/all" className="mt-4 inline-block text-blue-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  const items = cart.lines.edges;

  return (
    <div className="max-w-7xl w-full mx-auto px-6 py-10">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>

          <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>

          <Link
            href="/collections/all"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <h1 className="text-2xl font-semibold">Cart</h1>
              <span className="bg-gray-100 text-sm px-2 py-0.5 rounded-full">{cart.totalQuantity}</span>
            </div>

            <div className="space-y-10">
              {items.map(({ node }: any) => {
                const variant = node.merchandise;
                const variantId = getNumericId(variant.id);
                const product = variant.product;

                return (
                  <div key={node.id} className="flex items-center justify-between border-b pb-8">
                    <div className="flex items-center gap-6">
                      <Image
                        src={product.featuredImage?.url || "/card-placeholder.jpg"}
                        alt={product.title}
                        width={100}
                        height={120}
                        className="object-cover rounded-md"
                      />

                      <div>
                        <a
                          href={`/products/${product.handle}?variant=${variantId}`}
                          className="font-medium text-gray-900"
                        >
                          {product.title}
                        </a>

                        <p className="text-sm text-gray-500 mt-1">{variant.title}</p>

                        <p className="text-sm mt-2">
                          {variant.price.amount} {variant.price.currencyCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const quantity = Number(formData.get("quantity"));
                          await updateCartLine(node.id, quantity);
                        }}
                        className="flex items-center border rounded-md overflow-hidden"
                      >
                        <button
                          type="submit"
                          name="quantity"
                          value={node.quantity - 1}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>

                        <span className="px-4 text-sm">{node.quantity}</span>

                        <button
                          type="submit"
                          name="quantity"
                          value={node.quantity + 1}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await removeCartLine(node.id);
                        }}
                      >
                        <button className="text-gray-400 hover:text-black text-lg">🗑</button>
                      </form>
                    </div>

                    <div className="flex items-center gap-6">
                      <p className="text-base font-medium min-w-22.5 text-right">
                        {variant.price.amount} {variant.price.currencyCode}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border rounded-lg p-8 h-fit sticky top-20">
            <p className="text-sm text-gray-600 mb-2">Estimated total</p>

            <p className="text-2xl font-semibold">
              {cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
            </p>

            <p className="text-xs text-gray-500 mt-2">Taxes and shipping calculated at checkout.</p>

            <a href={cart.checkoutUrl} className="mt-6 block w-full bg-black text-white text-center py-3 rounded-md">
              Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
