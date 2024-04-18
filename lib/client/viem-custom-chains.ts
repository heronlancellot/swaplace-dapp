import { type Chain } from "viem";

export const kakarotSepolia = {
  id: 1802203764,
  network: "Kakarot",
  name: "Kakarot",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, //Ether kakarot Sepolia? Ether Kakarot? What's the currency?
  rpcUrls: {
    default: { http: ["https://sepolia-rpc.kakarot.org"] },
    public: { http: ["https://sepolia-rpc.kakarot.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" }, //What is the explorer?
  },
  //   contracts: {
  //     ensRegistry: {
  //       address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  //     },
  //     ensUniversalResolver: {
  //       address: "0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da",
  //       blockCreated: 16773775,
  //     },
  //     multicall3: {
  //       address: "0xca11bde05977b3631167028862be2a173976ca11",
  //       blockCreated: 14353601,
  //     },
  //   },
} as const satisfies Chain;
