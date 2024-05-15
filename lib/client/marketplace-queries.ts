export const ALL_OFFERS_MARKETPLACE_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!,  $after: String, $allowed: String) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: {allowed: $allowed},
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
               recipient
               value
               bid
               ask
               blockTimestamp
               transactionHash
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
