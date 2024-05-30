export const SCOREBOARD_QUERY = `
         query ProfileDatabase($orderDirection: String!, $after: String, $network: BigInt, $expiry_gt: BigInt! ) {
          ProfileDatabase(
             orderBy: totalScore,
             orderDirection: $orderDirection,
             where: {network: $network, expiry_gt: $expiry_gt}, 
             limit: 100,
             after: $after
           ) {
             items {
               id
               totalScore
             }
             pageInfo {
               hasNextPage
               endCursor
             }
           }
         }
       `;
