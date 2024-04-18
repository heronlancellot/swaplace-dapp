import { Chain } from "@wagmi/core";

export const avalanche = {
  id: 1_802_203_764,
  name: "Kakarot Sepolia",
  network: "kakarot_sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, //Ether kakarot Sepolia? Ether Kakarot? What's the currency?
  rpcUrls: {
    default: { http: ["https://sepolia-rpc.kakarot.org"] },
    public: { http: ["https://sepolia-rpc.kakarot.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" }, //What is the explorer?
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;
