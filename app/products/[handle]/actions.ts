"use server";

import { getCartId, setCartId } from "@/app/lib/utils";
import { shopifyClient } from "../../lib/shopify/client";
import { createCartMutation, addToCartMutation } from "../../lib/shopify/mutations/cart";

export async function addToCartAction(variantId: string, quantity: number = 1) {
  try {
    const line = {
      merchandiseId: variantId,
      quantity,
    };

    const cartId = await getCartId();

    if (!cartId) {
      const data = await shopifyClient.request(createCartMutation, { lines: [line] });

      await setCartId(data.cartCreate.cart.id);
      return data.cartCreate.cart;
    }

    const data = await shopifyClient.request(addToCartMutation, {
      cartId,
      lines: [line],
    });

    return data.cartLinesAdd.cart;
  } catch (e) {
    console.error(e);
  }
}
