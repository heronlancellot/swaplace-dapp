// import type { Chain } from "@wagmi/core/chains";

// export const kakarot = {
//   id: 1_802_203_764,
//   name: "Kakarot Sepolia",
//   network: "Kakarot Sepolia",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, //Ether kakarot Sepolia? Ether Kakarot? What's the currency?
//   rpcUrls: {
//     default: { http: ["https://sepolia-rpc.kakarot.org"] },
//     public: { http: ["https://sepolia-rpc.kakarot.org"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "KakarotSepoliaScan",
//       url: "https://sepolia-explorer.kakarot.org",
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xca11bde05977b3631167028862be2a173976ca11",
//       blockCreated: 11_907_934,
//     },
//   },
// } as const satisfies Chain;

// import { type Chain } from "viem";

// export const kakarot: Chain = {
//   id: 1_802_203_764,
//   name: "Kakarot Sepolia",
//   network: "kakarot sepolia",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://sepolia-rpc.kakarot.org"] },
//     public: { http: ["https://sepolia-rpc.kakarot.org"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "KakarotSepoliaScan",
//       url: "https://sepolia-explorer.kakarot.org",
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xca11bde05977b3631167028862be2a173976ca11",
//       blockCreated: 11_907_934,
//     },
//   },
// } as const satisfies Chain;

import { defineChain } from "viem";

export const kakarot = defineChain({
  id: 1_802_203_764,
  name: "kakarot sepolia",
  network: "kakarot sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia-rpc.kakarot.org"] },
    public: { http: ["https://sepolia-rpc.kakarot.org"] },
  },
  blockExplorers: {
    default: {
      name: "KakarotSepoliaScan",
      url: "https://sepolia-explorer.kakarot.org",
    },
  },
  contracts: {},
});
