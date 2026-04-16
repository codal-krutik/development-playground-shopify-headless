import { GraphQLClient } from "graphql-request";

const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${process.env.SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

const shopifyStorefrontAccessToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN;
if (!shopifyStorefrontAccessToken) {
  throw new Error("SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN is missing");
}

export const shopifyClient = new GraphQLClient(url, {
  headers: {
    "X-Shopify-Storefront-Access-Token": shopifyStorefrontAccessToken,
  },
});
