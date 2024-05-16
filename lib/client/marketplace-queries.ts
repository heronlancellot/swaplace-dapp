//Recipient and value added to each query
export const ALL_OFFERS_MARKETPLACE_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!,  $after: String, $allowed: String, $network: BigInt ) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: {allowed: $allowed, network: $network}, 
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
