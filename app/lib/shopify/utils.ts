export const resolveShopifyLink = (link: string) => {
  if (!link) return "#";

  // Collections
  if (link.startsWith("shopify://collections/")) {
    const handle = link.replace("shopify://collections/", "");
    return `/collections/${handle}`;
  }

  // Products
  if (link.startsWith("shopify://products/")) {
    const handle = link.replace("shopify://products/", "");
    return `/products/${handle}`;
  }

  // Pages
  if (link.startsWith("shopify://pages/")) {
    const handle = link.replace("shopify://pages/", "");
    return `/pages/${handle}`;
  }

  return link;
};
