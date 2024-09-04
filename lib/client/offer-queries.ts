//Recipient and value added to each query
export const ALL_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String, $network: BigInt, $expiry_gte: BigInt ) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [{network: $network}, {status_not: ACCEPTED}, {status_not: CANCELED}, {expiry_gt: $expiry_gte}, {allowed_not: "0x00"} {OR: [{owner: $inputAddress}, {allowed: $allowed}]}]},
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
export const CREATED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_gte: BigInt, $network: BigInt ) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { owner: $inputAddress, status: CREATED, expiry_gt: $expiry_gte, network: $network, allowed_not: "0x00" },
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

export const RECEIVED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $after: String, $allowed: String, $expiry_gte: BigInt, $network: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { allowed: $allowed, status_not: ACCEPTED, expiry_gt: $expiry_gte, network: $network },
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

export const ACCEPTED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String, $network: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: ACCEPTED}, {network: $network}, {OR: [ {owner: $inputAddress},{allowed: $allowed}]}]},
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

export const CANCELED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $allowed: String, $network: BigInt) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [ {status: CANCELED}, {network: $network}, {OR: [ {owner: $inputAddress}, {allowed: $allowed}]}]},
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

export const EXPIRED_OFFERS_QUERY = `
         query swapDatabases($orderBy: String!, $orderDirection: String!, $inputAddress: String, $after: String, $expiry_lt: BigInt, $network: BigInt,) {
          swapDatabases(
             orderBy: $orderBy,
             orderDirection: $orderDirection,
             where: { AND: [{ status_not: ACCEPTED }, { status_not: CANCELED }, { expiry_lt: $expiry_lt }, {network: $network}, { allowed_not: "0x00" }, { owner: $inputAddress } ]},
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
