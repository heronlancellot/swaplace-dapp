import { defineChain } from "viem";

export const kakarot = defineChain({
  id: 1_802_203_764,
  name: "kakarot sepolia",
  network: "kakarot sepolia",
  nativeCurrency: { name: "KAKAROT", symbol: "KKT", decimals: 18 },
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
