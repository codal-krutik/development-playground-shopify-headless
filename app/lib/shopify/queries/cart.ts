import { gql } from "graphql-request";

export const getCartQuery = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      totalQuantity
      checkoutUrl
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
