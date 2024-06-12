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

export const USER_RANKING_QUERY = `
       query profileDatabases($network: BigInt, $inputAddress: String) {
        profileDatabases(
           where: {network: $network, id: $inputAddress}, 
           limit: 1,
         ) {
           items {
             id
             totalScore
           }
         }
       }
     `;
