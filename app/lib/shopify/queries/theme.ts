import { gql } from "graphql-request";

export const getTemplateIndexFileQuery = gql`
  query {
    theme(id: "gid://shopify/OnlineStoreTheme/145028513869") {
      id
      name
      role
      files(filenames: ["templates/index.json"], first: 1) {
        nodes {
          body {
            ... on OnlineStoreThemeFileBodyText {
              content
            }
          }
        }
      }
    }
  }
`;
