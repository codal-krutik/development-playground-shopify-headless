import { gql } from "graphql-request";

export const getMenuQuery = gql`
  query Menu($handle: String!) {
    menu(handle: $handle) {
      handle
      id
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
      itemsCount
      title
    }
  }
`;