import { gql } from "graphql-request";

export const getProductsQuery = gql`
  query GetProducts($first: Int, $after: String, $last: Int, $before: String) {
    products(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            altText
            height
            id
            thumbhash
            url
            width
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const getProductByHandleQuery = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      createdAt
      updatedAt
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 50) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        id
        name
        values
      }
      seo {
        title
        description
      }
      tags
      vendor
    }
  }
`;