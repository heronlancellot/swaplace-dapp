export const LEADERBOARD_QUERY = `
         query profileDatabases($orderDirection: String!, $after: String, $network: BigInt) {
          profileDatabases(
             orderBy: "totalScore",
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
