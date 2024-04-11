export const ALL_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { OR: [{owner: $inputAddress}, {allowed: $allowed}] },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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

export const CREATED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_gt: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { owner: $inputAddress, status: CREATED, expiry_gt: $expiry_gt },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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

export const RECEIVED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $after: String, $allowed: String, $expiry_gt: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { allowed: $allowed, status_not: ACCEPTED, expiry_gt: $expiry_gt },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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

export const ACCEPTED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: ACCEPTED}, {OR: [ {owner: $inputAddress},{allowed: $allowed}]}]},
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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

export const CANCELED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: CANCELED}, {OR: [ {owner: $inputAddress}, {allowed: $allowed}]}]},
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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

export const EXPIRED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_lt: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: {
              AND: [
                {
                  OR: [
                    { owner: $inputAddress },
                    { allowed: $inputAddress }
                  ]
                },
                { status_not: ACCEPTED },
                { status_not: CANCELED },
                { expiry_lt: $expiry_lt }
              ]
            },
             limit: 20,
             after: $after
           ) {
             items {
               swapId
               status
               owner
               allowed
               expiry
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
