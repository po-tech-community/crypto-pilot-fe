import type { Asset } from "@/types/wallet";

export const ASSETS: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    minDeposit: "0.0001",
    estimatedBlockTimeSec: 600, // ~10 min
    networks: [
      {
        key: "bitcoin",
        label: "Bitcoin",
        addressFormat: "btc",
        requiredConfirmations: 2,
      },
    ],
  },

  {
    symbol: "ETH",
    name: "Ethereum",
    minDeposit: "0.001",
    estimatedBlockTimeSec: 12,
    networks: [
      {
        key: "ethereum",
        label: "Ethereum (ERC20)",
        addressFormat: "evm",
        requiredConfirmations: 12,
      },
    ],
  },

  {
    symbol: "USDT",
    name: "Tether",
    minDeposit: "10",
    estimatedBlockTimeSec: 12,
    networks: [
      {
        key: "ethereum",
        label: "Ethereum (ERC20)",
        addressFormat: "evm",
        requiredConfirmations: 12,
      },
      {
        key: "bsc",
        label: "BNB Smart Chain (BEP20)",
        addressFormat: "evm",
        requiredConfirmations: 15,
      },
      {
        key: "tron",
        label: "Tron (TRC20)",
        addressFormat: "tron",
        requiredConfirmations: 20,
      },
    ],
  },

  {
    symbol: "USDC",
    name: "USD Coin",
    minDeposit: "10",
    estimatedBlockTimeSec: 12,
    networks: [
      {
        key: "ethereum",
        label: "Ethereum (ERC20)",
        addressFormat: "evm",
        requiredConfirmations: 12,
      },
      {
        key: "bsc",
        label: "BNB Smart Chain (BEP20)",
        addressFormat: "evm",
        requiredConfirmations: 15,
      },
    ],
  },
];
