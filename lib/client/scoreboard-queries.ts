export const SCOREBOARD_QUERY = `
         query ProfileDatabase($orderDirection: String!, $after: String, $network: BigInt) {
          ProfileDatabase(
             orderBy: totalScore,
             orderDirection: $orderDirection,
             where: {network: $network}, 
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
