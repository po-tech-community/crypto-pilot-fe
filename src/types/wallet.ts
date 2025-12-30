export type DepositStatus = "PENDING" | "COMPLETED" | "FAILED";

export type NetworkKey =
  | "bitcoin"
  | "ethereum"
  | "bsc"
  | "xrp"
  | "solana";

export type NetworkConfig = {
  key: NetworkKey;
  label: string;
  addressFormat: "btc" | "evm" | "xrp" | "solana";
  requiredConfirmations: number;
  estimatedBlockTimeSec: number;
};

export type Asset = {
  symbol: string;
  name: string;
  minDeposit: string;
  networks: NetworkConfig[];
};
export type Deposit = {
  _id: string;
  userId: string;
  asset: string;
  network: string;
  address: string;
  amount: string;
  txHash?: string | null;
  confirmations: number;
  status: DepositStatus;
  createdAt: string;
  updatedAt: string;
  networkMeta: Pick<
    NetworkConfig,
    "requiredConfirmations" | "estimatedBlockTimeSec">;


};

export type ListDepositParams = {
  limit: number;
  offset: number;
};

export type ListDeposit = {
  data: Deposit[];
};

export type CreateDeposit = {
  asset: string;
  network: string;
  amount?: string;
};

