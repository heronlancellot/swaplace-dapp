//Recipient and value added to each query
export const ALL_OFFERS_MARKETPLACE_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!,  $after: String, $allowed: String, $network: BigInt, $expiry_gt: BigInt, ) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: {allowed: $allowed, network: $network, status: CREATED, expiry_gt: $expiry_gt,  }, 
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
