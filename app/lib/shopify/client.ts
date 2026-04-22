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

const adminUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
if (!shopifyAccessToken) {
  throw new Error("SHOPIFY_ACCESS_TOKEN is missing");
}

export const shopifyAdminClient = new GraphQLClient(adminUrl, {
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": shopifyAccessToken,
  },
});
