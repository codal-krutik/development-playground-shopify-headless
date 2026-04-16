import { cookies } from "next/headers";

export const getNumericId = (gid: string) => gid.split("/").pop();

export const buildVariantGid = (id: string) => `gid://shopify/ProductVariant/${id}`;

export const getCartId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
};

export const setCartId = async (id: string) => {
  const cookieStore = await cookies();

  cookieStore.set("cartId", id, {
    path: "/",
  });
};
