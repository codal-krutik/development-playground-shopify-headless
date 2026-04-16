import { cookies } from "next/headers";
import { shopifyClient } from "../lib/shopify/client";
import { removeCartLinesMutation } from "../lib/shopify/mutations/cart";
import { revalidatePath } from "next/cache";

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
