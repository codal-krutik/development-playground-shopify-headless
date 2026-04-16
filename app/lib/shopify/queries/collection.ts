import { gql } from "graphql-request";

export const getCollectionsQuery = gql`
  query GetCollections(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collections(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          title
          handle
          description
          updatedAt
          image {
            url
            altText
            width
            height
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

export const getCollectionByHandleQuery = gql`
  query GetCollectionByHandle(
    $handle: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      updatedAt
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after, last: $last, before: $before) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
              altText
              width
              height
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
  }
`;