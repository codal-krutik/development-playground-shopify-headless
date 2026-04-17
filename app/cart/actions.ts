import { cookies } from "next/headers";
import { shopifyClient } from "../lib/shopify/client";
import { removeCartLinesMutation, updateCartMutation } from "../lib/shopify/mutations/cart";
import { revalidatePath } from "next/cache";

export async function updateCartLine(lineId: string, quantity: number) {
  const store = await cookies();
  const cartId = store.get("cartId")?.value;

  if (!cartId) return;

  if (quantity <= 0) {
    await removeCartLine(lineId);
    revalidatePath("/cart");
    return;
  }

  await shopifyClient.request(updateCartMutation, {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  });

  revalidatePath("/cart");
}

export async function removeCartLine(lineId: string) {
  const store = await cookies();
  const cartId = store.get("cartId")?.value;

  if (!cartId) return;

  await shopifyClient.request(removeCartLinesMutation, {
    cartId,
    lineIds: [lineId],
  });

  revalidatePath("/cart");
}
